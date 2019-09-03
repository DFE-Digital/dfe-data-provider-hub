const generate = require('./data/generate')

module.exports = function(env) {
	/**
	 * Instantiate object used to store the methods registered as a
	 * 'filter' (of the same name) within nunjucks. You can override
	 * gov.uk core filters by creating filter methods of the same name.
	 * @type {Object}
	 */

	var filters = {}

	/* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

	const separateThousandsWithComma = input => {
		let amount = Math.round(Number(input) * 100) / 100
		if (amount % 1 !== 0) {
			amount = amount.toFixed(2)
		}
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	const toFriendlyNumber = input => {
		if (input == 0 || input == '0' || !input) {
			return 'None'
		} else {
			return separateThousandsWithComma(input)
		}
	}

	filters.currency = (number, prefix) => {
		if (!prefix) {
			prefix = '£'
		}
		return prefix + separateThousandsWithComma(number)
	}

	filters.friendlyNumber = input => {
		return toFriendlyNumber(input)
	}

	filters.addFullStop = input => {
		if (typeof input === 'string') {
			if (input.slice(-1) != '.') {
				return input + '.'
			}
		}
		return input
	}

	// Render numeric date as month string e.g. '04' becomes 'April'

	const numberToMonthString = input => {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]
		return months[Number(input)]
	}

	filters.formatDoB = str => {
		const date = new Date(str)
		return (
			date.getDate() +
			' ' +
			numberToMonthString(date.getMonth()) +
			' ' +
			date.getFullYear()
		)
	}

	filters.formatDate = str => {
		const date = new Date(str)
		return (
			date.getDate() +
			' ' +
			numberToMonthString(date.getMonth()) +
			' ' +
			date.getFullYear() +
			' at ' +
			('0' + (Math.round(date.getHours() / 2.4) + 7)).slice(-2) +
			':' +
			('0' + date.getMinutes()).slice(-2)
		)
	}

	filters.formatColumnDate = str => {
		const date = new Date(str)
		return (
			('0' + (Math.round(date.getHours() / 2.4) + 7)).slice(-2) +
			':' +
			('0' + date.getMinutes()).slice(-2) +
			' on ' +
			date.getDate() +
			' ' +
			numberToMonthString(date.getMonth()) +
			' ' +
			date.getFullYear()
		)
	}

	filters.friendlyDate = (str, nowStr) => {
		const date = new Date(str)
		const now = new Date(nowStr)
		const secondsPassed = (now - date) / 1000
		if (secondsPassed < 15) {
			return 'just now'
		} else if (secondsPassed < 60) {
			return 'less than a minute ago'
		} else if (secondsPassed < 75) {
			return 'a minute ago'
		} else if (secondsPassed < 60 * 4) {
			return 'a few minutes ago'
		} else if (secondsPassed < 60 * 59) {
			return Math.floor(secondsPassed / 60) + ' minutes ago'
		} else if (
			secondsPassed < 60 * 60 * 24 &&
			now.getDate() === date.getDate()
		) {
			return (
				'today at ' +
				('0' + (Math.round(date.getHours() / 2.4) + 7)).slice(-2) +
				':' +
				('0' + date.getMinutes()).slice(-2)
			)
		} else {
			return (
				('0' + (Math.round(date.getHours() / 2.4) + 7)).slice(-2) +
				':' +
				('0' + date.getMinutes()).slice(-2) +
				' ' +
				date.getDate() +
				' ' +
				numberToMonthString(date.getMonth()) +
				' ' +
				date.getFullYear()
			)
		}
	}

	filters.orElse = (str, fallback) => {
		if (!str || str == '') {
			return fallback
		}
		return str
	}

	filters.month = number => numberToMonthString(number - 1)

	filters.lowerCase = str => str.toLowerCase()

	filters.upperCase = str => str.toUpperCase()

	filters.titleCase = str => {
		return str.replace(/\w\S*/g, txt => {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
		})
	}

	filters.sentenceCase = str => {
		return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
	}

	filters.numbersOnly = str =>
		str
			.toString()
			.match(/\d+/g)
			.join('')

	filters.urlSafe = str => encodeURIComponent(str)

	filters.contains = (test, str) => {
		if (test) {
			return test.includes(str)
		} else {
			return false
		}
	}

	filters.arrayContains = (arrayAsString, str) => {
		if (arrayAsString) {
			const array = arrayAsString + ''.split(',')
			return array.includes(str)
		} else {
			return false
		}
	}

	filters.stringSum = arrayOfStrings => {
		var output = 0
		arrayOfStrings.forEach(str => {
			parseFloat(str) ? (output += parseFloat(str)) : false
		})
		return toFriendlyNumber(output)
	}

	filters.debug = obj => {
		return JSON.stringify(obj)
	}

	filters.pageResults = (array, page) => {
		const pageNo = parseInt(page)
		return array.slice((pageNo - 1) * 50, pageNo * 50 + 49)
	}

	filters.friendlyStatus = statusType => {
		return filters.sentenceCase(statusType.replace('-', ' '))
	}

	filters.getById = (array, str) => {
		return array.find(obj => {
			return obj.id.toString() === str
		})
	}

	filters.schoolIsReady = school => {
		var isReady = true
		school.issues.forEach(issue => {
			if (issue.isResolved != 'true') {
				isReady = false
			}
		})
		return isReady
	}

	filters.hasNotes = issues => {
		var hasNotes = false
		issues.forEach(issue => {
			if (issue.notes.length != 0) {
				hasNotes = true
			}
		})
		return hasNotes
	}

	filters.hasPreviousNotes = issues => {
		var hasNotes = false
		issues.forEach(issue => {
			if (issue.notes.length > 1) {
				hasNotes = true
			}
		})
		return hasNotes
	}

	filters.actionNeededCount = school => {
		var count = 0
		school.issues.forEach(issue => {
			if (issue.isResolved != 'true') {
				if (issue.pupils) {
					if (issue.pupils.length > 0) {
						count += issue.pupils.length
					} else {
						count++
					}
				} else {
					count++
				}
			}
		})
		return count
	}

	filters.helpdeskActionNeededCount = school => {
		var count = 0
		school.issues.forEach(issue => {
			if (issue.hasResponse != 'true') {
				if (issue.pupils) {
					if (issue.pupils.length > 0) {
						count += issue.pupils.length
					} else {
						count++
					}
				} else {
					count++
				}
			}
		})
		return count
	}

	filters.acceptedCount = school => {
		var count = 0
		school.issues.forEach(issue => {
			if (issue.hasResponse == 'true' && issue.response == 'accepted') {
				if (issue.pupils) {
					if (issue.pupils.length > 0) {
						count += issue.pupils.length
					} else {
						count++
					}
				} else {
					count++
				}
			}
		})
		return count
	}

	filters.rejectedCount = school => {
		var count = 0
		school.issues.forEach(issue => {
			if (issue.hasResponse == 'true' && issue.response == 'rejected') {
				if (issue.pupils) {
					if (issue.pupils.length > 0) {
						count += issue.pupils.length
					} else {
						count++
					}
				} else {
					count++
				}
			}
		})
		return count
	}

	filters.filterByStatus = (schools, status) => {
		if (Array.isArray(status)) {
			return schools.filter(
				school => school.status == status[0] || school.status == status[1]
			)
		}
		return schools.filter(school => school.status == status)
	}

	filters.issuesArray = school => {
		var output = []
		school.issues.forEach(issue => {
			if (issue.isResolved != 'true') {
				output.push(issue)
			}
		})
		return output
	}

	filters.helpdeskIssuesArray = school => {
		var output = []
		school.issues.forEach(issue => {
			if (issue.hasResponse != 'true') {
				output.push(issue)
			}
		})
		return output
	}

	filters.helpdeskAcceptedArray = school => {
		var output = []
		school.issues.forEach(issue => {
			if (issue.hasResponse == 'true' && issue.response == 'accepted') {
				output.push(issue)
			}
		})
		return output
	}

	filters.helpdeskRejectedArray = school => {
		var output = []
		school.issues.forEach(issue => {
			if (issue.hasResponse == 'true' && issue.response == 'rejected') {
				output.push(issue)
			}
		})
		return output
	}

	filters.resolvedArray = school => {
		var output = []
		school.issues.forEach(issue => {
			if (issue.isResolved == 'true') {
				output.push(issue)
			}
		})
		return output
	}

	filters.hasExplanations = school => {
		return filters.resolvedArray(school).length > 0
	}

	filters.countLabel = (count, singleLabel, pluralLabel) => {
		if (count == 1) {
			return `1 ${singleLabel}`
		} else if (count > 1) {
			return `${filters.friendlyNumber(count)} ${pluralLabel}`
		}
		return `0 ${pluralLabel}`
	}

	filters.countTag = count => {
		return `<span class="app-count-tag">${
			count == 0 ? 0 : filters.friendlyNumber(count)
		}</span>`
	}

	filters.pluralLabel = (count, singleLabel, pluralLabel) => {
		if (count == 1) {
			return `${singleLabel}`
		} else if (count > 1) {
			return `${pluralLabel}`
		}
		return `${pluralLabel}`
	}

	filters.getByCode = (array, str) => {
		if (Array.isArray(array)) {
			return array.find(obj => {
				return obj.code.toString() === str
			})
		} else {
			return nil
		}
	}

	filters.getURLParameter = (urlString, parameter) => {
		var url = new URL(urlString)
		var value = url.searchParams.get(parameter)
		return value
	}

	filters.randomSchool = () => {
		return generate.schoolName()
	}

	filters.randomName = () => {
		return generate.name()
	}

	filters.randomMiddleName = () => {
		return generate.firstName()
	}

	filters.randomItem = arr => {
		return generate.randomItemFrom(arr)
	}

	filters.phoneNumber = () => {
		return generate.phoneNumber()
	}

	filters.replaceLA = (ESTAB, laNumber) => {
		return laNumber + ESTAB.substr(3)
	}

	filters.stripLA = ESTAB => {
		return ESTAB.substr(4)
	}

	filters.initialLetter = name => {
		return name.charAt(0)
	}

	filters.laNameFromCode = LANo => {
		if (parseInt(LANo)) {
			const las = require('./data/simulated-data/local-authorities')
			const foundLA = las.filter(la => parseInt(LANo) == la.code)
			return foundLA[0].name
		}
		return 'Invalid LA Number'
	}

	filters.getLA = ESTAB => {
		return ESTAB.slice(0, -5)
	}

	filters.redirect = location => {
		return `<script>window.location.href = '${location}';</script>`
	}

	filters.readyCheck = school => {
		if (school.issues.length == 0) {
			return 'clean'
		} else if (
			filter.acceptedCount(school) > 0 &&
			filter.rejectedCount(school) == 0
		) {
			return 'ready'
		} else if (filter.rejectedCount(school) > 0) {
			return 'all-responded'
		}
		return 'in-progress'
	}

	filters.probability = float => {
		return Math.random() < float
	}

	/* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
	return filters
}
