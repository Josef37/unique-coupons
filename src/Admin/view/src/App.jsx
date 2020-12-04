import React from 'react';
import { Switch, Route } from "react-router-dom";
import CouponGroup from './pages/coupon-group.component';
import AddCoupons from './pages/add-coupons.component';
import Dashboard from './pages/dashboard.component';
import Settings from './pages/settings.component';
import NavTabs from './components/nav-tabs.component';

function App() {
	return <div>
		<NavTabs tabs={[
			{ path: '/', label: 'Dashboard' },
			{ path: '/settings', label: 'Settings' }
		]} />
		<Switch>
			<Route exact path="/settings">
				<Settings />
			</Route>
			<Route exact path="/group/:groupId" render={({ match }) =>
				<CouponGroup groupId={match.params.groupId} />
			} />
			<Route exact path="/add-coupons/:groupId" render={({ match }) =>
				<AddCoupons groupId={match.params.groupId} />
			} />
			<Route exact path="/">
				<Dashboard />
			</Route>
			<Route>
				<div>Invalid route</div>
			</Route>
		</Switch>
	</div>;
}

export default App;
