export interface IStudent {
	id: string,
	firstName: string,
	lastName: string,
	enrolledCourses: string[],
}

export interface ILecturer {
	id: string,
	firstName: string,
	lastName: string,
	taughtCourses: string[],
	managedCourses: string[],
}

export interface ICourse {
	id: string,
	name: string,
	enrolledStudents: string[],
	lecturers: string[],
	managers: string[],
}

export interface IUpperManager {
	id: string,
	firstName: string,
	lastName: string,
}

export interface IDB {
	students: { [id: string]: IStudent },
	lecturers: { [id: string]: ILecturer },
	courses: { [id: string]: ICourse },
	upperManagers: { [id: string]: IUpperManager },
}

export const db: IDB = {
	students: {
		// protected region Custom data here for Student off begin
		// protected region Custom data here for Student end
	},
	lecturers: {
		// protected region Custom data here for Lecturer off begin
		// protected region Custom data here for Lecturer end
	},
	courses: {
		// protected region Custom data here for Course off begin
		// protected region Custom data here for Course end
	},
	upperManagers: {
		// protected region Custom data here for Upper Manager off begin
		// protected region Custom data here for Upper Manager end
	},
}