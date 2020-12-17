import React from 'react';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

const CenteredContainer = ({ children }) => {
	return <Paper>
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			textAlign="center"
			maxHeight="80vh"
			height={700}
		>
			{children}
		</Box>
	</Paper>
}

export default CenteredContainer;
