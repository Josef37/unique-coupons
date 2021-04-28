import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { styled } from "@material-ui/core/styles";
import CouponGroupPage from "./pages/coupon-group.component";
import AddCouponsPage from "./pages/add-coupons.component";
import CouponGroupsPage from "./pages/coupon-groups.component";
import SettingsPage from "./pages/settings.component";
import AddCouponGroupPage from "./pages/add-coupon-group.component";
import NavTabs from "./components/nav-tabs.component";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getGroups } from "./redux/coupons.slice";
import CenteredContainer from "./components/centered-container.component";

function App() {
	const [isFetching, setFetching] = useState(true);
	const [error, setError] = useState("");
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getGroups())
			.then(unwrapResult)
			.catch(({ message }) => setError(message))
			.finally(() => setFetching(false));
	}, [dispatch]);

	return (
		<Container>
			<NavTabs
				tabs={[
					{ path: "/", label: "Groups" },
					{ path: "/settings", label: "Settings" },
				]}
			/>
			{isFetching || error ? (
				<CenteredContainer>
					{isFetching ? (
						<CircularProgress size={80} />
					) : (
						<>
							<Typography variant="h3" gutterBottom>
								Error loading data
							</Typography>
							<Typography variant="body1">{error}</Typography>
						</>
					)}
				</CenteredContainer>
			) : (
				<Paper>
					<Box padding={3}>
						<Switch>
							<Route exact path="/settings">
								<SettingsPage />
							</Route>
							<Route
								exact
								path="/group/:groupId"
								render={({ match }) => (
									<CouponGroupPage groupId={Number(match.params.groupId)} />
								)}
							/>
							<Route
								exact
								path="/add-coupons/:groupId"
								render={({ match }) => (
									<AddCouponsPage groupId={Number(match.params.groupId)} />
								)}
							/>
							<Route exact path="/add-coupon-group">
								<AddCouponGroupPage />
							</Route>
							<Route exact path="/">
								<CouponGroupsPage />
							</Route>
							<Route>
								<div>Invalid route</div>
							</Route>
						</Switch>
					</Box>
				</Paper>
			)}
		</Container>
	);
}

const Container = styled("div")({
	marginBottom: "80vh",
});

export default App;
