import React from "react";
import "./App.css";
import Preferences from "./components/Preferences/Preferences";
import Dashboard from "./components/Dashboard/Dashboard";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "./components/Login/Login";
import useToken from "./useToken";

export default function App() {
	const {token, setToken} = useToken();
	const pathname = window.location.pathname;

	// Move to login page only once (prevent endless loop)
	if (!token && pathname !== "/login") {
		const origin = window.location.origin;
		const search = `?redirect=${pathname}`;
		const loginHandler = () => {
			window.location.href = origin + "/login" + search;
		}
		return (
			<div>
				<div>You are not authenticated!</div>
				<button onClick={loginHandler}>Login</button>
			</div>
		)
	} else {
		return (
			<div className="wrapper">
				<BrowserRouter>
					<Switch>
						<Route path="/login">
							<Login setToken={setToken}/>
						</Route>
						<Route path="/dashboard">
							<Dashboard/>
						</Route>
						<Route path="/preferences">
							<Preferences/>
						</Route>
					</Switch>
				</BrowserRouter>
			</div>
		);
	}

}