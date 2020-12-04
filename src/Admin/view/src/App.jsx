import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import CouponGroup from './pages/coupon-group.component';
import AddCoupons from './pages/add-coupons.component';
import Dashboard from './pages/dashboard.component';
import Settings from './pages/settings.component';

function App() {
	return <div>
		<ul>
			<li><Link to="/">Dashboard</Link></li>
			<li><Link to="/settings">Settings</Link></li>
		</ul>
		<Switch>
			<Route path="/settings">
				<Settings />
			</Route>
			<Route path="/group/:groupId" render={({ match }) =>
				<CouponGroup groupId={match.params.groupId} />
			} />
			<Route path="/add-coupons/:groupId" render={({ match }) =>
				<AddCoupons groupId={match.params.groupId} />
			} />
			<Route>
				<Dashboard />
			</Route>
		</Switch>
	</div>;
}

export default App;
