var express = require('express')
var router = express.Router()
var parsePageEntry = require('../parser/parse-page-entry').parsePageEntry

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/ddo', (req, res) => {
  const options = req.query
  parsePageEntry(options)
    .then(data => {
      res.send(data)
    })
    .catch(ex => console.log(ex))
})

module.exports = router;
