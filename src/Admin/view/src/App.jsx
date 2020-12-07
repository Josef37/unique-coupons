import React from 'react';
import { Switch, Route } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import CouponGroupPage from './pages/coupon-group.component';
import AddCouponsPage from './pages/add-coupons.component';
import DashboardPage from './pages/dashboard.component';
import SettingsPage from './pages/settings.component';
import AddCouponGroupPage from './pages/add-coupon-group.component';
import NavTabs from './components/nav-tabs.component';

function App() {
	return <div>
		<NavTabs tabs={[
			{ path: '/', label: 'Dashboard' },
			{ path: '/settings', label: 'Settings' }
		]} />
		<Paper>
			<Box padding={3}>
				<Switch>
					<Route exact path="/settings">
						<SettingsPage />
					</Route>
					<Route exact path="/group/:groupId" render={({ match }) =>
						<CouponGroupPage groupId={match.params.groupId} />
					} />
					<Route exact path="/add-coupons/:groupId" render={({ match }) =>
						<AddCouponsPage groupId={match.params.groupId} />
					} />
					<Route exact path="/add-coupon-group">
						<AddCouponGroupPage />
					</Route>
					<Route exact path="/">
						<DashboardPage />
					</Route>
					<Route>
						<div>Invalid route</div>
					</Route>
				</Switch>
			</Box>
		</Paper>
	</div>;
}



export default App;
