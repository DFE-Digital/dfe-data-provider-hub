const Generate = require('../generate')

const queryArray = require('../simulated-data/queries')
const errorArray = require('../simulated-data/errors')

var SchoolModifier = {}

/**
 * Prepare a school for action by simulation
 *
 * @remarks
 * Uses the school’s defined number of queries and errors to build an array of issues to action by simulation user
 *
 * @param {object} school - The number of errors needed in the array
 * @param {bool} isSchoolUser - The source array fo errors
 * @returns The school
 *
 */

SchoolModifier.buildSchool = (school, isSchoolUser) => {
	var queries = isSchoolUser
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
	var errors = isSchoolUser
		? Generate.schoolErrors(school.noOfErrors, errorArray)
		: Generate.errors(school.noOfErrors, errorArray)
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

	// Timestamp build
	school.builtOn = new Date()

	// Confirm action is complete
	school.hasBuilt = true
	return school
}

/**
 * Prepare a school for action by simulation only if necessary
 *
 * @remarks
 * Calls build function on school only if school has not been built yet
 *
 * @param {object} school - The number of errors needed in the array
 * @param {bool} isSchoolUser - The source array fo errors
 * @returns The school
 *
 */

SchoolModifier.buildSchoolIfNecessary = (school, isSchoolUser) => {
	// Test if build has not been performed
	if (school.hasBuilt != true) {
		// Perform build
		SchoolModifier.buildSchool(school, isSchoolUser)
	}
	return school
}

/**
 * Retrieve school by ID
 *
 * @remarks
 * Gets the requested school object matching the given ID, returns false if not found
 *
 * @param {string} id - The id for selected school
 * @param {string} data - The root data object where the school is saved
 * @returns The school or false if not found
 *
 */

SchoolModifier.getById = (id, data) => {
	const selectedSchool = data.schools.find(school => {
		return school.id == id
	})
	return selectedSchool || false
}

/**
 * Save a modified school object to data object
 *
 * @remarks
 * Modifies the data object to include changes to the given school
 *
 * @param {string} school - The modified school object
 * @param {string} data - The root data object where the school is saved
 * @returns An object containing the modified data 'data' and a boolean describing if the save was successful 'hasSaved'
 *
 */

SchoolModifier.saveChanges = (school, data) => {
	var hasSaved = false
	if (Array.isArray(data.schools)) {
		data.schools.map(savedSchool => {
			if (school.id == savedSchool.id) {
				hasSaved = true
				return school
			} else {
				return savedSchool
			}
		})
	}
	return { data, hasSaved }
}

module.exports = SchoolModifier
