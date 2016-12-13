import React from 'react'

export default function PronunciationBox(props) {
  let inflection = ''
  if (props.inflection !== '') {
    inflection = (
      <div id="bojning">
        <p>{props.inflection}</p>
      </div>
    )
  }
  let pronunciations = ''
  if (props.pronunciations.length > 0) {
    const items = props.pronunciations.map(e => (
      <li>
        {e.text}
      </li>
    ))
    pronunciations = (
        <ul className="list-inline">
          {items}
        </ul>
    )
  }
  return (
    <div id="pronunciation">
      {pronunciations}
      {inflection}
    </div>
  )
}
