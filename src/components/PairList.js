import React, { Component } from 'react';
import { FormGroup, Col, FormControl, InputGroup, Button, Glyphicon } from 'react-bootstrap';

class Pair extends Component {
  static defaultProps = {
    name: '',
    value: '',
    editable: true,
  };

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    editable: React.PropTypes.bool.isRequired,
  };

  static EMPTY = { name: '', value: '' }

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

  render() {
    const valueInput = this.props.editable ?
      (
        <InputGroup>
          <FormControl type="text" placeholder="Value" value={this.props.value} onChange={e => this.handleChange({value: e.target.value})} />
          {this.props.editable && (<InputGroup.Button>
            <Button onClick={this.handleDelete}><Glyphicon glyph="minus"/></Button>
          </InputGroup.Button>)}
        </InputGroup>
      ) :
      (
        <FormControl type="text" placeholder="Value" value={this.props.value} onChange={e => this.handleChange({value: e.target.value})} />
      );
    return (
      <FormGroup>
        <Col sm={3}>
          <FormControl type="text" placeholder="Name" value={this.props.name} onChange={e => this.handleChange({name: e.target.value})} />
        </Col>
        <Col sm={9}>
          {valueInput}
        </Col>
      </FormGroup>
    )
  }
}

class PairList extends Component {
  static defaultProps = {
    editable: true,
  }

  static propTypes = {
    value: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired,
    editable: React.PropTypes.bool.isRequired,
  }

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
    this.props.onChange(this.props.value.concat([Pair.EMPTY]));
  }

  render() {
    return (
      <div>
        {
          this.props.value.map((pair, index) => (
            <Pair key={index} name={pair.name} value={pair.value}
              onChange={(value) => this.handleChange(index, value)}
              onDelete={() => this.handleDelete(index)} editable={this.props.editable} />
          ))
        }
        {this.props.editable && (<FormGroup>
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
