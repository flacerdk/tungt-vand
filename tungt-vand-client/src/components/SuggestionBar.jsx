import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap/lib'

export default function SuggestionBar(props) {
  let suggestionList = null
  if (props.suggestions.length > 0) {
    const items = props.suggestions.map((e, i) => {
      const onClick = props.onClick.bind(null, e.link)
      return (
        <ListGroupItem key={i} onClick={onClick}>{e.text}</ListGroupItem>
      )
    })
    suggestionList = (
      <ListGroup>
        {items}
      </ListGroup>
    )
  }
  return suggestionList
}
