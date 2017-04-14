import React, { Component } from 'react';
import { Form, FormGroup, Col, ButtonGroup, Button } from 'react-bootstrap';

class Builder extends Component {
  render() {
    return (
      <Form horizontal>
        <FormGroup>
          <ButtonGroup>
            <Button>Input</Button>
            <Button>Output</Button>
            <Button>Request</Button>
            <Button>Response</Button>
          </ButtonGroup>
        </FormGroup>
        <FormGroup>
          <ButtonGroup>
            <Button>Data</Button>
            <Button>Template</Button>
          </ButtonGroup>
        </FormGroup>
      </Form>
    );
  }
}

export default Builder;
