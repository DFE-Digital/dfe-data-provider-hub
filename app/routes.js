const express = require('express')
const router = express.Router()
const set = require('lodash.set')
const get = require('lodash.get')

// Add your routes here - above the module.exports line

// Generic 'next page' rule
router.post('*', (req, res, next) => {
	if (req.body['next-page']) {
		res.redirect(req.body['next-page'])
	} else {
		next()
	}
})

// Save page load time to 'time' variable
router.all('*', (req, _, next) => {
	set(req.session.data, 'time', new Date().getTime())
	next()
})

module.exports = router
