'use strict'

var express = require('express')
var router = express.Router()
var parser = require('../lib/parser')

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
})

router.get('/ddo', (req, res) => {
  const options = req.query
  parser.pageEntry(options)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(404).send({error: err.toString()})
    })
})

module.exports = router
