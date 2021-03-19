import {Breadcrumb, Button, Form, Input, Layout, Modal, Select, Space, Table} from 'antd';
import React, {useState} from "react";
import {Link, Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import {ColumnType} from "antd/lib/table";
import {ICourse} from "../../../entities/course/course";
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

	const data: ICourse[] = Object.values(db.course);

	const columns: ColumnType<ICourse>[] = [
		{
			title: "name",
			dataIndex: "name",
			key: "name",
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
	const course: ICourse = db.course[id] || {id, students: [], lecturers: []};
	const [showModal, setShowModal] = useState<boolean>(false);

	const onFinish = (newCourse: ICourse) => {
		const oldStudents = course.students;
		const newStudents = newCourse.students;

		const oldLecturers = course.lecturers;
		const newLecturers = newCourse.lecturers;

		db.course[id] = {...newCourse, id};

		// Remove the current student from all courses.
		for (const oldStudent of oldStudents) {
			_.remove(db.student[oldStudent].courses, e => e === id);
		}

		// Re-add the current student to all new courses.
		for (const newStudent of newStudents) {
			db.student[newStudent].courses.push(id);
		}

		// Remove the current lecturer from all courses.
		for (const oldLecturer of oldLecturers) {
			_.remove(db.lecturer[oldLecturer].courses, e => e === id);
		}

		// Re-add the current lecturer to all new courses.
		for (const newLecturer of newLecturers) {
			db.lecturer[newLecturer].courses.push(id);
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

	const studentIds = Object.values(db.student).map(s => s.id);
	const studentOpts = studentIds.map(sid => <Select.Option key={sid} value={sid}>{sid}</Select.Option>);

	const lecturerIds = Object.values(db.lecturer).map(s => s.id);
	const lecturerOpts = lecturerIds.map(sid => <Select.Option key={sid} value={sid}>{sid}</Select.Option>);

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
					rules={[{required: true, message: 'Please input name'}]}
				>
					<Input/>
				</Form.Item>

				<Form.Item
					label="Students"
					name="students">
					<Select
						mode="multiple"
						allowClear
						style={{width: '100%'}}
						placeholder="Please select"
					>
						{studentOpts}
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
						{lecturerOpts}
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