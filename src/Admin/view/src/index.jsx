import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Normalize } from 'styled-normalize'
import App from './App';
import store from './redux/store';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<HashRouter>
				<Normalize />
				<App />
			</HashRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById('wp-coupons-root')
);
