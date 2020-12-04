import React from 'react';
import { Link, useLocation } from "react-router-dom";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

const NavTabs = ({ tabs }) => {
	return <Tabs value={useLocation().pathname}>
		{tabs.map(({ path, label }) =>
			<Tab
				label={label}
				component={Link}
				exact
				to={path}
				value={path}
			/>)
		}
	</Tabs>
}

export default NavTabs;
