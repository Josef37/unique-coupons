import React from 'react';
import styled from "styled-components"
import { Switch, Route, Link, useParams } from "react-router-dom";
import CouponGroup from './pages/coupon-group.component';
import Dashboard from './pages/dashboard.component';
import Settings from './pages/settings.component';

const NormalizedDiv = styled.div`
  line-height: initial;
`;

function App() {
	return <NormalizedDiv>
		<Switch>
			<Route path="/settings">
				<Settings />
			</Route>
			<Route path="/group/:groupId" render={({ match }) =>
				<CouponGroup groupId={match.params.groupId} />
			} />
			<Route>
				<Dashboard />
				<Link to="/settings">Settings</Link>
				<Link to="/group/1">Group</Link>
			</Route>
		</Switch>
	</NormalizedDiv>;
}

export default App;
