'use strict'

var cheerio = require('cheerio')
var fetch = require('node-fetch')
var url = require('url')
var querystring = require('querystring')

const removeSpaces = text => text
      .replace(/\s+/gm, ' ')
      .replace(/^\s+/, '')
      .replace(/\s+$/, '')

class Page {
  constructor({ body }) {
    this.page = {}
    this.$ = cheerio.load(body)
    this.pageElement = this.pageElement.bind(this)
  }

  pageElement(selector) {
    const element = this.$(selector)
    const superSpan = element.find('.super')
    superSpan.each((i, eTag) => {
      const e = this.$(eTag)
      e.replaceWith(` (${e.text()})`)
    })
    return element
  }

  parseTitle() {
    const element = this.pageElement('.definitionBoxTop')
    const title = {}
    title.title = element.find('.match').first().text()
    title.attributes = element.find('.tekstmedium').first().text()
    return title
  }

  parseDefinitions({ selector, withHeader = false }) {
    let element = this.pageElement(selector || '#content-betydninger .definition')
    const definitions = []
    element.each((i, vTag) => {
      const item = {}
      const v = this.$(vTag)
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

      if (withHeader) {
        const headerTitle = removeSpaces(this.$(parent.prevAll('.definitionBox')[0]).text())
        item.title = headerTitle
      }
    })
    return definitions
  }

  parsePronunciations() {
    const element = this.pageElement('#id-udt .tekstmedium')

    if (element.length === 0) {
      return []
    }

    const pronunciations = []
    const pronunciationsSoup = element.children()

    let item = {transcription: '', details: ''}
    pronunciationsSoup.each((i, vTag) => {
      const v = this.$(vTag)
      if (v.attr('class') === 'dividerDouble') {
        item.transcription = removeSpaces(item.transcription)
        item.details = removeSpaces(item.details)
        pronunciations.push(item)
        item = {transcription: '', details: ''}
        const next = v.next()
        if (next.attr('class') === 'diskret') {
          item.details = next.text()
        }
      } else if (v.attr('class') === 'lydskrift') {
        item.transcription += v.text() + ' '
      } else {
        return null
      }
      const audio = v.find('audio a').attr('href')
      if (typeof audio !== 'undefined') {
        item.audio = v.find('audio a').attr('href')
      }
    })
    item.details = removeSpaces(item.details)
    item.transcription = removeSpaces(item.transcription)
    pronunciations.push(item)
    return pronunciations
  }

  parseInflection() {
    const element = this.pageElement('#id-boj .tekstmedium')
    return element.text() || ''
  }

  parseSuggestions() {
    const element = this.pageElement('.searchResultBox').first()
    element.find('.arrow-mini').replaceWith('→')
    const items = []
    element.find('a').each((i, eTag) => {
      const e = this.$(eTag)
      const item = {}
      item.link = querystring.parse(url.parse(e.attr('href')).query)
      item.text = removeSpaces(e.text())
      items.push(item)
    })
    return items
  }

  parse() {
    let definitions = this.parseDefinitions({})
    let fasteUdtryk = []
    if (definitions.length === 0) {
      definitions = this.parseDefinitions({
        selector: '.definition'
      })
    } else {
      fasteUdtryk = this.parseDefinitions({
        selector: '#content-faste-udtryk .definition',
        withHeader: true,
      })
    }

    return {
      title: this.parseTitle(),
      pronunciations: this.parsePronunciations(),
      definitions,
      fasteUdtryk,
      inflection: this.parseInflection(),
      suggestions: this.parseSuggestions(),
    }
  }
}

function parsePageEntry(query) {
  if (typeof query.query === 'undefined' || query.query === '') {
    return Promise.reject(new Error("empty query"))
  }
  const queryString = querystring.stringify(query)
  return fetch(`http://ordnet.dk/ddo/ordbog?${queryString}`)
    .then((response) => {
      if (response.status >= 300) {
        return Promise.reject(new Error(response.statusText))
      }
      return response.text()
    })
    .then((data) => {
      const page = new Page({ body: data })
      return page.parse()
    })
}

module.exports = {
  parsePageEntry,
  Page
}
