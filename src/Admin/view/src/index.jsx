import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider as StoreProvider } from "react-redux";
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";
import { StylesProvider } from "@material-ui/core/styles";
import App from "./App";
import store from "./redux/store";
import { jss, appRoot } from "./configure-shadow-dom";

ReactDOM.render(
	<React.StrictMode>
		<StoreProvider store={store}>
			<StylesProvider jss={jss}>
				<HashRouter>
					<ScopedCssBaseline>
						<App />
					</ScopedCssBaseline>
				</HashRouter>
			</StylesProvider>
		</StoreProvider>
	</React.StrictMode>,
	appRoot
);
