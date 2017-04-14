import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Grid, Row } from 'react-bootstrap';
import RequestBuilder from './components/RequestBuilder';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Bork</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem href="/">Console</NavItem>
          </Nav>
        </Navbar>
        <Grid>
          <Row>
            <RequestBuilder />
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
