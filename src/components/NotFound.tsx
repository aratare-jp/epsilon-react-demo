import {useHistory} from "react-router-dom";

export default function NotFound() {
	const history = useHistory();

	const backHandler = () => {
		history.goBack();
	}

	return (
		<>
			<h1>Not Found!</h1>
			<button onClick={backHandler}>Back</button>
		</>
	)
}