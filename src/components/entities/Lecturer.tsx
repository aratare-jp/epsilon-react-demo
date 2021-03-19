import {Breadcrumb, Button, Form, Input, Layout, Modal, Select, Space, Table} from 'antd';
import React, {useState} from "react";
import {Link, Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import {ColumnType} from "antd/lib/table";
import {ILecturer, db} from "../../db";
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

	const data: ILecturer[] = Object.values(db.lecturers);

	const columns: ColumnType<ILecturer>[] = [
		{
			title: "First Name",
			dataIndex: "firstName",
			key: "firstName"
		},
		{
			title: "Last Name",
			dataIndex: "lastName",
			key: "lastName"
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
	const lecturer = db.lecturers[id]
		||	{
				id,
				taughtCourses: [],
				managedCourses: [],
			};
	const [showModal, setShowModal] = useState<boolean>(false);

	const onFinish = (newLecturer: ILecturer) => {
		const oldTaughtCourses = lecturer.taughtCourses;
		const newTaughtCourses = newLecturer.taughtCourses;

		// Remove the current Lecturer from all Courses.
		for (const oldId of oldTaughtCourses) {
			_.remove(db.courses[oldId].lecturers, e => e === id);
		}

		// Re-add the current Lecturer to all new Courses.
		for (const newId of newTaughtCourses) {
			db.courses[newId].lecturers.push(id);
		}

		const oldManagedCourses = lecturer.managedCourses;
		const newManagedCourses = newLecturer.managedCourses;

		// Remove the current Lecturer from all Courses.
		for (const oldId of oldManagedCourses) {
			_.remove(db.courses[oldId].managers, e => e === id);
		}

		// Re-add the current Lecturer to all new Courses.
		for (const newId of newManagedCourses) {
			db.courses[newId].managers.push(id);
		}

		db.lecturers[id] = {...newLecturer, id};

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

	const taughtCoursesOpts = Object.values(db.courses).map(c => <Select.Option key={c.id} value={c.id}>{c.id}</Select.Option>);

	const managedCoursesOpts = Object.values(db.courses).map(c => <Select.Option key={c.id} value={c.id}>{c.id}</Select.Option>);

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
				>
					<Input/>
				</Form.Item>
				<Form.Item
					label="Last Name"
					name="lastName"
				>
					<Input/>
				</Form.Item>

				<Form.Item
					label="Taught Courses"
					name="taughtCourses">
					<Select
						mode="multiple"
						allowClear
						style={{width: '100%'}}
						placeholder="Please select"
					>
						{taughtCoursesOpts}
					</Select>
				</Form.Item>

				<Form.Item
					label="Managed Courses"
					name="managedCourses">
					<Select
						mode="multiple"
						allowClear
						style={{width: '100%'}}
						placeholder="Please select"
					>
						{managedCoursesOpts}
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