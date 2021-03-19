import {Breadcrumb, Button, Form, Input, Layout, Modal, Select, Space, Table} from 'antd';
import React, {useState} from "react";
import {Link, Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import {ColumnType} from "antd/lib/table";
import {IStudent, db} from "../../db";
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

export default function Student() {
	const {path} = useRouteMatch();

	return (
		<Layout className="site-layout">
			<Header className="site-layout-background" style={{padding: 0}}/>
			<Content style={{margin: '0 16px'}}>
				<Breadcrumb style={{margin: '16px 0'}}>
					<Breadcrumb.Item>Entities</Breadcrumb.Item>
					<Breadcrumb.Item>Student</Breadcrumb.Item>
				</Breadcrumb>
				<div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
					<Switch>
						<Route path={`${path}/create`}>
							<CreateEditStudent reroute={path}/>
						</Route>
						<Route path={`${path}/edit/:id`}>
							<CreateEditStudent reroute={path}/>
						</Route>
						<Route exact path={path}>
							<ViewStudent/>
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

export function ViewStudent() {
	const {path} = useRouteMatch();

	const data: IStudent[] = Object.values(db.students);

	const columns: ColumnType<IStudent>[] = [
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
			render: (value: any, record: IStudent, index: number) => {
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

export function CreateEditStudent({reroute}: any) {
	const history = useHistory();
	const id = useParams<{ id: string }>()?.id || uuidv4();
	const student = db.students[id]
		||	{
				id,
				enrolledCourses: [],
			};
	const [showModal, setShowModal] = useState<boolean>(false);

	const onFinish = (newStudent: IStudent) => {
		const oldEnrolledCourses = student.enrolledCourses;
		const newEnrolledCourses = newStudent.enrolledCourses;

		// Remove the current Student from all Courses.
		for (const oldId of oldEnrolledCourses) {
			_.remove(db.courses[oldId].enrolledStudents, e => e === id);
		}

		// Re-add the current Student to all new Courses.
		for (const newId of newEnrolledCourses) {
			db.courses[newId].enrolledStudents.push(id);
		}

		db.students[id] = {...newStudent, id};

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

	const enrolledCoursesOpts = Object.values(db.courses).map(c => <Select.Option key={c.id} value={c.id}>{c.id}</Select.Option>);

	return (
		<>
			<Form
				{...layout}
				name="basic"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				initialValues={student}
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
					label="Enrolled Courses"
					name="enrolledCourses">
					<Select
						mode="multiple"
						allowClear
						style={{width: '100%'}}
						placeholder="Please select"
					>
						{enrolledCoursesOpts}
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