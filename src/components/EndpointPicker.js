import React, { Component } from 'react';
import { FormGroup, Col, InputGroup, DropdownButton, MenuItem,
         FormControl, Modal, ButtonGroup, Button } from 'react-bootstrap';

class EndpointPicker extends Component {
  static METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  static EXTRA_METHODS = ['HEAD', 'OPTIONS', 'CONNECT']

  constructor(props) {
    super(props);
    this.state = {
      showMethodModal: false
    }
  }

  handleChange(changes) {
    this.props.onChange && this.props.onChange(changes);
  }

  handleMethodSelect(method) {
    if (method === false) {
      this.setState({
        showMethodModal: true
      });
    } else {
      this.setState({showMethodModal: false});
      this.handleChange({method: method});
    }
  }

  render() {
    return (
      <FormGroup>
        <Col sm={12}>
          <InputGroup>
            <DropdownButton id="method" componentClass={InputGroup.Button} onSelect={(eventKey) => this.handleMethodSelect(eventKey)} title={this.props.method}>
              {
                EndpointPicker.METHODS.map(method => (
                  <MenuItem key={method} eventKey={method}>{method}</MenuItem>
                ))
              }
              <MenuItem eventKey={false}>Other...</MenuItem>
            </DropdownButton>
            <FormControl type="text" placeholder={this.props.placeholder} value={this.state.url} onChange={(e) => this.handleChange({url: e.target.value})} />
            <InputGroup.Button>
              <Button bsStyle="primary" onClick={() => this.props.isLoading || this.props.onSend()} disabled={this.props.isLoading}>Send</Button>
            </InputGroup.Button>
            <SelectMethodModal showMethodModal={this.state.showMethodModal} value={this.props.method} onHide={() => this.setState({showMethodModal: false})} onChange={(method) => this.handleMethodSelect(method)} />
          </InputGroup>
        </Col>
      </FormGroup>
    );
  }
}

class SelectMethodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customMethod: '',
      customMethodInvalid: false
    };
  }

  isCustomMethod(method) {
    return !(EndpointPicker.METHODS.includes(method) ||
             EndpointPicker.EXTRA_METHODS.includes(method));
  }

  componentWillReceiveProps(nextProps) {
    if ((!this.props.showMethodModal) && nextProps.showMethodModal) {
      this.setState({
        customMethod: this.isCustomMethod(nextProps.value) ? nextProps.value : '',
        customMethodInvalid: false
      });
    }
  }

  handleHide() {
    this.props.onHide();
  }

  handleSelect(method) {
    this.props.onChange(method);
  }

  validateMethod(method) {
    return /^[A-Z]/.test(method);
  }

  handleCustomMethodChange(method) {
    const newValue = method.toUpperCase().replace(/\s+/g, '');
    const customMethodInvalid = this.state.customMethodInvalid
                                ? !this.validateMethod(newValue)
                                : false;
    this.setState({
      customMethod: newValue,
      customMethodInvalid
    });
  }

  chooseCustomMethod() {
    if (this.validateMethod(this.state.customMethod)) {
      this.props.onChange(this.state.customMethod);
    } else {
      this.setState({customMethodInvalid: true});
    }
  }

  renderMethodButtons(methods) {
    return methods.map(method => ((
      <Button key={method} onClick={() => this.handleSelect(method)}>{method}</Button>
    )));
  }

  render() {
    return (
      <Modal show={this.props.showMethodModal} onHide={() => this.handleHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Request Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <ButtonGroup>
              {
                EndpointPicker.METHODS.map(method => (
                  <Button key={method} onClick={() => this.handleSelect(method)}>{method}</Button>
                ))
              }
            </ButtonGroup>
          </FormGroup>
          <FormGroup>
            <ButtonGroup>
              {
                EndpointPicker.EXTRA_METHODS.map(method => (
                  <Button key={method} onClick={() => this.handleSelect(method)}>{method}</Button>
                ))
              }
            </ButtonGroup>
          </FormGroup>
          <FormGroup validationState={this.state.customMethodInvalid ? 'error' : null}>
            <InputGroup>
              <FormControl type="text" placeholder="HTTP Method"
                           value={this.state.customMethod}
                           onChange={(e) => this.handleCustomMethodChange(e.target.value)} />
              <InputGroup.Button>
                <Button onClick={() => this.chooseCustomMethod()}>OK</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </Modal.Body>
      </Modal>
    );
  }
}

export default EndpointPicker;
