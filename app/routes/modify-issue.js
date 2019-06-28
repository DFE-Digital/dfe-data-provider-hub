const express = require('express')
const router = express.Router()

const SchoolModifier = require('../data/modifiers/school')
const IssueModifier = require('../data/modifiers/issue')

const Helper = require('./Helper')

router.post('/explain', (req, res) => {
	const selectedSchoolId = Helper.getValue('selected-school', req)
	const selectedIssue = Helper.getValue('selected-issue', req)
	const explanation = Helper.getValue('response-note', req)
	var school = Helper.getSchoolById(selectedSchoolId, req)
	var existingIssue = IssueModifier.getById(selectedIssue, school)
	var selectedPupils = []
	if (Array.isArray(req.body['selected-pupils'])) {
		selectedPupils = req.body['selected-pupils']
		if (existingIssue.pupils.length == selectedPupils.length) {
			req.session.data.issueMoved = 'true'
		}
	}
	req.session.data.pupilsMoved = selectedPupils.length
	var modifiedSchool = IssueModifier.addExplanation(
		selectedIssue,
		explanation,
		school,
		selectedPupils
	)
	Helper.saveSchoolToData(modifiedSchool, req, res)
})

router.post('/undo-explanation', (req, res) => {
	const selectedSchoolId = Helper.getValue('selected-school', req)
	const selectedIssue = Helper.getValue('selected-issue', req)
	var selectedPupils = []
	if (Array.isArray(req.body['selected-pupils'])) {
		selectedPupils = req.body['selected-pupils']
		if (existingIssue.pupils.length == selectedPupils.length) {
			req.session.data.issueMoved = 'true'
		}
	}
	req.session.data.pupilsMoved = selectedPupils.length
	var school = Helper.getSchoolById(selectedSchoolId, req)
	var modifiedSchool = IssueModifier.undoExplanation(
		selectedIssue,
		school,
		selectedPupils
	)
	Helper.saveSchoolToData(modifiedSchool, req, res)
})

router.post('/accept', (req, res) => {
	const selectedSchoolId = Helper.getValue('selected-school', req)
	const selectedIssue = Helper.getValue('selected-issue', req)
	var school = Helper.getSchoolById(selectedSchoolId, req)
	var selectedPupils = []
	if (Array.isArray(req.body['selected-pupils'])) {
		selectedPupils = req.body['selected-pupils']
	}
	if (req.body['select-all-pupils'] == 'true') {
		selectedPupils = IssueModifier.getById(selectedIssue, school).pupils.map(
			pupil => pupil.id
		)
	}
	req.session.data.pupilsMoved = selectedPupils.length
	var modifiedSchool = IssueModifier.acceptExplanation(
		selectedIssue,
		school,
		selectedPupils
	)
	Helper.saveSchoolToData(modifiedSchool, req, res)
})

router.post('/reject', (req, res) => {
	const selectedSchoolId = Helper.getValue('selected-school', req)
	const selectedIssue = Helper.getValue('selected-issue', req)
	const responseNote = Helper.getValue('reject-note', req)
	const user = Helper.getValue('user', req)
	var school = Helper.getSchoolById(selectedSchoolId, req)
	var selectedPupils = []
	if (Array.isArray(req.body['selected-pupils'])) {
		selectedPupils = req.body['selected-pupils']
	}
	if (req.body['select-all-pupils'] == 'true') {
		const pupilArray = IssueModifier.getById(selectedIssue, school).pupils
		if (Array.isArray(pupilArray)) {
			selectedPupils = pupilArray.map(pupil => pupil.id)
		}
	}
	req.session.data.pupilsMoved = selectedPupils.length
	var modifiedSchool = IssueModifier.rejectExplanation(
		selectedIssue,
		school,
		selectedPupils,
		responseNote,
		user
	)
	Helper.saveSchoolToData(modifiedSchool, req, res)
})

router.post('/respond', (req, res) => {
	const responseRoute =
		Helper.getValue('response-type', req) == 'reject'
			? IssueModifier.rejectExplanation
			: IssueModifier.acceptExplanation
	req.session.data.resolution = Helper.getValue('response-type', req)
	const selectedSchoolId = Helper.getValue('selected-school', req)
	const school = Helper.getSchoolById(selectedSchoolId, req)
	const selectedIssue = Helper.getValue('selected-issue', req)
	const existingIssue = IssueModifier.getById(selectedIssue, school)
	const responseNote = Helper.getValue('reject-note', req)
	console.log(responseNote)

	const user = Helper.getValue('user', req)
	var selectedPupils = []
	if (Array.isArray(req.body['selected-pupils'])) {
		selectedPupils = req.body['selected-pupils']
		if (existingIssue.pupils.length == selectedPupils.length) {
			req.session.data.issueMoved = 'true'
		}
	}
	if (req.body['select-all-pupils'] == 'true') {
		selectedPupils = IssueModifier.getById(selectedIssue, school).pupils.map(
			pupil => pupil.id
		)
	}
	req.session.data.pupilsMoved = selectedPupils.length
	var modifiedSchool = responseRoute(
		selectedIssue,
		school,
		selectedPupils,
		responseNote,
		user
	)
	Helper.saveSchoolToData(modifiedSchool, req, res)
})

router.post('/undo-response', (req, res) => {
	const selectedSchoolId = Helper.getValue('selected-school', req)
	const selectedIssue = Helper.getValue('selected-issue', req)
	var school = Helper.getSchoolById(selectedSchoolId, req)
	const existingIssue = IssueModifier.getById(selectedIssue, school)
	var selectedPupils = []
	if (Array.isArray(req.body['selected-pupils'])) {
		selectedPupils = req.body['selected-pupils']
		if (existingIssue.pupils.length == selectedPupils.length) {
			req.session.data.issueMoved = 'true'
			req.session.data.lastResponseType = existingIssue.response
		}
	}
	if (req.body['select-all-pupils'] == 'true') {
		const pupilArray = IssueModifier.getById(selectedIssue, school).pupils
		if (Array.isArray(pupilArray)) {
			selectedPupils = pupilArray.map(pupil => pupil.id)
		}
	}
	req.session.data.pupilsMoved = selectedPupils.length
	var modifiedSchool = IssueModifier.undoResponse(
		selectedIssue,
		school,
		selectedPupils
	)
	Helper.saveSchoolToData(modifiedSchool, req, res)
})

module.exports = router
