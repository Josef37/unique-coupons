import React from 'react';
import { Link } from "react-router-dom"
import { styled } from "@material-ui/core/styles"
import MuiLink from '@material-ui/core/Link';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const BackLink = ({ to, children }) => {
	return <StyledLink
		component={Link}
		to={to}
		variant="body1"
	>
		<StyledBackIcon />
		{children}
	</StyledLink>
}

const StyledLink = styled(MuiLink)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	marginBottom: theme.spacing(1)
}))

const StyledBackIcon = styled(ArrowBackIcon)(({ theme }) => ({
	marginRight: theme.spacing(0.5),
	marginTop: -2
}))

export default BackLink;
