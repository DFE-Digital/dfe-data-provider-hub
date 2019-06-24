const express = require('express')
const router = express.Router()

const SchoolModifier = require('../data/modifiers/school')

const Helper = require('./Helper')

router.all('/build', (req, res) => {
	const selectedSchoolId = Helper.getValue('selected-school', req)
	const isSchoolUser = Helper.getValue('user-type', req) == 'school'
	var school = Helper.getSchoolById(selectedSchoolId, req)
	school = SchoolModifier.buildSchoolIfNecessary(school, isSchoolUser)
	console.log(req.body['success-page'])
	Helper.saveSchoolToData(school, req, res)
})

router.post('/modify', (req, res) => {
	const selectedSchoolId = Helper.getValue('selected-school', req)
	const isSchoolUser = Helper.getValue('user-type', req) == 'school'
	var school = Helper.getSchoolById(selectedSchoolId, req)
	if (school) {
		school.name = req.body['set-school-name'] || school.name
		school.provider = req.body['set-provider-name'] || school.provider
		const requestedNoOfQueries = req.body['set-number-of-queries']
		const requestedNoOfErrors = req.body['set-number-of-errors']
		if (requestedNoOfQueries || requestedNoOfErrors) {
			school.noOfQueries = requestedNoOfQueries || school.noOfQueries
			school.noOfErrors = requestedNoOfErrors || school.noOfErrors
			school.hasBuilt = false
		}
	}
	school = SchoolModifier.buildSchoolIfNecessary(school, isSchoolUser)
	Helper.saveSchoolToData(school, req, res)
})

module.exports = router
