export default function fetchAndParse(options) {
  const query = options.query ? `&query=${options.query}` : ''
  const select = options.select ? `&select=${options.select}` : ''
  const mselect = options.mselect ? `&mselect=${options.mselect}` : ''
  const queryString = query + select + mselect
  return fetch(`http://127.0.0.1:3000/ddo?${queryString}`)
    .then(response => response.text())
    .catch(ex => console.log(ex))
}
