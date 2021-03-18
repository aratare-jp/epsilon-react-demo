import React from 'react';
import './Login.css';
import {useHistory, useLocation} from "react-router-dom";
import * as queryString from 'query-string';
import {Button, Form, Input,} from "antd";

const layout = {
	labelCol: {span: 8},
	wrapperCol: {span: 16},
};

const tailLayout = {
	wrapperCol: {offset: 8, span: 16},
};

interface LoginProps {
	setToken: (token: string) => void
}

export default function Login({setToken}: LoginProps) {
	const history = useHistory();
	const location = useLocation<Location>();
	const params = queryString.parse(location.search);
	const redirect = params["redirect"] as string || "/";

	const onFinish = (values: { username: string, password: string }) => {
		setToken("test123");
		history.replace(redirect);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<Form
			{...layout}
			name="basic"
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
		>
			<Form.Item
				label="Username"
				name="username"
				rules={[{required: true, message: 'Please input your username!'}]}
			>
				<Input/>
			</Form.Item>

			<Form.Item
				label="Password"
				name="password"
				rules={[{required: true, message: 'Please input your password!'}]}
			>
				<Input.Password/>
			</Form.Item>

			<Form.Item {...tailLayout}>
				<Button type="primary" htmlType="submit">
					Login
				</Button>
			</Form.Item>
		</Form>
	);
}
