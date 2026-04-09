/**
 * Secure Parking Booking Flow
 * - Security code validated on server (never in browser)
 * - Amount calculated on server (never trusted from client)
 * - Stripe PaymentIntent flow (not legacy token/charge)
 */
$(function () {
    // ── State ──
    var bookingState = {
        buildingId: null,
        unitId: null,
        securityCode: null,
        guestName: null,
        noteUnitNumber: null,
        validated: false,        // server said security code is OK
        plans: null,             // server-resolved plans
        freeEligible: false,
        accountId: null,
        stripeKey: null,
        selectedPlan: null,      // e.g. "3days", "per_day_plan", "30days"
        selectedDays: 0,
        selectedPrice: 0,
        parkingId: null,
        clientSecret: null,      // Stripe PaymentIntent client_secret
    };

    // ── Wizard setup ──
    $("#book-parking-form").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slide",
        onStepChanging: function (event, currentIndex, newIndex) {
            if (currentIndex > newIndex) return true; // allow backward

            var $section = $(this).find("section").eq(currentIndex);
            var valid = true;
            var invalidCount = 0;

            // Basic required-field check
            $section.find("input:visible, select:visible").each(function () {
                if ($(this).prop("required") && !$(this).val()) {
                    invalidCount++;
                    $(this).addClass("is-invalid");
                    if ($(this).hasClass('select2')) {
                        $(this).parent().find('.select2-selection').css({'border': '1px solid #f46a6a'});
                    }
                    if ($(this).attr('data-provide') === 'datepicker') {
                        $(this).parents('.datepicker-container').find('.invalid-feedback').show();
                    }
                } else {
                    $(this).removeClass("is-invalid");
                    if ($(this).hasClass('select2')) {
                        $(this).parent().find('.select2-selection').removeAttr('style');
                    }
                    if ($(this).attr('data-provide') === 'datepicker') {
                        $(this).parents('.datepicker-container').find('.invalid-feedback').hide();
                    }
                }
            });

            if (invalidCount > 0) valid = false;

            // Step 0 → 1: validate unit + security code on server
            if (currentIndex === 0) {
                if (!bookingState.validated) {
                    valid = false;
                    // Block step change, trigger server validation
                    validateOnServer();
                }
                if (!bookingState.validated) return false;

                // Hide next until plan is selected
                if (!$('[name="selected_plan"]').val()) {
                    $('.actions').addClass('d-none');
                }
            }

            // Step 1 → 2: ensure plan is selected
            if (currentIndex === 1 && !$('.vehicle-form').hasClass('d-none')) {
                $('.actions').removeClass('d-none');
            } else if (currentIndex === 1) {
                $('.actions').addClass('d-none');
            }

            // Step 2 → 3: show payment or T&C
            if (newIndex === 3 && valid) {
                if (bookingState.selectedPrice > 0) {
                    $('.paying-amount').text(bookingState.selectedPrice.toFixed(2));
                    $('.actions').addClass('d-none');
                    $('.proceed-payment-btn').removeClass('d-none');
                } else {
                    $('.actions').removeClass('d-none');
                    $('.proceed-payment-btn').addClass('d-none');
                    $('.payment-section').addClass('d-none');
                    $('.terms-and-conditions').removeClass('d-none');
                }
            }

            return valid;
        },
        onFinished: function () {
            submitBooking();
        }
    });

    $('[aria-label="Pagination"] li:last a').html('Confirm');

    // ═══════════════════════════════════════════════════
    //  Step 0: Building / Unit selection
    // ═══════════════════════════════════════════════════

    $('#buildingSelect').on('change', function () {
        var selectedBuilding = $(this).val();
        var $unitSelect = $('#unitSelect');
        bookingState.validated = false;
        bookingState.buildingId = selectedBuilding;

        $unitSelect.empty().append('<option value="" selected disabled>Select Unit</option>');

        $.ajax({
            url: '/units-by-building-id/' + selectedBuilding,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.units && response.units.length > 0) {
                    response.units.forEach(function (unit) {
                        // NO data-password — security code stays on server
                        $unitSelect.append(
                            '<option value="' + unit.id + '">' + unit.unit_number + '</option>'
                        );
                    });
                } else {
                    $unitSelect.append('<option value="" disabled>No units available</option>');
                }
            }
        });
    });

    $('#unitSelect').on('change', function () {
        bookingState.validated = false;
        bookingState.unitId = $(this).val();
    });

    // ═══════════════════════════════════════════════════
    //  Server-side validation (replaces client-side code check)
    // ═══════════════════════════════════════════════════

    function validateOnServer() {
        bookingState.buildingId = $("#buildingSelect").val();
        bookingState.unitId = $("#unitSelect").val();
        bookingState.securityCode = $("#securityCode").val();
        bookingState.guestName = $("#guestName").val();
        bookingState.noteUnitNumber = $("#noteunitNumber").val();

        if (!bookingState.buildingId || !bookingState.unitId || !bookingState.securityCode ||
            !bookingState.guestName || !bookingState.noteUnitNumber) {
            return;
        }

        // Show loading
        $('#securityCode').removeClass('is-invalid');
        $('#securityCode').attr('disabled', true);

        $.ajax({
            url: '/api/validate-unit',
            type: 'POST',
            contentType: 'application/json',
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            data: JSON.stringify({
                building_id: bookingState.buildingId,
                unit_id: bookingState.unitId,
                security_code: bookingState.securityCode
            }),
            dataType: 'json',
            success: function (response) {
                $('#securityCode').attr('disabled', false);

                if (response.success) {
                    bookingState.validated = true;
                    bookingState.plans = response.plans;
                    bookingState.freeEligible = response.free_eligible;
                    bookingState.stripeKey = response.stripe_key;
                    bookingState.accountId = response.account_id;

                    // Build plan cards
                    buildPlanCards(response.plans, response.free_eligible);

                    // Initialize Stripe if we have a key
                    if (response.stripe_key) {
                        stripeGateway(response.stripe_key);
                    }

                    // Load saved vehicles
                    loadVehicles(response.vehicles);

                    // Auto-advance to next step
                    $("#book-parking-form").steps("next");
                } else {
                    alert(response.message || "Validation failed.");
                    $('#securityCode').addClass('is-invalid');
                }
            },
            error: function (xhr) {
                $('#securityCode').attr('disabled', false);
                var msg = (xhr.responseJSON && xhr.responseJSON.message) || "Invalid security code.";
                alert(msg);
                $('#securityCode').addClass('is-invalid');
            }
        });
    }

    // ═══════════════════════════════════════════════════
    //  Build plan cards from server data
    // ═══════════════════════════════════════════════════

    function buildPlanCards(plans, freeEligible) {
        var html = '';

        // Free plan card
        if (plans.free > 0) {
            var freeClass = freeEligible ? 'bg-primary-subtle' : 'bg-dark-subtle text-white';
            html += '<div class="col-lg-6"><div class="mb-3">' +
                '<div class="card shadow-sm ' + freeClass + ' plan-container" data-plan="' + plans.free + 'days" data-price="0" data-days="' + plans.free + '">' +
                '<div class="card-body">' +
                '<h5>' + plans.free + ' Days Parking (Free Every ' + plans.every + ' Days)</h5>' +
                '<h4>Free</h4>' +
                '</div></div></div></div>';
        }

        // Per-day plan card
        html += '<div class="col-lg-6"><div class="mb-3">' +
            '<div class="card shadow-sm bg-primary-subtle plan-container" data-plan="per_day_plan" data-price="0" data-days="0">' +
            '<div class="card-body per-day-card">' +
            '<div class="col-md-8 left-section">';

        if (plans.minimum_cost > 0) {
            html += '<span>$</span>' + plans.per_day + ' Per Day (minimum <span>$</span>' + plans.minimum_cost + ')<br/>';
        } else {
            html += '<span>$</span>' + plans.per_day + ' Per Day<br/>';
        }

        html += '<div class="inner-day">Enter number of days <input type="number" name="number_of_days" class="form-control number-days" placeholder="0"></div><br/>' +
            '</div>' +
            '<div class="col-md-4 right-section text-end">Total : $<span class="total-cost">0</span></div>' +
            '</div>' +
            '<input type="hidden" id="per_day" value="' + plans.per_day + '">' +
            '<input type="hidden" id="minimum_cost" value="' + plans.minimum_cost + '">' +
            '</div></div></div>';

        // Period plans
        if (plans.parkings && plans.parkings.length > 0) {
            plans.parkings.forEach(function (p) {
                var price = parseFloat(p.price).toFixed(2);
                html += '<div class="col-lg-6"><div class="mb-3">' +
                    '<div class="card shadow-sm bg-primary-subtle plan-container" data-plan="' + p.days + 'days" data-price="' + p.price + '" data-days="' + p.days + '">' +
                    '<div class="card-body">' +
                    '<h5>' + p.days + ' Days Parking</h5>' +
                    '<h4><span>$</span>' + price + '</h4>' +
                    '</div></div></div></div>';
            });
        }

        $('#plans-list').html(html);
        setupKeyupListener();
    }

    function loadVehicles(vehicles) {
        $('#prev-vehicles-history').html('');
        if (vehicles && vehicles.length > 0) {
            $('#prev-vehicle-history-buttons').removeClass('d-none');
            $('.vehicle-form').addClass('d-none');
            vehicles.forEach(function (vehicle, index) {
                $('#prev-vehicles-history').append(
                    '<tr data-vehicle="' + encodeURIComponent(JSON.stringify(vehicle)) + '">' +
                    '<td>' + (index + 1) + '</td>' +
                    '<td>' + vehicle.car_brand + '</td>' +
                    '<td>' + vehicle.model + '</td>' +
                    '<td>' + vehicle.license_plate + '</td>' +
                    '<td><button class="btn btn-primary btn-sm use-vehicle"><i class="fa fa-check"></i></button></td>' +
                    '</tr>'
                );
            });
        } else {
            $('#prev-vehicle-history-buttons').addClass('d-none');
            $('.vehicle-form').removeClass('d-none');
        }
    }

    // ═══════════════════════════════════════════════════
    //  Plan selection
    // ═══════════════════════════════════════════════════

    $(document).on('click', '.plan-container:not(.bg-dark-subtle)', function () {
        var dataPlan = $(this).attr('data-plan');
        var price    = parseFloat($(this).attr('data-price')) || 0;
        var days     = parseInt($(this).attr('data-days')) || 0;

        bookingState.selectedPlan  = dataPlan;
        bookingState.selectedPrice = price;
        bookingState.selectedDays  = days;

        $('[name="selected_plan"]').val(dataPlan);
        $('[name="30_days_cost"]').val(price);
        $('[name="total_days"]').val(days);

        $('.actions').removeClass('d-none');
        $('.proceed-payment-btn').addClass('d-none');
        $('.payment-section').addClass('d-none');
        $('.terms-and-conditions').removeClass('d-none');

        $('.plan-container').removeClass('bg-primary text-white').addClass('bg-primary-subtle');
        $(this).toggleClass('bg-primary-subtle bg-primary text-white');

        if (dataPlan === 'per_day_plan') {
            var numberOfDays = parseInt($('[name="number_of_days"]').val()) || 0;
            if (numberOfDays <= 0) {
                $('.actions').addClass('d-none');
            }
        }
    });

    function setupKeyupListener() {
        $('[name="number_of_days"]').on('keyup', function () {
            var numberOfDays = parseInt($(this).val()) || 0;
            var perDay       = parseFloat($('#per_day').val()) || 0;
            var minimumCost  = parseFloat($('#minimum_cost').val()) || 0;
            var totalCost    = perDay * numberOfDays;

            if (totalCost <= 0) {
                $('.total-cost').text('0.00');
                $('.actions').addClass('d-none');
                return;
            }
            if (totalCost < minimumCost) {
                totalCost = minimumCost;
            }
            $('.total-cost').text(totalCost.toFixed(2));
            $('.actions').removeClass('d-none');

            bookingState.selectedPrice = totalCost;
            bookingState.selectedDays  = numberOfDays;

            $('[data-plan="per_day_plan"]').attr('data-price', totalCost);
            $('[data-plan="per_day_plan"]').attr('data-days', numberOfDays);
            $('[name="selected_plan"]').val('per_day_plan');
            $('[name="30_days_cost"]').val(totalCost);
            $('[name="total_days"]').val(numberOfDays);
        });
    }

    $('.first').click(function () {
        $('.actions').removeClass('d-none');
    });

    // ═══════════════════════════════════════════════════
    //  Submit booking (Step 4 → Finish)
    // ═══════════════════════════════════════════════════

    function submitBooking() {
        var formData = {
            building_id:      bookingState.buildingId,
            unit_id:          bookingState.unitId,
            security_code:    bookingState.securityCode,
            plan:             $('[name="selected_plan"]').val(),
            total_days:       bookingState.selectedDays || parseInt($('[name="total_days"]').val()) || 0,
            start_date:       $("#start-date").val(),
            car_brand:        $("#brand").val(),
            model:            $("#model").val(),
            color:            $("#color").val(),
            license_plate:    $("#license-plate").val(),
            guest_name:       bookingState.guestName,
            note_unit_number: bookingState.noteUnitNumber,
            email:            $("#email").val() || null,
            phone_number:     $("#phone").val() || null,
        };

        $('#processing').css('display', 'flex');

        $.ajax({
            url: '/api/create-booking',
            type: 'POST',
            contentType: 'application/json',
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            data: JSON.stringify(formData),
            dataType: 'json',
            success: function (response) {
                if (!response.success) {
                    $('#processing').css('display', 'none');
                    alert(response.message || 'Something went wrong!');
                    return;
                }

                if (response.free) {
                    // Free booking — done, redirect to invoice
                    $('#processing i').attr('class', 'mdi mdi-check-all fs-1 text-success');
                    $('#processing p').html('Booking confirmed! Redirecting...');
                    window.location = '/parking-booked/' + response.token;
                } else {
                    // Paid booking — need to confirm payment with Stripe
                    bookingState.parkingId = response.parking_id;
                    bookingState.clientSecret = response.client_secret;
                    $('#processing').css('display', 'none');

                    // Show payment UI
                    $('.terms-and-conditions').addClass('d-none');
                    $('.payment-section').removeClass('d-none');
                    $('.paying-amount').text(response.amount.toFixed(2));
                }
            },
            error: function (xhr) {
                $('#processing').css('display', 'none');
                var msg = (xhr.responseJSON && xhr.responseJSON.message) || 'Something went wrong!';
                alert(msg);
            }
        });
    }

    // ═══════════════════════════════════════════════════
    //  Payment: Stripe PaymentIntent confirmation
    // ═══════════════════════════════════════════════════

    $('#make-payment').on('click', function () {
        if (!bookingState.clientSecret) {
            alert('No payment session found. Please try again.');
            return;
        }

        var $btn = $(this);
        $btn.attr('disabled', 'disabled').text('Processing...');

        stripe.confirmCardPayment(bookingState.clientSecret, {
            payment_method: {
                card: cardElement,
            }
        }).then(function (result) {
            if (result.error) {
                $btn.removeAttr('disabled').text('Proceed');
                $('#card-errors').text(result.error.message);
            } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                // Tell server to finalize
                $.ajax({
                    url: '/api/confirm-payment',
                    type: 'POST',
                    contentType: 'application/json',
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    data: JSON.stringify({
                        parking_id: bookingState.parkingId,
                        payment_intent_id: result.paymentIntent.id,
                    }),
                    dataType: 'json',
                    success: function (confirmResp) {
                        if (confirmResp.success) {
                            window.location = '/parking-booked/' + confirmResp.token;
                        } else {
                            $btn.removeAttr('disabled').text('Proceed');
                            alert(confirmResp.message || 'Payment confirmation failed.');
                        }
                    },
                    error: function () {
                        $btn.removeAttr('disabled').text('Proceed');
                        alert('Payment confirmation failed. Please contact support.');
                    }
                });
            }
        });
    });

    // ── Continue to payment button (terms → payment form) ──
    $('.continue-payment').click(function () {
        // For the new flow, the booking is already created; just show Stripe
        if (bookingState.clientSecret) {
            $('.terms-and-conditions').addClass('d-none');
            $('.payment-section').removeClass('d-none');
        } else {
            // Trigger booking creation first
            submitBooking();
        }
    });
});

// ═══════════════════════════════════════════════════
//  Stripe Elements setup
// ═══════════════════════════════════════════════════
var stripe;
var cardElement;

function stripeGateway(stripe_key) {
    stripe = Stripe(stripe_key);
    var elements = stripe.elements();

    var checkoutStyle = {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            lineHeight: "24px",
            padding: "10px",
            '::placeholder': { color: '#aab7c4' }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

    cardElement = elements.create('card', {
        hidePostalCode: true,
        style: checkoutStyle
    });

    cardElement.mount('#card-element');

    cardElement.on('change', function (event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}
