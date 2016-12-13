'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import fetchAndParse from './utils/parse-dict-entry'
import { Grid, Col } from 'react-bootstrap/lib'
import MainPage from './components/MainPage'
import PronunciationBox from './components/PronunciationBox'
import DefinitionBox from './components/DefinitionBox'
import SearchBox from './components/SearchBox'

function renderEntry(entry) {
  const title = (<h1>{entry.title.title}</h1>)
  const pronunciationBox = (<PronunciationBox
                              inflection={entry.inflection}
                              pronunciations={entry.pronunciations}
                            />)
  const definitions = (<DefinitionBox definitions={entry.definitions} />)
  const fasteUdtryk = (<DefinitionBox definitions={entry.faste_udtryk} />)
  return (
    <div>
      {title}
      {pronunciationBox}
      {definitions}
      {fasteUdtryk}
    </div>
  )
}

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      query: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({query: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    fetchAndParse({query: this.state.query})
      .then((r) => this.setState({ data: JSON.parse(r), query: '' }))
  }

  render() {
    let leftColumn
    if (Object.keys(this.state.data).length > 0) {
      leftColumn = renderEntry(this.state.data)
    } else {
      leftColumn = (<MainPage />)
     }
     return (
       <Grid fluid>
         <Col xs={8}>
           {leftColumn}
         </Col>
         <Col xs={4}>
           <SearchBox
             handleChange={this.handleChange}
             query={this.state.query}
             handleSubmit={this.handleSubmit}
           />
         </Col>
       </Grid>
     )
   }
 }

 ReactDOM.render(
     <Page />,
     document.getElementById('root')
 )
