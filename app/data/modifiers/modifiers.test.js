const Generate = require('../generate')
const SchoolModifier = require('./school')
const IssueModifier = require('./issue')
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
	expect(typeof result.builtOn.getMonth === 'function').toBeTruthy()
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
	expect(typeof result.builtOn.getMonth === 'function').toBeTruthy()
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
	testData = SchoolModifier.saveChanges(sample, testData).data
	expect(
		SchoolModifier.getById(sample.id, testData).name == newSchoolName
	).toBeTruthy()
})

test('get an issue using the ID', () => {
	var testData = {}
	testData.schools = Generate.schools(6)
	const sampleSchool = SchoolModifier.buildSchoolIfNecessary(
		Generate.randomItemFrom(testData.schools)
	)
	const sampleIssue = Generate.randomItemFrom(sampleSchool.issues)
	const sampleIssueId = sampleIssue.id
	const foundIssue = IssueModifier.getById(sampleIssueId, sampleSchool)
	expect(foundIssue === sampleIssue).toBeTruthy()
})

test('add an explanation to a given issue', () => {
	var testData = {}
	testData.schools = Generate.schools(6)
	const sampleSchool = SchoolModifier.buildSchoolIfNecessary(
		Generate.randomItemFrom(testData.schools)
	)
	const sampleIssue = Generate.randomItemFrom(sampleSchool.issues)
	const sampleAuthor = sampleSchool.provider
	const modifiedSchool = IssueModifier.addExplanation(
		sampleIssue.id,
		'This is a test',
		sampleSchool,
		null
	)
	testData = SchoolModifier.saveChanges(modifiedSchool, testData).data
	const modifiedIssue = IssueModifier.getById(
		sampleIssue.id,
		SchoolModifier.getById(sampleSchool.id, testData)
	)
	expect(modifiedIssue).toBeTruthy()
	expect(
		modifiedIssue.notes[modifiedIssue.notes.length - 1].author == sampleAuthor
	).toBeTruthy()
	expect(
		modifiedIssue.notes.length == sampleIssue.notes.length + 1
	).toBeTruthy()
	expect(sampleSchool.id).toBe(modifiedSchool.id)
})

test('add an explanation to a given issue for selected pupils', () => {
	var testData = {}
	testData.schools = Generate.schools(6)
	const sampleSchool = SchoolModifier.buildSchoolIfNecessary(
		Generate.randomItemFrom(testData.schools)
	)
	var sampleIssue = Generate.randomItemFrom(sampleSchool.issues)
	sampleIssue.pupils = Generate.pupils(10)
	const selectedPupils = Generate.randomItemsFrom(sampleIssue.pupils, 2)
	const sampleAuthor = sampleSchool.provider
	const modifiedSchool = IssueModifier.addExplanation(
		sampleIssue.id,
		'This is a test',
		sampleSchool,
		[selectedPupils[0].id, selectedPupils[1].id]
	)
	const modifiedIssue = IssueModifier.getById(sampleIssue.id, modifiedSchool)
	expect(modifiedIssue).toBeTruthy()
	expect(
		modifiedIssue.notes[modifiedIssue.notes.length - 1].author == sampleAuthor
	).toBeTruthy()
	expect(sampleIssue.pupils.length).toBe(10)
	expect(modifiedIssue.pupils.length).toBe(8)
	expect(
		modifiedSchool.issues.find(issue => issue.isResolved == 'true').pupils
			.length
	).toBe(2)
	expect(
		modifiedIssue.notes.length == sampleIssue.notes.length + 1
	).toBeTruthy()
})

test('add an explanation to a given issue if all pupils are selected', () => {
	var testData = {}
	testData.schools = Generate.schools(6)
	const sampleSchool = SchoolModifier.buildSchoolIfNecessary(
		Generate.randomItemFrom(testData.schools)
	)
	var sampleIssue = Generate.randomItemFrom(sampleSchool.issues)
	sampleIssue.pupils = Generate.pupils(2)
	const selectedPupils = Generate.randomItemsFrom(sampleIssue.pupils, 2)
	const sampleAuthor = sampleSchool.provider
	const modifiedSchool = IssueModifier.addExplanation(
		sampleIssue.id,
		'This is a test',
		sampleSchool,
		[selectedPupils[0].id, selectedPupils[1].id]
	)
	const modifiedIssue = IssueModifier.getById(sampleIssue.id, modifiedSchool)
	expect(modifiedIssue).toBeTruthy()
	expect(
		modifiedIssue.notes[modifiedIssue.notes.length - 1].author == sampleAuthor
	).toBeTruthy()
	expect(modifiedIssue.pupils.length).toBe(2)
	expect(
		modifiedSchool.issues.find(issue => issue.isResolved == 'true').id ==
			sampleIssue.id
	).toBeTruthy()
	expect(
		modifiedIssue.notes.length == sampleIssue.notes.length + 1
	).toBeTruthy()
})

test('undo an explanation to a given issue for selected pupils', () => {
	var testData = {}
	testData.schools = Generate.schools(6)
	const sampleSchool = SchoolModifier.buildSchoolIfNecessary(
		Generate.randomItemFrom(testData.schools)
	)
	var sampleIssue = Generate.randomItemFrom(sampleSchool.issues)
	sampleIssue.pupils = Generate.pupils(10)
	const sampleAuthor = sampleSchool.provider
	const modifiedSchool = IssueModifier.addExplanation(
		sampleIssue.id,
		'This is a test',
		sampleSchool,
		null
	)
	const modifiedIssue = IssueModifier.getById(sampleIssue.id, modifiedSchool)
	expect(modifiedIssue).toBeTruthy()
	expect(
		modifiedIssue.notes[modifiedIssue.notes.length - 1].author == sampleAuthor
	).toBeTruthy()
	expect(sampleIssue.pupils.length).toBe(10)
	expect(
		modifiedSchool.issues.find(issue => issue.isResolved == 'true').pupils
			.length
	).toBe(10)
	expect(
		modifiedIssue.notes.length == sampleIssue.notes.length + 1
	).toBeTruthy()
	const selectedPupils = Generate.randomItemsFrom(sampleIssue.pupils, 2)
	const modifiedSchoolAfterUndo = IssueModifier.undoExplanation(
		sampleIssue.id,
		modifiedSchool,
		[selectedPupils[0].id, selectedPupils[1].id]
	)
	const modifiedIssueAfterUndo = IssueModifier.getById(
		sampleIssue.id,
		modifiedSchoolAfterUndo
	)
	expect(modifiedSchoolAfterUndo.issues.length).toBe(
		modifiedSchool.issues.length + 1
	)
})

test('undo an explanation to a given issue when all pupils are selected', () => {
	var testData = {}
	testData.schools = Generate.schools(6)
	const sampleSchool = SchoolModifier.buildSchoolIfNecessary(
		Generate.randomItemFrom(testData.schools)
	)
	var sampleIssue = Generate.randomItemFrom(sampleSchool.issues)
	sampleIssue.pupils = Generate.pupils(2)
	const sampleAuthor = sampleSchool.provider
	const modifiedSchool = IssueModifier.addExplanation(
		sampleIssue.id,
		'This is a test',
		sampleSchool,
		null
	)
	const modifiedIssue = IssueModifier.getById(sampleIssue.id, modifiedSchool)
	expect(modifiedIssue).toBeTruthy()
	expect(
		modifiedIssue.notes[modifiedIssue.notes.length - 1].author == sampleAuthor
	).toBeTruthy()
	expect(sampleIssue.pupils.length).toBe(2)
	expect(
		modifiedSchool.issues.find(issue => issue.isResolved == 'true').pupils
			.length
	).toBe(2)
	expect(
		modifiedIssue.notes.length == sampleIssue.notes.length + 1
	).toBeTruthy()
	const selectedPupils = Generate.randomItemsFrom(sampleIssue.pupils, 2)
	const modifiedSchoolAfterUndo = IssueModifier.undoExplanation(
		sampleIssue.id,
		modifiedSchool,
		[selectedPupils[0].id, selectedPupils[1].id]
	)
	const modifiedIssueAfterUndo = modifiedSchoolAfterUndo.issues.find(
		issue => issue.number == modifiedIssue.number
	)
	expect(modifiedIssueAfterUndo.notes.length).toBe(
		modifiedIssue.notes.length - 1
	)
	expect(modifiedSchoolAfterUndo.issues.length).toBe(
		modifiedSchool.issues.length
	)
})
