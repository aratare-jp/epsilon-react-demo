import {Breadcrumb, Button, Form, Input, Layout, Modal, Select, Space, Table} from 'antd';
import React, {useState} from "react";
import {Link, Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import {ColumnType} from "antd/lib/table";
import {ILecturer} from "../../../entities/lecturer/lecturer";
import {db} from "../../../db";
import * as _ from 'lodash';
import {v4 as uuidv4} from "uuid";

const {Header, Content, Footer} = Layout;

const layout = {
	labelCol: {span: 8},
	wrapperCol: {span: 16},
};

const tailLayout = {
	wrapperCol: {offset: 8, span: 16},
};

export default function Lecturer() {
	const {path} = useRouteMatch();

	return (
		<Layout className="site-layout">
			<Header className="site-layout-background" style={{padding: 0}}/>
			<Content style={{margin: '0 16px'}}>
				<Breadcrumb style={{margin: '16px 0'}}>
					<Breadcrumb.Item>Entities</Breadcrumb.Item>
					<Breadcrumb.Item>Lecturer</Breadcrumb.Item>
				</Breadcrumb>
				<div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
					<Switch>
						<Route path={`${path}/create`}>
							<CreateEditLecturer reroute={path}/>
						</Route>
						<Route path={`${path}/edit/:id`}>
							<CreateEditLecturer reroute={path}/>
						</Route>
						<Route exact path={path}>
							<ViewLecturer/>
						</Route>
						<Route path="/"
							   render={({location}: any) => (
								   <Redirect to={{
									   pathname: "/404",
									   state: {from: location}
								   }}/>
							   )}/>
					</Switch>
				</div>
			</Content>
			<Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
		</Layout>
	);
}

export function ViewLecturer() {
	const {path} = useRouteMatch();

	const data: ILecturer[] = Object.values(db.lecturer);

	const columns: ColumnType<ILecturer>[] = [
		{
			title: "First Name",
			dataIndex: "firstName",
			key: "firstName",
		},
		{
			title: "Last Name",
			dataIndex: "lastName",
			key: "lastName",
		},
		{
			title: "Action",
			key: "action",
			render: (value: any, record: ILecturer, index: number) => {
				return (
					<Space size="middle">
						<Link to={`${path}/edit/${record.id}`}>
							<Button type="primary">Edit</Button>
						</Link>
					</Space>
				)
			}
		}
	]

	return (
		<>
			<Link to={`${path}/create`}><Button>Create</Button></Link>
			<Table columns={columns} dataSource={data} rowKey="id"/>
		</>
	)
}

export function CreateEditLecturer({reroute}: any) {
	const history = useHistory();
	const id = useParams<{ id: string }>()?.id || uuidv4();
	const lecturer = db.lecturer[id] || {id, courses: []};
	const [showModal, setShowModal] = useState<boolean>(false);

	const onFinish = (newLecturer: ILecturer) => {
		const oldCourses = lecturer.courses;
		const newCourses = newLecturer.courses;

		db.lecturer[id] = {...newLecturer, id};

		// Remove the current lecturer from all courses.
		for (const oldCourse of oldCourses) {
			_.remove(db.course[oldCourse].lecturers, e => e === id);
		}

		// Re-add the current lecturer to all new courses.
		for (const newCourse of newCourses) {
			db.course[newCourse].lecturers.push(id);
		}

		history.replace(reroute);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const onCancel = () => {
		setShowModal(true);
	}

	const onModalOk = () => {
		history.replace(reroute);
	}

	const onModalCancel = () => {
		setShowModal(false);
	}

	const courseIds = Object.values(db.course).map(c => c.id);
	const courseOpts = courseIds.map(cid => <Select.Option key={cid} value={cid}>{cid}</Select.Option>);

	return (
		<>
			<Form
				{...layout}
				name="basic"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				initialValues={lecturer}
			>
				<Form.Item
					label="ID"
					name="id"
				>
					<Input disabled/>
				</Form.Item>

				<Form.Item
					label="First Name"
					name="firstName"
					rules={[{required: true, message: 'Please input first name'}]}
				>
					<Input/>
				</Form.Item>

				<Form.Item
					label="Last Name"
					name="lastName"
					rules={[{required: true, message: 'Please input last name'}]}
				>
					<Input/>
				</Form.Item>

				<Form.Item
					label="Courses"
					name="courses">
					<Select
						mode="multiple"
						allowClear
						style={{width: '100%'}}
						placeholder="Please select"
					>
						{courseOpts}
					</Select>
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit">
						Save
					</Button>
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button onClick={onCancel}>
						Cancel
					</Button>
				</Form.Item>
			</Form>
			<Modal
				title="Cancel?"
				visible={showModal}
				onOk={onModalOk}
				onCancel={onModalCancel}>
				<p>Do you want to cancel?</p>
			</Modal>
		</>
	)
}