/* eslint-env jest */
const Generate = require('./generate')

test('random number generator', () => {
	const result = Generate.randomNumber(0, 9)
	expect(result).toBeGreaterThanOrEqual(0)
	expect(result).toBeLessThanOrEqual(9)
})

test('generate a universally unique identifier UUID', () => {
	const result = Generate.uuid()
	expect(result.length).toBe(36)
})

test('get random item from a given array', () => {
	const result = Generate.randomItemFrom([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	expect(result).toBeGreaterThanOrEqual(0)
	expect(result).toBeLessThanOrEqual(9)
})

test('generate a random code of integers for a given length', () => {
	const result = Generate.randomCode(6)
	expect(result.length).toBe(6)
})

test('generate a simulated phone number', () => {
	const result = Generate.phoneNumber()
	expect(result).toBeTruthy()
})

test('generate a random date within the past number fo given days', () => {
	const result = Generate.randomDate(6, 1)
	const today = new Date().getTime()
	const weekLengthInMilliseconds = 60 * 60 * 24 * 7 * 1000
	const aWeekAgo = today - weekLengthInMilliseconds
	expect(result.getTime()).toBeLessThan(today)
	expect(result.getTime()).toBeGreaterThan(aWeekAgo)
})

test('generate a simulated name', () => {
	const result = Generate.name()
	expect(result).toBeTruthy()
})

test('generate a given number of simulated collectors (helpdesk users)', () => {
	const result = Generate.collectors(6)
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(6)

	result.forEach(sample => {
		expect(sample.id).toBeTruthy()
		expect(sample.firstName).toBeTruthy()
		expect(sample.lastName).toBeTruthy()
		expect(sample.las.length == 0).toBeTruthy()
		expect(sample.weighting).toBeGreaterThan(0)
		expect(sample.weighting).toBeLessThanOrEqual(1)
	})
})

test('generate a given number of simulated pupils', () => {
	const result = Generate.pupils(6)
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(6)

	result.forEach(sample => {
		expect(sample.id).toBeTruthy()
		expect(sample.UPN).toBeTruthy()
		expect(sample.dob).toBeTruthy()
		expect(sample.firstname).toBeTruthy()
		expect(sample.surname).toBeTruthy()
	})
})

test('generate a simulated school name', () => {
	const result = Generate.schoolName()
	expect(result).toBeTruthy()
})

test('create a school object', () => {
	const testSchoolName = 'Test school'
	const testLaCode = '000'
	const testSchoolType = 'academy'
	const testNoOfQueries = 6
	const result = Generate.newSchool(
		testSchoolName,
		testLaCode,
		testSchoolType,
		testNoOfQueries
	)
	expect(result.name == testSchoolName).toBeTruthy()
	expect(result.LAESTAB.includes(testLaCode)).toBeTruthy()
	expect(result.provider).toBeTruthy()
	expect(result.type == testSchoolType).toBeTruthy()
	expect(result.noOfQueries).toBe(testNoOfQueries)
})

test('generate a simulated school', () => {
	const result = Generate.school()
	expect(result.name.length).toBeGreaterThan(0)
	expect(result.LAESTAB.length).toBe(8)
	expect(result.provider).toBeTruthy()
	expect(result.type == 'academy' || result.type == 'maintained').toBeTruthy()
	expect(result.issues.length).toBe(0)
})

test('generate a given number of simulated schools', () => {
	const result = Generate.schools(6)
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(6)

	result.forEach(sample => {
		expect(sample.name).toBeTruthy()
		expect(sample.LAESTAB).toBeTruthy()
		expect(sample.provider).toBeTruthy()
		expect(sample.type == 'academy' || sample.type == 'maintained').toBeTruthy()
		expect(!isNaN(sample.noOfQueries)).toBeTruthy()
	})
})

test('generate a number of simulated queries', () => {
	const result = Generate.queries(6, require('./simulated-data/queries'))
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(6)
	result.forEach(sample => {
		expect(sample.confirmationIsAcceptable).not.toBeNull()
		expect(sample.description).toBeTruthy()
		expect(sample.guide).toBeTruthy()
		expect(Array.isArray(sample.notes)).toBeTruthy()
		expect(sample.number).toBeTruthy()
		expect(
			sample.type == 'pupil' ||
				sample.type == 'school' ||
				sample.type == 'term-on-term' ||
				sample.type == 'class'
		).toBeTruthy()
		expect(sample.id).not.toBeNull()
		expect(sample.handled == 'false').toBeTruthy()
	})
})

test('request more queries than exists', () => {
	const queryArray = require('./simulated-data/queries')
	const requestAmount = queryArray.length + 300
	const result = Generate.queries(requestAmount, queryArray)
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(queryArray.length)

	result.forEach(sample => {
		expect(sample.confirmationIsAcceptable).not.toBeNull()
		expect(sample.description).toBeTruthy()
		expect(sample.guide).toBeTruthy()
		expect(Array.isArray(sample.notes)).toBeTruthy()
		expect(sample.number).toBeTruthy()
		expect(
			sample.type == 'pupil' ||
				sample.type == 'school' ||
				sample.type == 'term-on-term' ||
				sample.type == 'class'
		).toBeTruthy()
		expect(sample.id).not.toBeNull()
		expect(sample.handled == 'false').toBeTruthy()
	})
})

test('generate a number of simulated unexplained queries for school users', () => {
	const result = Generate.schoolQueries(6, require('./simulated-data/queries'))
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(6)

	result.forEach(sample => {
		expect(sample.confirmationIsAcceptable).not.toBeNull()
		expect(sample.description).toBeTruthy()
		expect(sample.guide).toBeTruthy()
		expect(Array.isArray(sample.notes)).toBeTruthy()
		expect(sample.number).toBeTruthy()
		expect(
			sample.type == 'pupil' ||
				sample.type == 'school' ||
				sample.type == 'term-on-term' ||
				sample.type == 'class'
		).toBeTruthy()
		expect(sample.isResolved == 'false').toBeTruthy()
		expect(sample.id).not.toBeNull()
		expect(sample.handled == 'false').toBeTruthy()
		expect(sample.notes.length).toBe(0)
	})
})

test('request more simulated unexplained queries for school users than exists', () => {
	const queryArray = require('./simulated-data/queries')
	const requestAmount = queryArray.length + 300
	const result = Generate.schoolQueries(requestAmount, queryArray)
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(queryArray.length)

	result.forEach(sample => {
		expect(sample.confirmationIsAcceptable).not.toBeNull()
		expect(sample.description).toBeTruthy()
		expect(sample.guide).toBeTruthy()
		expect(Array.isArray(sample.notes)).toBeTruthy()
		expect(sample.number).toBeTruthy()
		expect(
			sample.type == 'pupil' ||
				sample.type == 'school' ||
				sample.type == 'term-on-term' ||
				sample.type == 'class'
		).toBeTruthy()
		expect(sample.id).not.toBeNull()
		expect(sample.handled == 'false').toBeTruthy()
	})
})

test('request more errors than exists', () => {
	const errorArray = require('./simulated-data/errors')
	const requestAmount = errorArray.length + 300
	const result = Generate.errors(requestAmount, errorArray)
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(errorArray.length)

	result.forEach(sample => {
		expect(sample.description).toBeTruthy()
		expect(sample.number).toBeTruthy()
		expect(
			sample.type == 'pupil' ||
				sample.type == 'school' ||
				sample.type == 'term-on-term' ||
				sample.type == 'class'
		).toBeTruthy()
		expect(sample.id).not.toBeNull()
	})
})

test('generate a number of simulated errors', () => {
	const result = Generate.errors(6, require('./simulated-data/errors'))
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(6)

	result.forEach(sample => {
		expect(sample.description).toBeTruthy()
		expect(sample.number).toBeTruthy()
		expect(
			sample.type == 'pupil' ||
				sample.type == 'school' ||
				sample.type == 'term-on-term' ||
				sample.type == 'class'
		).toBeTruthy()
		expect(sample.id).not.toBeNull()
	})
})

test('generate a number of simulated unexplained errors for school users', () => {
	const result = Generate.schoolErrors(6, require('./simulated-data/errors'))
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(6)

	result.forEach(sample => {
		expect(sample.description).toBeTruthy()
		expect(Array.isArray(sample.notes)).toBeTruthy()
		expect(sample.number).toBeTruthy()
		expect(
			sample.type == 'pupil' ||
				sample.type == 'school' ||
				sample.type == 'term-on-term' ||
				sample.type == 'class'
		).toBeTruthy()
		expect(sample.isResolved == 'false').toBeTruthy()
		expect(sample.id).not.toBeNull()
		expect(sample.handled == 'false').toBeTruthy()
		expect(sample.notes.length).toBe(0)
	})
})

test('request more simulated unexplained errors for school users than exists', () => {
	const errorArray = require('./simulated-data/errors')
	const requestAmount = errorArray.length + 300
	const result = Generate.schoolErrors(requestAmount, errorArray)
	expect(Array.isArray(result)).toBeTruthy()
	expect(result.length).toBe(errorArray.length)

	result.forEach(sample => {
		expect(sample.description).toBeTruthy()
		expect(sample.number).toBeTruthy()
		expect(
			sample.type == 'pupil' ||
				sample.type == 'school' ||
				sample.type == 'term-on-term' ||
				sample.type == 'class'
		).toBeTruthy()
		expect(sample.id).not.toBeNull()
	})
})
