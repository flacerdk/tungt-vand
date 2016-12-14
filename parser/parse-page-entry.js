'use strict'

var cheerio = require('cheerio')
var fetch = require('node-fetch')
var url = require('url')

function pageElement(options) {
  const that = {}
  that.$ = cheerio.load(options.body)
  that.element = that.$(options.element)
  that.parse = () => {
    return null
  }
  return that
}

function title(body) {
  const that = pageElement({
    body: body,
    element: '.definitionBoxTop'
  })
  that.parse = () => {
    const title = {}
    title.title = that.element.find('.match').first().text()
    title.attributes = that.element.find('.tekstmedium').first().text()
    return title
  }
  return that.parse()
}

function pronunciations(body) {
  const that = pageElement({
    body,
    element: '#id-udt .tekstmedium',
  })
  that.parse = () => {
    const pronunciations = []
    const pronunciationsSoup = that.element.children()

    let item = {text: ''}
    pronunciationsSoup.each((i, vTag) => {
      const v = that.$(vTag)
      if (v.attr('class') === 'dividerDouble') {
        item.text = item.text.replace(/^\s+/, '').replace(/\s+$/, '')
        pronunciations.push(item)
        item = {text: ''}
      }
      item.text += v.text() +  ' '
      const audio = v.find('audio a').attr('href')
      if (typeof audio !== 'undefined') {
        item.transcription = v.find('audio a').attr('href')
      }
    })
    item.text = item.text.replace(/^\s+/, '').replace(/\s+$/, '')
    pronunciations.push(item)
    return pronunciations
  }
  return that.parse()
}

function definitions(body, options) {
  let that = pageElement({
    body,
    element: (options && options.element) || '#content-betydninger .definition',
  })
  if (that.element.length === 0) {
    that = pageElement({
      body,
      element: '.definition',
    })
  }

  that.parse = () => {
    const definitions = []
    that.element.each((i, vTag) => {
      const item = {}
      const v = that.$(vTag)
      const parent = v.parents('.definitionIndent')
      item.definition = parent.find('.definition').text()
      const synonyms = parent.find('span:contains(Synonym)').next().find('a')
      if (synonyms.length > 0) {
        item.synonyms = []
        synonyms.each((i, e) => {
          const synonym = {}
          synonym.text = e.children[0].data
          synonym.link = e.attribs.href
          item.synonyms.push(synonym)
        })
      }
      definitions.push(item)

      const grammar = parent.find('.grammatik .inlineList')
      if (grammar.length > 0) {
        item.grammar = grammar.text().split('\xa0 ')
      }

      const quotes = parent.find('.citat')
      if (quotes.length > 0) {
        item.quotes = []
        quotes.each((i, e) => {
          item.quotes.push(e.children[0].data)
        })
      }

      const examples = parent.find('.definitionBox :contains(Eksempler)')
      if (examples.length > 0) {
        item.examples = examples.next().text().split('\xa0 ')
      }

      if (typeof options !== 'undefined' &&
          'withHeader' in options) {
        const headerTitle = that.$(parent.prevAll('.definitionBox')[0]).text()
              .replace(/\s+/gm, ' ')
              .replace(/^\s+/, '')
              .replace(/\s+$/, '')
        item.title = headerTitle
      }
    })
    return definitions
  }

  return that.parse()
}

function inflection(body) {
  const that = pageElement({
    body,
    element: '#id-boj .tekstmedium',
  })
  that.parse = () => {
    return that.element.text() || ''
  }
  return that.parse()
}

function suggestions(body) {
  const that = pageElement({
    body,
    element: '.searchResultBox',
  })

  that.parse = () => {
    that.element.find('.arrow-mini').replaceWith('→')
    const items = []
    that.element.find('a').each((i, eTag) => {
      const e = that.$(eTag)
      const item = {}
      item.link = url.parse(e.attr('href')).query
      item.text = e.text()
        .replace(/^\s+/, '')
        .replace(/\s+$/, '')
      items.push(item)
    })
    return items
  }
  return that.parse()
}

function parsePage(body) {
  return {
    title: title(body),
    pronunciations: pronunciations(body),
    definitions: definitions(body),
    faste_udtryk: definitions(body, {
      element: '#content-faste-udtryk .definition',
      withHeader: true,
    }),
    inflection: inflection(body),
    suggestions: suggestions(body),
  }
}

function parsePageEntry(options) {
  const query = options.query ? '&query=' + options.query : ''
  const select = options.select ? '&select=' + options.select : ''
  const mselect = options.mselect ? '&mselect=' + options.mselect : ''
  const queryString = query + select + mselect
  return fetch(`http://ordnet.dk/ddo/ordbog?${queryString}`)
    .then((response) => {
      return response.text()
    })
    .then((data) => {
      return parsePage(data)
    })
}

module.exports = {
  pageElement,
  title,
  pronunciations,
  definitions,
  inflection,
  parsePage,
  parsePageEntry,
}