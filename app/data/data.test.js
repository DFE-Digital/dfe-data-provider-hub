/* eslint-env jest */
const Generate = require('./generate')

test('random number generator', () => {
	const result = Generate.randomNumber(0, 9)
	expect(result).toBeGreaterThanOrEqual(0)
	expect(result).toBeLessThanOrEqual(9)
})

test('generate a universally unique identifier UUID', () => {
	const result = Generate.uuid()
	expect(result.length).toBe(36)
})

test('get random item from a given array', () => {
	const result = Generate.randomItemFrom([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	expect(result).toBeGreaterThanOrEqual(0)
	expect(result).toBeLessThanOrEqual(9)
})

test('generate a random code of integers for a given length', () => {
	const result = Generate.randomCode(6)
	expect(result.length).toBe(6)
})
