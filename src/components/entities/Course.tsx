import {Breadcrumb, Button, Form, Input, Layout, Modal, Select, Space, Table} from 'antd';
import React, {useState} from "react";
import {Link, Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import {ColumnType} from "antd/lib/table";
import {ICourse, db} from "../../db";
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

export default function Course() {
	const {path} = useRouteMatch();

	return (
		<Layout className="site-layout">
			<Header className="site-layout-background" style={{padding: 0}}/>
			<Content style={{margin: '0 16px'}}>
				<Breadcrumb style={{margin: '16px 0'}}>
					<Breadcrumb.Item>Entities</Breadcrumb.Item>
					<Breadcrumb.Item>Course</Breadcrumb.Item>
				</Breadcrumb>
				<div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
					<Switch>
						<Route path={`${path}/create`}>
							<CreateEditCourse reroute={path}/>
						</Route>
						<Route path={`${path}/edit/:id`}>
							<CreateEditCourse reroute={path}/>
						</Route>
						<Route exact path={path}>
							<ViewCourse/>
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

export function ViewCourse() {
	const {path} = useRouteMatch();

	const data: ICourse[] = Object.values(db.courses);

	const columns: ColumnType<ICourse>[] = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "Action",
			key: "action",
			render: (value: any, record: ICourse, index: number) => {
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

export function CreateEditCourse({reroute}: any) {
	const history = useHistory();
	const id = useParams<{ id: string }>()?.id || uuidv4();
	const course = db.courses[id]
		||	{
				id,
				enrolledStudents: [],
				lecturers: [],
				managers: [],
			};
	const [showModal, setShowModal] = useState<boolean>(false);

	const onFinish = (newCourse: ICourse) => {
		const oldEnrolledStudents = course.enrolledStudents;
		const newEnrolledStudents = newCourse.enrolledStudents;

		// Remove the current Course from all Students.
		for (const oldId of oldEnrolledStudents) {
			_.remove(db.students[oldId].enrolledCourses, e => e === id);
		}

		// Re-add the current Course to all new Students.
		for (const newId of newEnrolledStudents) {
			db.students[newId].enrolledCourses.push(id);
		}

		const oldLecturers = course.lecturers;
		const newLecturers = newCourse.lecturers;

		// Remove the current Course from all Lecturers.
		for (const oldId of oldLecturers) {
			_.remove(db.lecturers[oldId].taughtCourses, e => e === id);
		}

		// Re-add the current Course to all new Lecturers.
		for (const newId of newLecturers) {
			db.lecturers[newId].taughtCourses.push(id);
		}

		const oldManagers = course.managers;
		const newManagers = newCourse.managers;

		// Remove the current Course from all Lecturers.
		for (const oldId of oldManagers) {
			_.remove(db.lecturers[oldId].managedCourses, e => e === id);
		}

		// Re-add the current Course to all new Lecturers.
		for (const newId of newManagers) {
			db.lecturers[newId].managedCourses.push(id);
		}

		db.courses[id] = {...newCourse, id};

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

	const enrolledStudentsOpts = Object.values(db.students).map(c => <Select.Option key={c.id} value={c.id}>{c.id}</Select.Option>);

	const lecturersOpts = Object.values(db.lecturers).map(c => <Select.Option key={c.id} value={c.id}>{c.id}</Select.Option>);

	const managersOpts = Object.values(db.lecturers).map(c => <Select.Option key={c.id} value={c.id}>{c.id}</Select.Option>);

	return (
		<>
			<Form
				{...layout}
				name="basic"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				initialValues={course}
			>
				<Form.Item
					label="ID"
					name="id"
				>
					<Input disabled/>
				</Form.Item>

				<Form.Item
					label="Name"
					name="name"
				>
					<Input/>
				</Form.Item>

				<Form.Item
					label="Enrolled Students"
					name="enrolledStudents">
					<Select
						mode="multiple"
						allowClear
						style={{width: '100%'}}
						placeholder="Please select"
					>
						{enrolledStudentsOpts}
					</Select>
				</Form.Item>

				<Form.Item
					label="Lecturers"
					name="lecturers">
					<Select
						mode="multiple"
						allowClear
						style={{width: '100%'}}
						placeholder="Please select"
					>
						{lecturersOpts}
					</Select>
				</Form.Item>

				<Form.Item
					label="Managers"
					name="managers">
					<Select
						mode="multiple"
						allowClear
						style={{width: '100%'}}
						placeholder="Please select"
					>
						{managersOpts}
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