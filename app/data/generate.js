// @ts-check
const faker = require('faker/locale/en_GB')

// Generic helpers

/**
 * Shuffles an array
 *
 * @remarks
 * Shuffles the order of items in an array
 *
 * @param {any[]} array - The array to be shuffled
 * @returns The shuffled array
 *
 */

const shuffle = array => {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
}

var Generate = {}

// Generic generators

/**
 * Generate a UUID
 *
 * @remarks
 * Creates a universally unique identifier
 *
 * @returns A UUID as a string
 *
 */

Generate.uuid = () => {
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
 * Get a random item from a given array
 *
 * @remarks
 * Gets one random item from a given array
 *
 * @param {any[]} array - the array the random item will come from
 * @returns One item from the given array
 *
 */

Generate.randomItemFrom = array => {
	return array[Generate.randomNumber(0, array.length - 1)]
}

/**
 * Get a random integer given a minimum and maximum number
 *
 * @remarks
 * Generates a random integer between a given minimum and maximum inclusively
 *
 * @param {number} min - The minimum returnable number possible
 * @param {number} max - The maximum returnable number possible
 * @returns A random integer
 *
 */

Generate.randomNumber = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate a random code made of integers
 *
 * @remarks
 * Generates a string of a given length with random integer characters
 *
 * @param {number} length - The length of the eventual returned string
 * @returns A random code as a string
 *
 */

Generate.randomCode = length => {
	var output = ''
	var i = 0
	for (i; i < length; i++) {
		output += Generate.randomNumber(0, 9).toString()
	}
	return output
}

/**
 * Generate a random phone number
 *
 * @remarks
 * Generates a fake phone number using a United Kingdom localised library
 *
 * @returns A fake phone number as a string
 *
 */

Generate.phoneNumber = () => {
	return faker.phone.phoneNumber()
}

// Simulated dates

/**
 * Generate a random date
 *
 * @remarks
 * Generates a random date between a given number of days away from now
 *
 * @param {number} fromDaysBack - The number of days from today as a minimum returnable date
 * @param {number} toDaysBack - The number of days from today as a maximum returnable date
 * @returns A random date
 *
 */

Generate.randomDate = (fromDaysBack, toDaysBack) => {
	const millisecondsInADay = 24 * 60 * 60 * 1000
	const now = new Date().getTime()
	const maxTime = now - toDaysBack * millisecondsInADay
	const minTime = now - fromDaysBack * millisecondsInADay
	const randomUNIXSeconds = Generate.randomNumber(minTime, maxTime)
	return new Date(randomUNIXSeconds)
}

// Simulated people

/**
 * Generate a first name
 *
 * @remarks
 * Generates a fake first name using a United Kingdom localised library
 *
 * @returns A random first name as a string
 *
 */

Generate.firstName = faker.name.firstName

/**
 * Generate a last name
 *
 * @remarks
 * Generates a fake last name using a United Kingdom localised library
 *
 * @returns A random last name as a string
 *
 */

Generate.lastName = faker.name.lastName

/**
 * Generate a name
 *
 * @remarks
 * Generates a fake first and last name and joins them together using a United Kingdom localised library
 *
 * @returns A random name as a string
 *
 */

Generate.name = () => {
	return Generate.firstName() + ' ' + Generate.lastName()
}

/**
 * Generate a given number of collectors
 *
 * @remarks
 * Creates an array of collectors with a length equal to the given value
 *
 * @param {number} amount - The number of collectors needed in the array
 * @returns An array of random collectors
 *
 */

Generate.collectors = amount => {
	return new Array(amount).fill(null).map(_ => {
		let firstName = Generate.firstName()
		let lastName = Generate.lastName()
		return {
			id: Generate.uuid(),
			firstName: firstName,
			lastName: lastName,
			email:
				firstName.toLowerCase() +
				'.' +
				lastName.toLowerCase() +
				'@education.gov.uk',
			las: [],
			// Start each collector with zero local authorities
			weighting: Generate.randomItemFrom([1, 1, 1, 1, 30 / 37, 20 / 37])
			// Simulates full-time or part-time hours
		}
	})
}

/**
 * Generate a given number of pupils
 *
 * @remarks
 * Creates an array of pupils with a length equal to the given value
 *
 * @param {number} amount - The number of pupils needed in the array
 * @returns An array of random pupils
 *
 */

Generate.pupils = amount => {
	const upnPrefixes = ['W', 'X', 'P']
	const upnSuffixes = ['B', 'D', 'M']
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
			id: Generate.uuid(),
			surname: Generate.lastName().toUpperCase(),
			firstname: Generate.firstName(),
			UPN:
				Generate.randomItemFrom(upnPrefixes) +
				upnNumber(10) +
				Generate.randomItemFrom(upnSuffixes),
			dob: Generate.randomDate(18 * 365, 3 * 365)
		}
	})
}

// Simulated schools

/**
 * Generate a school name
 *
 * @remarks
 * Generates a fake city name using a United Kingdom localised library and adds a defined school name prefix to the end
 *
 * @returns A school name as a string
 *
 */

Generate.schoolName = () => {
	return (
		faker.address.city() +
		' ' +
		Generate.randomItemFrom([
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
 * Construct a school object
 *
 * @remarks
 * Constructs an not-yet-built school object
 *
 * @param {string} name
 * @param {string} laCode
 * @param {string} type
 * @param {number} noOfQueries
 * @returns A school object
 *
 */

Generate.newSchool = (name, laCode, type, noOfQueries, noOfErrors) => {
	return {
		name,
		type,
		noOfQueries,
		noOfErrors,
		LAESTAB: laCode.toString() + '/' + Generate.randomCode(4),
		hasBuilt: false,
		issues: [],
		provider: Generate.name()
	}
}

/**
 * Generate a school object
 *
 * @remarks
 * Generates a not-yet-built school object with a random name, LA code, type and number of queries and errors
 *
 * @returns A school object
 *
 */

Generate.school = () => {
	return Generate.newSchool(
		Generate.schoolName(),
		Generate.randomCode(3),
		Generate.randomItemFrom(['academy', 'maintained', 'maintained']),
		Generate.randomNumber(0, 25),
		Generate.randomNumber(0, 3)
	)
}

/**
 * Generate a given number of school objects
 *
 * @remarks
 * Generates an array of school objects with a length equal to the given value
 *
 * @param {number} amount - The number of pupils needed in the array
 * @returns An array of schools
 *
 */

Generate.schools = amount => {
	return new Array(amount).fill(null).map(() => {
		const school = Generate.school()
		school.id = Generate.uuid()
		school.submittedDate = Generate.randomDate(5, 1)
		return school
	})
}

/**
 * Generate a given number of queries
 *
 * @remarks
 * Gathers a number of random queries from an array of queries and returns an array of queries with a given length
 *
 * @param {number} amount - The number of queries needed in the array
 * @param {any[]} queryArray - The source array of queries
 * @returns An array of queries
 *
 */

Generate.queries = (amount, queryArray) => {
	var output = []
	queryArray.forEach(query => {
		query.id = Generate.uuid()
		query.handled = 'false'
		output.push(query)
	})
	shuffle(output)
	output.length = amount < queryArray.length ? amount : queryArray.length
	return output
}

/**
 * Generate a given number of queries for school action
 *
 * @remarks
 * Gathers a number of random queries from an array of queries and returns an array of queries with a given length with no notes and needing school action
 *
 * @param {number} amount - The number of queries needed in the array
 * @param {any[]} queryArray - The source array of queries
 * @returns An array of queries
 *
 */

Generate.schoolQueries = (amount, queryArray) => {
	var output = []
	queryArray.forEach(query => {
		query.id = Generate.uuid()
		query.handled = 'false'
		query.isResolved = 'false'
		query.notes = []
		output.push(query)
	})
	shuffle(output)
	output.length = amount < queryArray.length ? amount : queryArray.length
	return output
}

/**
 * Generate a given number of errors
 *
 * @remarks
 * Gathers a number of random errors from an array of errors and returns an array of errors with a given length
 *
 * @param {number} amount - The number of errors needed in the array
 * @param {any[]} errorArray - The source array of errors
 * @returns An array of errors
 *
 */

Generate.errors = (amount, errorArray) => {
	var output = []
	errorArray.forEach(error => {
		error.id = Generate.uuid()
		output.push(error)
	})
	shuffle(output)
	output.length = amount < errorArray.length ? amount : errorArray.length
	return output
}

/**
 * Generate a given number of errors for school action
 *
 * @remarks
 * Gathers a number of random errors from an array of errors and returns an array of errors with a given length with no notes and needing school action
 *
 * @param {number} amount - The number of errors needed in the array
 * @param {any[]} errorArray - The source array of errors
 * @returns An array of errors
 *
 */

Generate.schoolErrors = (amount, errorArray) => {
	var output = []
	errorArray.forEach(error => {
		error.id = Generate.uuid()
		error.handled = 'false'
		error.isResolved = 'false'
		error.notes = []
		output.push(error)
	})
	shuffle(output)
	output.length = amount < errorArray.length ? amount : errorArray.length
	return output
}

module.exports = Generate
