import {IStudent} from "./entities/student/student";
import {ILecturer} from "./entities/lecturer/lecturer";
import {ICourse} from "./entities/course/course";

export interface IStudentDB {
	[id: string]: IStudent
}

export interface ILecturerDB {
	[id: string]: ILecturer
}

export interface ICourseDB {
	[id: string]: ICourse
}

export interface IDB {
	student: IStudentDB,
	lecturer: ILecturerDB,
	course: ICourseDB,
}

export const db: IDB = {
	student: {
		'07609c01-543f-43c5-9c13-785b01bc6638': {
			id: '07609c01-543f-43c5-9c13-785b01bc6638',
			firstName: 'Alex',
			lastName: 'Baldwin',
			courses: [
				'34d63a8b-5e19-41de-bcc8-f61a19e966cd',
				'6a354b79-517e-43c7-ab71-99b703844aa7'
			]
		},
		'31dadddf-a4ef-4feb-b4a2-50170966474b': {
			id: '31dadddf-a4ef-4feb-b4a2-50170966474b',
			firstName: 'Ken',
			lastName: 'Satoshi',
			courses: [
				'6a354b79-517e-43c7-ab71-99b703844aa7'
			]
		},
	},
	lecturer: {
		'0b169c54-da59-47ae-b2ba-9b486bd94802': {
			id: '0b169c54-da59-47ae-b2ba-9b486bd94802',
			firstName: 'John',
			lastName: 'Smith',
			courses: [
				'34d63a8b-5e19-41de-bcc8-f61a19e966cd'
			]
		},
		'eb7dd8c0-efd3-400b-b70a-2a1ccf9a5189': {
			id: 'eb7dd8c0-efd3-400b-b70a-2a1ccf9a5189',
			firstName: 'Jane',
			lastName: 'Doe',
			courses: [
				'34d63a8b-5e19-41de-bcc8-f61a19e966cd',
				'6a354b79-517e-43c7-ab71-99b703844aa7'
			]
		},
	},
	course: {
		'34d63a8b-5e19-41de-bcc8-f61a19e966cd': {
			id: '34d63a8b-5e19-41de-bcc8-f61a19e966cd',
			name: 'Math',
			students: [
				'07609c01-543f-43c5-9c13-785b01bc6638'
			],
			lecturers: [
				'0b169c54-da59-47ae-b2ba-9b486bd94802',
				'eb7dd8c0-efd3-400b-b70a-2a1ccf9a5189'
			]
		},
		'6a354b79-517e-43c7-ab71-99b703844aa7': {
			id: '6a354b79-517e-43c7-ab71-99b703844aa7',
			name: 'Physics',
			students: [
				'07609c01-543f-43c5-9c13-785b01bc6638',
				'31dadddf-a4ef-4feb-b4a2-50170966474b'
			],
			lecturers: [
				'eb7dd8c0-efd3-400b-b70a-2a1ccf9a5189'
			]
		},
	},
}