'use strict'

import express from 'express'
import { pageEntry } from '../lib/parser'

const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'DDO' });
})

router.get('/ddo', (req, res) => {
  const options = req.query
  pageEntry(options)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(404).send({error: err.toString()})
    })
})

export { router as default }
