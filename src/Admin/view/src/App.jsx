import React from 'react';
import styled from "styled-components"
import CouponGroup from './pages/coupon-group.component';
import Dashboard from './pages/dashboard.component';
import Settings from './pages/settings.component';

const NormalizedDiv = styled.div`
  line-height: initial;
`;

function App() {
  return <NormalizedDiv>
	<Dashboard />
	<Settings />
	<CouponGroup />
  </NormalizedDiv>;
}

export default App;
