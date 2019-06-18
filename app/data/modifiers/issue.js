const Generate = require('../generate')
const SchoolModifier = require('./school')

const IssueModifier = {}

/**
 * Retrieve issue by ID and given school
 *
 * @remarks
 * Gets the requested issue object matching the given ID at the given school, returns false if not found
 *
 * @param {string} id - The id for selected issue
 * @param {object} school - The school object containing the issue
 * @returns The issue object
 *
 */

const notesAddingNew = (notes, noteContent, author) => {
	notes = JSON.parse(JSON.stringify(notes))
	const newNote = {
		type: 'school',
		author: author,
		text: noteContent,
		date: new Date().getTime()
	}
	if (Array.isArray(notes)) {
		notes.push(newNote)
	} else {
		notes = [newNote]
	}
	return notes
}

const notesRemovingLast = notes => {
	notes = JSON.parse(JSON.stringify(notes))
	if (Array.isArray(notes)) {
		notes.pop()
	} else {
		notes = []
	}
	return notes
}

IssueModifier.getById = (id, school) => {
	const selectedIssue = school.issues.find(issue => {
		return issue.id == id
	})
	return selectedIssue || false
}

/**
 * Add an explanation
 *
 * @remarks
 * Adds a new note to the given query and marks it as resolved
 *
 * @param {object} issue - The selected issue
 * @param {string} explanation - The explanation content
 * @param {string} school - The school object
 * @param {any[]} selectedPupilIds - The selected pupils
 * @returns The modified school object
 *
 */

IssueModifier.addExplanation = (
	issueId,
	explanation,
	school,
	selectedPupilIds
) => {
	var outputIssues = []
	selectedPupilIds = selectedPupilIds || []
	if (school) {
		school = JSON.parse(JSON.stringify(school))
		school.issues.forEach(issue => {
			if (issue.id == issueId) {
				// If issue is currently modifying issue
				if (Array.isArray(issue.pupils)) {
					if (selectedPupilIds.length == 0) {
						// No pupils selected, save with no changes
						outputIssues.push(issue)
					} else {
						var remainingPupils = []
						var leavingPupils = []
						if (selectedPupilIds.length == 0) {
							leavingPupils = issue.pupils
						} else {
							issue.pupils.forEach(pupil => {
								if (selectedPupilIds.includes(pupil.id)) {
									leavingPupils.push(pupil)
								} else {
									remainingPupils.push(pupil)
								}
							})
						}
						if (remainingPupils.length == 0) {
							// If all pupils are leaving the whole issue will be resolved
							issue.notes = notesAddingNew(
								issue.notes,
								explanation,
								school.provider
							)
							issue.isResolved = 'true'
							outputIssues.push(issue)
						} else {
							// Save existing issue with any remaining pupils
							issue.pupils = remainingPupils
							outputIssues.push(issue)

							var createdIssue = JSON.parse(JSON.stringify(issue))
							createdIssue.id = Generate.uuid()
							createdIssue.notes = notesAddingNew(
								issue.notes,
								explanation,
								school.provider
							)
							createdIssue.isResolved = 'true'
							createdIssue.pupils = leavingPupils
							outputIssues.push(createdIssue)
						}
					}
				} else {
					issue.notes = notesAddingNew(
						issue.notes,
						explanation,
						school.provider
					)
					issue.isResolved = 'true'
					outputIssues.push(issue)
				}
			} else {
				// If issue is not affected add to output array
				outputIssues.push(issue)
			}
		})
		school.issues = outputIssues
		return school
	}
}

module.exports = IssueModifier

/**
 * Undo an explanation
 *
 * @remarks
 * Removed the last note provided for selected pupils or entire issue and changes resolved flag to false
 *
 * @param {object} issue - The selected issue
 * @param {string} school - The school object
 * @param {any[]} selectedPupilIds - The selected pupils (null if all pupils are to be included)
 * @returns An object containing the modified school object
 *
 */

IssueModifier.undoExplanation = (issueId, school, selectedPupilIds) => {
	var outputIssues = []

	if (school) {
		school = JSON.parse(JSON.stringify(school))

		var unResolvedIssueId = null
		var hasPupils = false
		var remainingPupils = []
		var leavingPupils = []
		const selectedIssue = IssueModifier.getById(issueId, school)

		if (Array.isArray(selectedIssue.pupils)) {
			hasPupils = true
			selectedIssue.pupils.forEach(pupil => {
				if (selectedPupilIds.includes(pupil.id)) {
					leavingPupils.push(pupil)
				} else {
					remainingPupils.push(pupil)
				}
			})
		}
		school.issues.forEach(issue => {
			if (issue.isResolved != 'true' && issue.number == selectedIssue.number) {
				unResolvedIssueId = issue.id
			}
		})
		school.issues.forEach(issue => {
			var issue = JSON.parse(JSON.stringify(issue))
			if (unResolvedIssueId) {
				if (issue.id == unResolvedIssueId) {
					if (hasPupils && selectedPupilIds.length == 0) {
						// No pupils selected, save with no changes
						outputIssues.push(issue)
					} else {
						issue.pupils = leavingPupils
						outputIssues.push(issue)
						console.log('pushed leaving pupils to existing issue')
					}
				}
			}
			if (issue.id == issueId) {
				if (!hasPupils) {
					issue.notes = notesRemovingLast(issue.notes)
					issue.isResolved = 'false'
					outputIssues.push(issue)
					console.log('non-pupil issue updated with undo action')
				} else {
					if (selectedPupilIds.length == 0) {
						// No pupils selected, save with no changes
						outputIssues.push(issue)
						console.log('no pupils selected')
					} else {
						if (remainingPupils.length != 0) {
							issue.pupils = remainingPupils
							outputIssues.push(issue)
							console.log('updated existing issue with remaining pupils')
						}
						if (unResolvedIssueId == null) {
							var createdIssue = JSON.parse(JSON.stringify(issue))
							createdIssue.id = Generate.uuid()
							createdIssue.notes = notesRemovingLast(createdIssue.notes)
							createdIssue.isResolved = 'false'
							createdIssue.pupils = leavingPupils
							outputIssues.push(createdIssue)
							console.log(
								'created brand new issue with leaving pupils attached'
							)
						}
					}
				}
			} else {
				// If issue is not affected add to output array
				outputIssues.push(issue)
			}
		})
		school.issues = outputIssues
		return school
	}
}

module.exports = IssueModifier
