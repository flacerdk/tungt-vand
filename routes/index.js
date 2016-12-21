'use strict'

var express = require('express')
var router = express.Router()
var parsePageEntry = require('../parser/parse-page-entry')

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/ddo', (req, res) => {
  const options = req.query
  parsePageEntry(options)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(404).send({error: err})
    })
})

module.exports = router;
