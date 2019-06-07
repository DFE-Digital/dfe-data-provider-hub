const SchoolModifier = require('../data/modifiers/school')

var Helper = {}

/**
 * Save a school to the session data store
 *
 * @remarks
 * Saves any modified data to school and modifies data in session to reflect changes
 *
 * @param {string} school - The modified school object
 * @param {Express.req} req - The Express request
 * @param {Express.res} res - The Express response
 * @returns Void
 *
 */

Helper.saveSchoolToData = (school, req, res) => {
	if (school) {
		const deliveredData = SchoolModifier.saveChanges(school, req.session.data)
		if (deliveredData.hasSaved) {
			req.session.data = deliveredData.data
			const nextPage = req.body['success-page']
			if (nextPage) {
				res.redirect(nextPage)
			} else {
				res.redirect(req.headers.referer)
			}
		} else {
			res.render('error', {
				message: 'The school data could not be saved'
			})
		}
	} else {
		res.render('error', {
			message: 'The school did not exist'
		})
	}
}

/**
 * Get a school with a given ID from the session data
 *
 * @remarks
 * Saves any modified data to school and modifies data in session to reflect changes
 *
 * @param {string} id - The school’S ID
 * @param {Express.req} req - The Express request
 * @returns School object
 *
 */

Helper.getSchoolById = (id, req) => {
	return SchoolModifier.getById(id, req.session.data)
}

/**
 * Get a value from a user’s form entry
 *
 * @remarks
 * Get a value from the current session data
 *
 * @param {string} name - The field’s ‘name’ attribute
 * @param {Express.req} req - The Express request
 * @returns The value of the field
 *
 */

Helper.getValue = (name, req) => {
	return req.session.data[name]
}

/**
 * Get a bool from a user’s form entry
 *
 * @remarks
 * Get a bool from the current session data
 *
 * @param {string} name - The field’s ‘name’ attribute
 * @param {Express.req} req - The Express request
 * @returns The bool value of the field
 *
 */

Helper.getBool = (name, req) => {
	const value = getValue(name, req)
	if (
		value == 0 ||
		value.toLowerCase() == 'no' ||
		value == 'false' ||
		value == false ||
		value == null ||
		typeof value == undefined
	) {
		return false
	} else {
		return true
	}
}

module.exports = Helper
