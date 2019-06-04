const Generate = require('../generate')

const queryArray = require('../simulated-data/queries')
const errorArray = require('../simulated-data/errors')

var SchoolModifier = {}

/**
 * @param {any} school
 */

/**
 * Prepare a school for action by simulation
 *
 * @remarks
 * Uses the school’s defined number of queries and errors to build an array of issues to action by simulation user
 *
 * @param {object} school - The number of errors needed in the array
 * @param {bool} isSchool - The source array fo errors
 * @returns An array of errors
 *
 */

SchoolModifier.buildSchool = (school, isSchool) => {
	var queries = isSchool
		? Generate.schoolQueries(school.noOfQueries, queryArray)
		: Generate.queries(school.noOfQueries, queryArray)
	// Generate queries
	if (school.noOfQueries > 0) {
		queries.map(query => {
			// Assign category
			query.category = 'query'
		})
	}
	// Generate errors
	var errors = isSchool
		? Generate.schoolErrors(school.noOfErrors, queryArray)
		: Generate.errors(school.noOfErrors, queryArray)
	if (school.noOfErrors > 0) {
		errors.map(error => {
			// Assign category
			error.category = 'error'
		})
	}

	// Build combines issues array
	var issues = queries.concat(errors)

	// Save to school
	school.issues = issues

	// Confirm action is complete
	school.hasBuilt = true
	return school
}

SchoolModifier.buildSchoolIfNecessary = school => {
	// Test if build has not been performed
	if (school.hasBuilt != true) {
		// Perform build
		SchoolModifier.buildSchool(school)
	}
	return school
}

module.exports = SchoolModifier
