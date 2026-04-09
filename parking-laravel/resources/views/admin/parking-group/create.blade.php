@extends('layouts.app')

@section('content')
    <div class="page-content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">Create Parking Group</h4>
                        <div class="page-title-right">
                            <a href="{{ route('parking-group.index') }}" class="btn btn-primary">
                                <i class="bx bx-arrow-back"></i> Back to Groups
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <x-error-message :message="$errors->first('message')" />

                    <div class="card">
                        <div class="card-body">
                            <form action="{{ route('parking-group.store') }}" method="POST">
                                @csrf

                                {{-- Group Info --}}
                                <div class="row">
                                    <div class="col-lg-4 mb-3">
                                        <label for="name">Group Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="name" id="name"
                                               placeholder="e.g. Guests, Owners, Staff" required
                                               value="{{ old('name') }}">
                                    </div>
                                    <div class="col-lg-4 mb-3">
                                        <label for="building_id">Building <span class="text-danger">*</span></label>
                                        <select class="form-control select2" name="building_id" id="building_id" required>
                                            <option value="" disabled selected>Select Building</option>
                                            @foreach ($buildings as $building)
                                                <option value="{{ $building->id }}">{{ $building->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>

                                {{-- Base Pricing --}}
                                <h5 class="mt-3 mb-3">Pricing</h5>
                                <div class="row">
                                    <div class="col-md-2 mb-3">
                                        <label for="free_days">Free Days</label>
                                        <input type="number" class="form-control" name="free_days" id="free_days"
                                               value="{{ old('free_days') }}" min="0">
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="every_days">Every (days)</label>
                                        <input type="number" class="form-control" name="every_days" id="every_days"
                                               value="{{ old('every_days') }}" min="0">
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="per_day">Per Day ($)</label>
                                        <input type="number" class="form-control" name="per_day" id="per_day"
                                               value="{{ old('per_day') }}" step="0.01" min="0">
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="minimum_cost">Min Cost ($)</label>
                                        <input type="number" class="form-control" name="minimum_cost" id="minimum_cost"
                                               value="{{ old('minimum_cost') }}" step="0.01" min="0">
                                    </div>
                                </div>

                                {{-- Period Plans --}}
                                <h5 class="mt-2 mb-3">Period Plans</h5>
                                <div id="periods"></div>
                                <button type="button" id="add-period-btn" class="btn btn-sm btn-primary mt-2 mb-4">
                                    <i class="bx bx-plus"></i> Add Period
                                </button>

                                {{-- Unit Assignment --}}
                                <h5 class="mt-2 mb-3">Assign Units</h5>
                                <p class="text-muted">Select a building first to see available units.</p>
                                <div id="units-container" class="row mb-4">
                                    {{-- Populated by AJAX when building is selected --}}
                                </div>

                                <div class="mb-3">
                                    <button type="submit" class="btn btn-primary w-md">Create Group</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            let periodCount = 0;

            function renumberPeriods() {
                $('#periods .period-section').each(function(index) {
                    $(this).find('input[name^="periods"]').each(function() {
                        let name = $(this).attr('name');
                        name = name.replace(/\[\d+\]/, '[' + index + ']');
                        $(this).attr('name', name);
                    });
                    $(this).find('label:first').text('Period ' + (index + 1));
                });
            }

            $('#add-period-btn').click(function(e) {
                e.preventDefault();
                periodCount++;
                $('#periods').append(`
                    <div class="row mb-3 period-section" id="period-${periodCount}">
                        <div class="col-md-2">
                            <label>Period ${periodCount}</label>
                            <input type="number" name="periods[${periodCount}][days]" value="" class="form-control" placeholder="Days">
                        </div>
                        <div class="col-md-2">
                            <label>Price ($)</label>
                            <input type="number" name="periods[${periodCount}][price]" value="" class="form-control" step="0.01" placeholder="Price">
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-danger mt-4 remove-period-btn">Remove</button>
                        </div>
                    </div>
                `);
                renumberPeriods();
            });

            $(document).on('click', '.remove-period-btn', function(e) {
                e.preventDefault();
                $(this).closest('.period-section').remove();
                renumberPeriods();
            });

            // Load units when building changes
            $('#building_id').change(function() {
                let buildingId = $(this).val();
                if (!buildingId) return;

                $.get('/parking-group/units-by-building/' + buildingId, function(units) {
                    let html = '';
                    if (units.length === 0) {
                        html = '<div class="col-12"><p class="text-muted">No units found for this building.</p></div>';
                    } else {
                        units.forEach(function(unit) {
                            let inGroup = unit.parking_group_id ? ' <span class="text-warning">(in another group)</span>' : '';
                            html += `
                                <div class="col-md-3 mb-2">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="unit_ids[]"
                                               value="${unit.id}" id="unit-${unit.id}">
                                        <label class="form-check-label" for="unit-${unit.id}">
                                            ${unit.unit_number}${inGroup}
                                        </label>
                                    </div>
                                </div>
                            `;
                        });
                    }
                    $('#units-container').html(html);
                });
            });
        });
    </script>
@endsection
