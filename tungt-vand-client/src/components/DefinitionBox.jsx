import React from 'react'

function buildExampleList(items, className, renderFunction) {
  let exampleList = null
  if (typeof items !== 'undefined' && items.length > 0) {
    const exampleItems = items.map(renderFunction)
    exampleList = (
      <p className={className}>
        {exampleItems}
      </p>
    )
  }
  return exampleList
}

export default function DefinitionBox(props) {
  let definitions = null
  if (props.definitions.length > 0) {
    const items = props.definitions.map((e) => {
      const grammar = buildExampleList(e.grammar, 'small', g => (<em>{g} | </em>))
      const examples = buildExampleList(e.examples, 'small', g => (<em>{g} | </em>))
      const synonyms = buildExampleList(e.synonyms, 'synonym', g => (<em>{g.text} | </em>))
      const quotes = buildExampleList(e.quotes, 'quotes', g => (<em>{g} | </em>))

      return (
        <div className="definition">
          <p>{e.definition}</p>

          {grammar}
          {examples}
          {synonyms}
          {quotes}
        </div>
      )
    })
    definitions = (
      <div className="definitions">
        <h2>{props.header}</h2>
        {items}
      </div>
    )
  }

  return definitions
}
