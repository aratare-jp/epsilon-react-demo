import React, {FormEvent, useState} from 'react';
import './Login.css';
import {useLocation, useHistory} from "react-router-dom";
import * as queryString from 'query-string';

interface LoginProps {
	setToken: (token: string) => void
}

export default function Login({setToken}: LoginProps) {
	const [username, setUserName] = useState<string>();
	const [password, setPassword] = useState<string>();

	const history = useHistory();
	const location = useLocation<Location>();
	const params = queryString.parse(location.search);
	const redirect = params["redirect"] as string || "/";

	function submitHandler(e: FormEvent) {
		e.preventDefault();
		setToken("test123");
		history.replace(redirect);
	}

	return (
		<div className="loginWrapper">
			<h1>Please log in</h1>
			<form onSubmit={submitHandler}>
				<label>
					<p>Username</p>
					<input type="text" onChange={e => setUserName(e.target.value)}/>
				</label>
				<label>
					<p>Password</p>
					<input type="password" onChange={e => setPassword(e.target.value)}/>
				</label>
				<div>
					<button type="submit">Submit</button>
				</div>
			</form>
		</div>
	)
}