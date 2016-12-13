import React from 'react'

export default function DefinitionBox(props) {
  let definitions = ''
  if (props.definitions.length > 0) {
    const items = props.definitions.map(e => (
      <div className="definition">
        <p>{e.definition}</p>
      </div>
    ))
    definitions = (
      <div className="definitions">
        <h2>Betydninger</h2>
        {items}
      </div>
    )
  }

  return definitions
}
