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
	var selectedPupils = []
	if (Array.isArray(req.body['selected-pupils'])) {
		selectedPupils = req.body['selected-pupils']
	}
	req.session.data.pupilsMoved = selectedPupils.length
	var school = Helper.getSchoolById(selectedSchoolId, req)
	var modifiedSchool = IssueModifier.acceptExplanation(
		selectedIssue,
		school,
		selectedPupils
	)
	Helper.saveSchoolToData(modifiedSchool, req, res)
})

module.exports = router
