import React, { Component } from 'react';
import EndpointPicker from './EndpointPicker';
import PairList from './PairList';
import { Form, Nav, NavItem, FormGroup, Col, FormControl, Label, Checkbox } from 'react-bootstrap';
import superagent from 'superagent';

class RequestBuilder extends Component {
  static defaultProps = {
    apiUrl: '/api'
  };

  static propTypes = {
    apiUrl: React.PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      method: 'GET',
      url: '',
      isLoading: false,
      activeTab: 'request',
      showResponseHeaders: false,
      headers: [
        { name: 'accept', value: 'application/json' },
        { name: 'content-type', value: 'application/json' },
      ],
    };
  }

  componentWillUnmount() {
    this.request && this.request.abort();
  }

  handleChange(changes) {
    this.setState(changes);
  }

  requestData() {
    const {method, url, headers} = this.state;
    return {method, url, headers};
  }

  handleSend() {
    this.setState({
      isLoading: true,
      error: null,
    });

    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json'
    };
    this.request = superagent
      .post(`${this.props.apiUrl}/requests`)
      .set(headers)
      .send(this.requestData())
      .then(resp => {
        if (resp.status === 200) {
          this.setState({
            response: resp.body,
            activeTab: 'response',
            isLoading: false,
          });
        } else {
          this.setState({
            error: (resp.body !== null && typeof resp.body === 'object') ? resp.body.error : resp.body,
            activeTab: 'response',
            isLoading: false,
          });
        }
      }).catch(err => {
        console.error(err);
        this.setState({
          error: err,
          response: null,
          activeTab: 'response',
          isLoading: false,
        });
      });
  }

  render() {
    const exampleUrl = "https://api.github.com/users/okfn"; // eslint-disable-line no-template-curly-in-string
    return (
      <Col sm={12}>
        <Form horizontal>
          <EndpointPicker method={this.state.method} url={this.state.url} onChange={(changes) => this.handleChange(changes)} placeholder={exampleUrl} isLoading={this.state.isLoading} onSend={() => this.handleSend()} />

          <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={(key) => this.setState({activeTab: key})}>
            <NavItem eventKey="request" href="/home">Request</NavItem>
            <NavItem eventKey="response" disabled={!this.state.response}>Response</NavItem>
          </Nav>

          <div style={{display: this.state.activeTab === 'request' ? 'block' : 'none'}}>
            {this.renderRequest()}
          </div>
          <div style={{display: this.state.activeTab === 'response' ? 'block' : 'none'}}>
            {this.state.error && this.renderError()}
            {this.state.response && this.renderResponse()}
          </div>
        </Form>
      </Col>
    );
  }

  renderRequestBody() {
    return (
      <div>
        <h4>Request Body</h4>
        <FormGroup>
          <Col sm={12}>
            <FormControl componentClass="textarea" rows={10} />
          </Col>
        </FormGroup>
      </div>
    )
  }

  renderRequest() {
    return (
      <div>
        <h4>Headers</h4>
        <PairList value={this.state.headers} onChange={(value) => this.handleChange({headers: value})} />
        {['GET', 'DELETE', 'HEAD'].includes(this.state.method) ? undefined : this.renderRequestBody()}
      </div>
    )
  }

  renderError() {
    return (
      <FormGroup>
        <Col sm={12}>
          There was an error making the request.
        </Col>
      </FormGroup>
    );
  }

  renderResponse() {
    const {status, headers, body} = this.state.response;
    const statusStyle = status >= 400 ? 'danger' : (status >= 300 ? 'info' : 'success');
    const display = JSON.stringify(body, null, 2);
    return (
      <div>
        <FormGroup>
          <Col sm={1}>
            <Label bsStyle={statusStyle}>{status}</Label>
          </Col>
          <Col sm={2}>
            <Checkbox value="showResponseHeaders" onChange={(event) => { this.setState({showResponseHeaders: event.target.checked}) }} checked={this.state.showResponseHeaders}>Show Headers</Checkbox>
          </Col>
        </FormGroup>
        {this.state.showResponseHeaders && (<div>
          <h4>Headers</h4>
          <PairList value={headers} onChange={changes => null} editable={false} />
        </div>)}
        <h4>Response Body</h4>
        <FormGroup>
          <Col sm={12}>
            <FormControl componentClass="textarea" rows={10} value={display} onChange={() => {}} />
          </Col>
        </FormGroup>
      </div>
    )
  }
}

export default RequestBuilder;
