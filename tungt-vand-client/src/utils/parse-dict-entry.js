'use strict'

export default function fetchAndParse(options) {
  const queryString = 'query=' + (options.query || '') + '&select=' + (options.select || '')
  return fetch(`http://127.0.0.1:3000/ddo?${queryString}`)
    .then(response => response.text())
    .catch(ex => console.log(ex))
}
