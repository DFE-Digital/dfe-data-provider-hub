const Generate = require('../generate')
const SchoolModifier = require('./school')

test('get a school ready for simulation by adding issues array', () => {
	const testSchoolName = 'Test school'
	const testLaCode = '000'
	const testSchoolType = 'academy'
	const testNoOfQueries = 6
	const testNoOfErrors = 3
	const testSchool = Generate.newSchool(
		testSchoolName,
		testLaCode,
		testSchoolType,
		testNoOfQueries,
		testNoOfErrors
	)
	const result = SchoolModifier.buildSchool(testSchool)
	expect(result).toBeTruthy()
	expect(result.issues.length).toBe(9)
})

test('build school if necessary', () => {
	const testSchoolName = 'Test school'
	const testLaCode = '000'
	const testSchoolType = 'academy'
	const testNoOfQueries = 6
	const testNoOfErrors = 3
	const testSchool = Generate.newSchool(
		testSchoolName,
		testLaCode,
		testSchoolType,
		testNoOfQueries,
		testNoOfErrors
	)
	const result = SchoolModifier.buildSchoolIfNecessary(testSchool)
	expect(result).toBeTruthy()
	expect(result.issues.length).toBe(9)
})
