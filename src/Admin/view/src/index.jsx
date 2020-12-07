import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import store from './redux/store';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<HashRouter>
				<CssBaseline />
				<App />
			</HashRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById('wp-coupons-root')
);
