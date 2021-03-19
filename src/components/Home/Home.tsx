import {Layout, Menu} from 'antd';
import {PieChartOutlined, UserOutlined} from '@ant-design/icons';
import React, {useState} from "react";
import {Link, Redirect, Route, Switch, useLocation, useRouteMatch} from "react-router-dom";
import Student from "../Entities/Student/Student";
import Lecturer from "../Entities/Lecturer/Lecturer";
import Course from "../Entities/Course/Course";
import Main from "../Main/Main";

const {Sider} = Layout;
const {SubMenu} = Menu;

export default function Home() {
	const {path, url} = useRouteMatch();
	const location = useLocation<Location>();
	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

	const onCollapse = (collapsed: boolean) => {
		setCollapsed(collapsed);
	};

	const onMenuClicked = (e: any) => {
		setSelectedKey(e.key);
	}

	return (
		<Layout style={{minHeight: '100vh'}}>
			<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
				<div className="logo"/>
				<Menu
					theme="dark"
					defaultSelectedKeys={[selectedKey]}
					mode="inline"
					onClick={onMenuClicked}
					defaultOpenKeys={[`${url}/entities`]}
				>
					<Menu.Item key={url} icon={<PieChartOutlined/>}>
						<Link to={url}>Home</Link>
					</Menu.Item>
					<SubMenu key={`${url}/entities`} icon={<UserOutlined/>} title="Entities">
						<Menu.Item key={`${url}/entities/student`}>
							<Link to={`${url}/entities/student`}>Student</Link>
						</Menu.Item>
						<Menu.Item key={`${url}/entities/lecturer`}>
							<Link to={`${url}/entities/lecturer`}>Lecturer</Link>
						</Menu.Item>
						<Menu.Item key={`${url}/entities/course`}>
							<Link to={`${url}/entities/course`}>Course</Link>
						</Menu.Item>
					</SubMenu>
				</Menu>
			</Sider>
			<Switch>
				<Route path={`${path}/entities/student`}>
					<Student/>
				</Route>
				<Route path={`${path}/entities/lecturer`}>
					<Lecturer/>
				</Route>
				<Route path={`${path}/entities/course`}>
					<Course/>
				</Route>
				<Route exact path={path}>
					<Main/>
				</Route>
				<Route path="/"
					   render={({location}: any) => (
						   <Redirect to={{
							   pathname: "/404",
							   state: {from: location}
						   }}/>
					   )}/>
			</Switch>
		</Layout>
	);
}
