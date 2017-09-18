import React, { Component } from 'react';
import { FormGroup, Col, FormControl, InputGroup, Button, Glyphicon } from 'react-bootstrap';

class Pair extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete();
  }

  handleChange(changes) {
    this.props.onChange(changes);
  }

  renderEditable() {
    return (
      <FormGroup className="key-value-bubble">
        <Col sm={12}>          
          <InputGroup>
            <FormControl type="text" name="name" placeholder="Name" value={this.props.name} onChange={e => this.handleChange({name: e.target.value})} />
            <FormControl type="text" name="value" placeholder="Value" value={this.props.value} onChange={e => this.handleChange({value: e.target.value})} />
            <InputGroup.Button>
              <Button onClick={this.handleDelete}><Glyphicon glyph="minus"/></Button>
            </InputGroup.Button>
          </InputGroup>
        </Col>
      </FormGroup>
    );
  }

  renderStatic() {
    return (
      <FormGroup>
        <Col sm={3}>
          <FormControl type="text" name="name" placeholder="Name" value={this.props.name} onChange={e => this.handleChange({name: e.target.value})} />
        </Col>
        <Col sm={9}>
          <FormControl type="text" name="value" placeholder="Value" value={this.props.value} onChange={e => this.handleChange({value: e.target.value})} />
        </Col>
      </FormGroup>
    );
  }

  render() {
    return this.props.editable ? this.renderEditable() : this.renderStatic();
  }
}

class PairList extends Component {
  handleDelete(index) {
    const newValue = this.props.value.slice();
    newValue.splice(index, 1);
    this.props.onChange(newValue);
  }

  handleChange(index, changes) {
    const newValue = this.props.value.slice();
    newValue[index] = Object.assign({}, this.props.value[index], changes);
    this.props.onChange(newValue);
  }

  handleAdd() {
    this.props.onChange(this.props.value.concat([{name: '', value: ''}]));
  }

  render() {
    const editable = 'editable' in this.props ? this.props.editable : true
    return (
      <div>
        {
          this.props.value.map((pair, index) => (
            <Pair key={index} name={pair.name} value={pair.value}
              onChange={(value) => this.handleChange(index, value)}
              onDelete={() => this.handleDelete(index)} editable={editable} />
          ))
        }
        {editable && (<FormGroup>
          <Col sm={12}>
            <Button onClick={() => this.handleAdd()}><Glyphicon glyph="plus" /> Add</Button>
          </Col>
        </FormGroup>)}
      </div>
    );
  }
}

PairList.Pair = Pair;

export default PairList;
