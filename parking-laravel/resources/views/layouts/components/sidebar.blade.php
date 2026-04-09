<div class="vertical-menu">

    <div data-simplebar class="h-100">

        <!--- Sidemenu -->
        <div id="sidebar-menu">
            <!-- Left Menu Start -->
            <ul class="metismenu list-unstyled" id="side-menu">
                <li class="menu-title" key="t-menu">Menu</li>

                <li @class(['mm-active' => Request::is(['building','building/create','building/*/edit'])])>
                    <a href="{{ route('building.index') }}" class="waves-effect">
                        <i class="bx bx-building"></i>
                        <span>Manage Buildings</span>
                    </a>
                </li>
                <li @class(['mm-active' => Request::is(['unit','unit/create','unit/*/edit'])])>
                    <a href="{{ route('unit.index') }}" class="waves-effect">
                        <i class="bx bx-buildings"></i>
                        <span>Manage Units</span>
                    </a>
                </li>
                <li @class(['mm-active' => Request::is(['parking-group','parking-group/create','parking-group/*/edit'])])>
                    <a href="{{ route('parking-group.index') }}" class="waves-effect">
                        <i class="bx bx-group"></i>
                        <span>Parking Groups</span>
                    </a>
                </li>
                <li @class(['mm-active' => Request::is(['parkings'])])>
                    <a href="{{ route('parking.index') }}" class="waves-effect">
                        <i class="bx bx-building-house"></i>
                        <span>Manage Parkings</span>
                    </a>
                </li>

                <li @class(['mm-active' => Request::is(['settings','view.privacy.policy'])])>
                    <a href="javascript: void(0);" class="has-arrow waves-effect" aria-expanded="false">
                        <i class="bx bx-cog"></i>
                        <span>Settings</span>
                    </a>
                    <ul class="sub-menu mm-collapse mm-show" aria-expanded="false" style="">
                        <li @class(['mm-active' => Request::is(['settings'])])><a href="{{ route('settings') }}" key="t-default">Change Password</a></li>
                        <li @class(['mm-active' => Request::is(['payment-account.index'])])><a href="{{ route('payment-account.index') }}" key="t-default">Payment Settings</a></li>
                        <li @class(['mm-active' => Request::is(['view.privacy.policy'])])><a href="{{ route('view.privacy.policy') }}" key="t-saas">Privacy Policy</a></li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- Sidebar -->
    </div>
</div>
