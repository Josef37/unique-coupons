import React from 'react';
import styled from "styled-components"
import { Switch, Route, Link } from "react-router-dom";
import CouponGroup from './pages/coupon-group.component';
import AddCoupons from './pages/add-coupons.component';
import Dashboard from './pages/dashboard.component';
import Settings from './pages/settings.component';

const NormalizedDiv = styled.div`
  line-height: initial;
`;

function App() {
	return <NormalizedDiv>
		<ul>
			<li><Link to="/">Dashboard</Link></li>
			<li><Link to="/settings">Settings</Link></li>
			<li><Link to="/group/1">Group 1</Link></li>
			<li><Link to="/group/2">Group 2</Link></li>
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
	</NormalizedDiv>;
}

export default App;
