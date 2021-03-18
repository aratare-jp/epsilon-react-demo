import {Breadcrumb, Layout, Menu} from 'antd';
import {PieChartOutlined, UserOutlined} from '@ant-design/icons';
import {useState} from "react";
import {Route, Switch, Link, BrowserRouter, useLocation} from "react-router-dom";
import Student from "../Entities/Student/Student";
import Lecturer from "../Entities/Lecturer/Lecturer";
import Course from "../Entities/Course/Course";
import Home from "../Home/Home";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

export default function Dashboard() {
	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [selectedKey, setSelectedKey] = useState<string>(window.location.pathname);

	const onCollapse = (collapsed: boolean) => {
		setCollapsed(collapsed);
	};

	const onMenuClicked = (e: any) => {
		setSelectedKey(e.key);
	}

	return (
		<BrowserRouter>
			<Layout style={{minHeight: '100vh'}}>
				<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
					<div className="logo"/>
					<Menu
						theme="dark"
						defaultSelectedKeys={[selectedKey]}
						mode="inline"
						onClick={onMenuClicked}
						defaultOpenKeys={["entities"]}
					>
						<Menu.Item key="/dashboard" icon={<PieChartOutlined/>}>
							<Link to="/dashboard">Home</Link>
						</Menu.Item>
						<SubMenu key="entities" icon={<UserOutlined/>} title="Entities">
							<Menu.Item key="/dashboard/student">
								<Link to="/dashboard/student">Student</Link>
							</Menu.Item>
							<Menu.Item key="/dashboard/lecturer">
								<Link to="/dashboard/lecturer">Lecturer</Link>
							</Menu.Item>
							<Menu.Item key="/dashboard/course">
								<Link to="/dashboard/course">Course</Link>
							</Menu.Item>
						</SubMenu>
					</Menu>
				</Sider>
				<Switch>
					<Route path="/dashboard/student">
						<Student/>
					</Route>
					<Route path="/dashboard/lecturer">
						<Lecturer/>
					</Route>
					<Route path="/dashboard/course">
						<Course/>
					</Route>
					<Route path="/dashboard">
						<Home/>
					</Route>
				</Switch>
			</Layout>
		</BrowserRouter>
	);
}
