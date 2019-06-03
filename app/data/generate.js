// @ts-check
const faker = require('faker/locale/en_GB')

// Generic helpers

/**
 * @param {any[]} array
 */

const shuffle = array => {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
}

var generate = {}

// Generic generators

generate.uuid = () => {
	var dt = new Date().getTime()
	/* cspell:disable-next-line */
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
		c
	) {
		var r = (dt + Math.random() * 16) % 16 | 0
		dt = Math.floor(dt / 16)
		return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
	})
	return uuid
}

/**
 * @param {any[]} array
 */

generate.randomItemFrom = array => {
	return array[Math.floor(Math.random() * array.length)]
}

/**
 * @param {number} min
 * @param {number} max
 */

generate.randomNumber = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * @param {number} length
 */

generate.randomCode = length => {
	var output = ''
	var i = 0
	for (i; i < length; i++) {
		output += generate.randomNumber(0, 9).toString()
	}
	return output
}

generate.phoneNumber = () => {
	return faker.phone.phoneNumber()
}

// Simulated dates

/**
 * @param {number} fromDaysBack
 * @param {number} toDaysBack
 */

generate.randomDate = (fromDaysBack, toDaysBack) => {
	const millisecondsInADay = 24 * 60 * 60 * 1000
	const now = new Date().getTime()
	const maxTime = now - toDaysBack * millisecondsInADay
	const minTime = now - fromDaysBack * millisecondsInADay
	const randomUNIXSeconds = generate.randomNumber(minTime, maxTime)
	return randomUNIXSeconds
}

// Simulated people

generate.firstName = faker.name.firstName
generate.lastName = faker.name.lastName

generate.name = () => {
	return generate.firstName() + ' ' + generate.lastName()
}

/**
 * @param {number} amount
 */

generate.collectors = amount => {
	return new Array(amount).fill(null).map(_ => {
		let firstName = generate.firstName()
		let lastName = generate.lastName()
		return {
			id: generate.uuid(),
			firstName: firstName,
			lastName: lastName,
			email:
				firstName.toLowerCase() +
				'.' +
				lastName.toLowerCase() +
				'@education.gov.uk',
			las: [],
			// Start each collector with zero local authorities
			weighting: generate.randomItemFrom([1, 1, 1, 1, 30 / 37, 20 / 37])
			// Simulates full-time or part-time hours
		}
	})
}

/**
 * @param {number} amount
 */

generate.pupils = amount => {
	const upnPrefixes = ['W', 'X', 'P']
	const upnSuffixes = ['B', 'D', 'M']
	const days = new Array(28).fill(null).map((_, i) => i + 1)
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
	const years = new Array(8).fill(null).map((_, i) => i + 2009)
	/**
	 * @param {number} length
	 */
	const upnNumber = length => {
		const numberArray = new Array(length)
			.fill(null)
			.map(_ => Math.floor(Math.random() * 9).toString())
		return numberArray.join('')
	}
	return new Array(amount).fill(null).map(_ => {
		return {
			id: generate.uuid(),
			surname: generate.lastName().toUpperCase(),
			firstname: generate.firstName(),
			UPN:
				generate.randomItemFrom(upnPrefixes) +
				upnNumber(10) +
				generate.randomItemFrom(upnSuffixes),
			dob:
				generate.randomItemFrom(days) +
				' ' +
				generate.randomItemFrom(months) +
				' ' +
				generate.randomItemFrom(years)
		}
	})
}

// Simulated schools

generate.schoolName = () => {
	return (
		faker.address.city() +
		' ' +
		generate.randomItemFrom([
			'High School',
			'Primary School',
			'Primary School',
			'Primary School',
			'Primary School',
			'Community Primary School',
			'Infants',
			'Community School',
			'Secondary School',
			'Secondary School',
			'Secondary School',
			'Academy',
			'Grammar School',
			'Technical School',
			'College',
			'College',
			'Institute'
		])
	)
}

/**
 * @param {string} name
 * @param {string} laCode
 * @param {string} type
 * @param {number} noOfQueries
 */

generate.school = (name, laCode, type, noOfQueries) => {
	return {
		name,
		type,
		noOfQueries,
		noOfErrors: generate.randomItemFrom([
			0,
			0,
			0,
			0,
			generate.randomNumber(0, 5)
		]),
		LAESTAB: laCode.toString() + '/' + generate.randomCode(4),
		queries: []
	}
}

/**
 * @param {number} amount
 */

generate.schools = amount => {
	return new Array(amount).fill(null).map((_, i) => {
		const school = generate.school(
			generate.schoolName(),
			generate.randomCode(3),
			generate.randomItemFrom(['academy', 'maintained', 'maintained']),
			generate.randomNumber(0, 25)
		)
		school.id = i
		school.submittedDate = generate.randomDate(5, 1)
		return school
	})
}

// Simulated local authorities

generate.localAuthorities = require('./simulated-data/local-authorities')

/**
 * @param {number} amount
 * @param {any[]} queryArray
 */

generate.queries = (amount, queryArray) => {
	var output = []
	queryArray.forEach(query => {
		query.id = generate.uuid()
		query.handled = 'false'
		output.push(query)
	})
	shuffle(output)
	output.length = amount < queryArray.length ? amount : queryArray.length
	return output
}

/**
 * @param {number} amount
 */

generate.schoolQueries = (amount, queryArray) => {
	var output = []
	queryArray.forEach(query => {
		query.id = generate.uuid()
		query.handled = 'false'
		query.notes = []
		output.push(query)
	})
	shuffle(output)
	output.length = amount < queryArray.length ? amount : queryArray.length
	return output
}

/**
 * @param {number} amount
 */

generate.errors = (amount, errorArray) => {
	var output = []
	errorArray.forEach(error => {
		error.id = generate.uuid()
		output.push(error)
	})
	shuffle(output)
	output.length = amount < errorArray.length ? amount : errorArray.length
	return output
}

module.exports = generate