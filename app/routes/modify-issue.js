const express = require('express')
const router = express.Router()

const SchoolModifier = require('../data/modifiers/school')
const IssueModifier = require('../data/modifiers/issue')

const Helper = require('./Helper')

router.post('/explain', (req, res) => {
	const selectedSchoolId = Helper.getValue('selected-school', req)
	const selectedIssue = Helper.getValue('selected-issue', req)
	const explanation = Helper.getValue('response-note', req)
	var selectedPupils = null
	if (Array.isArray(req.body['selected-pupils'])) {
		selectedPupils = req.body['selected-pupils']
		res.body.movedPupils = selectedPupils.length
	}
	var school = Helper.getSchoolById(selectedSchoolId, req)
	var modifiedSchool = IssueModifier.addExplanation(
		selectedIssue,
		explanation,
		school,
		selectedPupils
	)
	Helper.saveSchoolToData(modifiedSchool, req, res)
})

module.exports = router
