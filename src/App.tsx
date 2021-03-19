import React from "react";
import Preferences from "./components/Preferences";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Login from "./components/Login";
import useToken from "./useToken";
import NotFound from "./components/NotFound";
import Home from "./components/Home";

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
						<Route exact path="/"
							   render={({location}: any) => (
								   <Redirect to={{
									   pathname: "/home",
									   state: {from: location}
								   }}/>
							   )}/>
						<Route path="/home">
							<Home/>
						</Route>
						<Route path="/preferences">
							<Preferences/>
						</Route>
						<Route path="/404">
							<NotFound/>
						</Route>
						<Route path="/"
							   render={({location}: any) => (
								   <Redirect to={{
									   pathname: "/404",
									   state: {from: "bruh"}
								   }}/>
							   )}/>
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}