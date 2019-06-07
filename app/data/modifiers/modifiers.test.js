const Generate = require('../generate')
const SchoolModifier = require('./school')
const isEqual = require('lodash.isequal')
const queriesArray = require('./../simulated-data/queries')
const errorsArray = require('./../simulated-data/errors')

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
	const result = SchoolModifier.buildSchool(testSchool, false)
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
	const result = SchoolModifier.buildSchoolIfNecessary(testSchool, false)
	expect(result).toBeTruthy()
	expect(result.issues.length).toBe(9)
})

test('build school for school action if necessary', () => {
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
	const result = SchoolModifier.buildSchoolIfNecessary(testSchool, true)
	var anyNotes = function(issues) {
		return issues.notes.length != 0
	}
	expect(result.issues.some(anyNotes)).not.toBeTruthy()
	expect(result.issues.length).toBe(9)
})

test('build school for school action if necessary with a high number of errors and queries', () => {
	const testSchoolName = 'Test school'
	const testLaCode = '000'
	const testSchoolType = 'academy'
	const testNoOfQueries = 1000
	const testNoOfErrors = 1000
	const testSchool = Generate.newSchool(
		testSchoolName,
		testLaCode,
		testSchoolType,
		testNoOfQueries,
		testNoOfErrors
	)
	const result = SchoolModifier.buildSchoolIfNecessary(testSchool, true)
	var anyNotes = function(issues) {
		return issues.notes.length != 0
	}
	expect(result.issues.some(anyNotes)).not.toBeTruthy()
	expect(result.issues.length).toBe(queriesArray.length + errorsArray.length)
})

test('get a school by ID', () => {
	var testData = {}
	testData.schools = Generate.schools(6)
	testData.schools.forEach(school => {
		expect(
			isEqual(SchoolModifier.getById(school.id, testData), school)
		).toBeTruthy()
		expect(
			isEqual(SchoolModifier.getById(Generate.uuid(), testData), school)
		).not.toBeTruthy()
	})
})

test('modify a school in data', () => {
	var testData = {}
	testData.schools = Generate.schools(6)
	var sample = Generate.randomItemFrom(testData.schools)
	const newSchoolName = Generate.schoolName()
	sample.name = newSchoolName
	SchoolModifier.saveChanges(sample, testData)
	expect(
		SchoolModifier.getById(sample.id, testData).name == newSchoolName
	).toBeTruthy()
})
