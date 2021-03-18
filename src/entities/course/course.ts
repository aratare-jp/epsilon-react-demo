export interface ICourse {
	id: string,
	name: string,
	lecturers: string[],
	students: string[],

	[k: string]: any
}