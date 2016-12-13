import React from 'react'
import { Button, FormControl, FormGroup } from 'react-bootstrap/lib'

export default function SearchBox(props) {
  return (
    <div class="search-box">
      <form action="" onSubmit={props.handleSubmit}>
        <FormGroup>
          <FormControl
            type="text"
            value={props.query}
            onChange={props.handleChange}
            placeholder="Slå op"
          />
        </FormGroup>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}
