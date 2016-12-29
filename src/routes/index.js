'use strict'

import express from 'express'
import parser from '../lib/parser'

const router = express.Router()

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
