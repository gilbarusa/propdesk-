@extends('layouts.app')

@section('content')
    <div class="page-content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 class="mb-sm-0 font-size-18">Parking Groups</h4>
                        <div class="page-title-right">
                            <a href="{{ route('parking-group.create') }}" class="btn btn-primary">
                                <i class="bx bx-plus"></i> Add Group
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <x-success-message :message="session('success')" />

                    <div class="card">
                        <div class="card-body">
                            <table class="table table-bordered table-striped mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Group Name</th>
                                        <th>Building</th>
                                        <th>Free Days</th>
                                        <th>Per Day</th>
                                        <th>Min Cost</th>
                                        <th>Plans</th>
                                        <th>Units</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse ($groups as $index => $group)
                                        <tr>
                                            <td>{{ $index + 1 }}</td>
                                            <td><strong>{{ $group->name }}</strong></td>
                                            <td>{{ $group->building->name ?? '—' }}</td>
                                            <td>{{ $group->free ?? '—' }} {{ $group->every ? "/ {$group->every}d" : '' }}</td>
                                            <td>{{ $group->per_day ? '$' . number_format($group->per_day, 2) : '—' }}</td>
                                            <td>{{ $group->minimum_cost ? '$' . number_format($group->minimum_cost, 2) : '—' }}</td>
                                            <td>
                                                @foreach ($group->plans as $plan)
                                                    <span class="badge bg-info">{{ $plan->days }}d = ${{ $plan->price }}</span>
                                                @endforeach
                                                @if ($group->plans->isEmpty())
                                                    <span class="text-muted">None</span>
                                                @endif
                                            </td>
                                            <td>
                                                <span class="badge bg-secondary">{{ $group->units->count() }} units</span>
                                            </td>
                                            <td>
                                                <a href="{{ route('parking-group.edit', $group->id) }}" class="btn btn-sm btn-primary">
                                                    <i class="bx bx-edit"></i>
                                                </a>
                                                <form action="{{ route('parking-group.destroy', $group->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Delete this group? Units will be unassigned.')">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="btn btn-sm btn-danger">
                                                        <i class="bx bx-trash"></i>
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="9" class="text-center text-muted">No parking groups yet. Create one to get started.</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
