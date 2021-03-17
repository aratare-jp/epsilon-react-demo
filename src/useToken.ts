import {useState} from "react";

export default function useToken() {
	function getToken() {
		return localStorage.getItem("token");
	}

	const [token, setToken] = useState<string | null>(getToken());

	function saveToken(userToken: string) {
		localStorage.setItem("token", userToken);
		setToken(userToken);
	}

	return {
		setToken: saveToken,
		token
	}
}