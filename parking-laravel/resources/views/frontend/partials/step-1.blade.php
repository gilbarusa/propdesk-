<section>
    <style>
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input.form-control.number-days {
            width: 18% !important;
            -moz-appearance: textfield;
        }
        .card-body.per-day-card {
            display: flex;
            padding-bottom: 0px;
            padding-top: 14px;
            justify-content: space-between;
            align-items: center;
        }
        .inner-day {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }
        .right-section {
            font-size: 16px;
            font-weight: 500;
        }
    </style>
    <div class="row">
        <div class="col-lg-6">
            <div class="mb-3">
                <label class="form-label">Building Name</label>
                <select name="building_name" class="form-control select2" id="buildingSelect" required>
                    <option value="" selected disabled>Select Building</option>
                    @foreach($buildings as $key => $building)
                        <option value="{{$building->id }}">{{$building->name}}</option>
                    @endforeach
                </select>
                <span class="invalid-feedback">Please select building</span>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="mb-3">
                <label for="unitSelect">Unit Number</label>
                <select class="form-control" id="unitSelect" required>
                    <option value="1" selected disabled>Select Unit</option>
                </select>
                <span class="invalid-feedback">Please select Unit</span>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="mb-3">
                <label for="noteunitNumber">Note-Unit Number</label>
                <input type="text" value="" id="noteunitNumber" class="form-control" placeholder="Note Unit Number" required>
                <span class="invalid-feedback">Please Enter Note</span>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-6">
            <div class="mb-3">
                <label for="securityCode">Security Code</label>
                <input type="text" id="securityCode" class="form-control" placeholder="Security Code" required>
                <span class="invalid-feedback">Please enter security Code</span>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="mb-3">
                <label for="guestName">Guest Name</label>
                <input type="text" value="" id="guestName" class="form-control" placeholder="Enter Guest Name" required>
                <span class="invalid-feedback">Please Enter Your Name</span>
            </div>
        </div>
    </div>
</section>

{{--
    NOTE: All plan loading and security validation is now handled in script.js
    via the /api/validate-unit server endpoint. No data-password or client-side
    security code exposure.
--}}
