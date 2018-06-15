
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, FormGroup, FormControl, ControlLabel, InputGroup, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
//import { a  } from 'react-router';

export default class IssueFilter extends React.Component {
  constructor(props) {//props means props given from parent component (setFilter in this case)
    super(props);
    this.state = {//this is initial state of filter: any value from previous filtering or ''
      status: props.initFilter.status || '',//initFilter is a variable, which is a part of state
      effort_gte: props.initFilter.effort_gte || '',//initFilter connects state and displayed value
      effort_lte: props.initFilter.effort_lte || '',//so, when we change initFilter, displayed value changing too
      changed: false,
    }
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeEffortGte = this.onChangeEffortGte.bind(this);
    this.onChangeEffortLte = this.onChangeEffortLte.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }
  //author of the book uses this method despite warning on React official documentation(ROD)
  //he says it because of componentWillReceiveProps make code more readable and clear
  //it's invoked whenever the props are changing, before a mounted component r e s e i v e s new props
  //and update this.state on the fly

  componentWillReceiveProps(newProps) {
    this.setState({
      status: newProps.initFilter.status || '',
      effort_gte: newProps.initFilter.effort_gte || '',
      effort_lte: newProps.initFilter.effort_lte || '',
      changed: false,
    });
  }
  //should be invoked by clicking corresponding button in filter section
  //clear any filter settings before applying, similar to clearFilter, but before sending data
  resetFilter() {
    this.setState({
      status: this.props.initFilter.status || '',
      effort_gte: this.props.initFilter.effort_gte || '',
      effort_lte: this.props.initFilter.effort_lte || '',
      changed: false,
    });
  }
  clearFilter(e) {
    e.preventDefault();
    this.props.setFilter({});
  }
  onChangeStatus(e){
    this.setState({ status: e.target.value, changed: true });
  }
  //next two functions check if values in effort fields are digital, and if they are, change state variable
  onChangeEffortGte(e) {
    const effortString = e.target.value;
    console.log(typeof fortString);
    if (effortString.match(/^\d+/)) {
      this.setState({ effort_gte: e.target.value, changed:true });
    }
  }
  onChangeEffortLte(e) {
    const effortString = e.target.value;
    console.log(typeof fortString);
    if (effortString.match(/^\d+/)) {
      this.setState({ effort_lte: e.target.value, changed:true });
    }
  }
  applyFilter() {
    const newFilter = {};//variable for keeping each new filter settings
    if (this.state.status) {
      newFilter.status = this.state.status;
    }
    if (this.state.effort_gte) {
      newFilter.effort_gte = this.state.effort_gte;
    }
    if (this.state.effort_lte) {
      newFilter.effort_lte = this.state.effort_lte;
    }
    this.props.setFilter(newFilter);//this is parent props setFilter, with parameters from variable
    //newFilter
  }
  
  render() {
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={3}>
          <FormGroup>
            <ControlLabel>Status</ControlLabel>
            <FormControl componentClass="select" value={this.state.status} onChange={this.onChangeStatus}>
              <option value="">(Any)</option>
              <option value="New">New</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Verified">Verified</option>
              <option value="Closed">Closed</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={3}>
          <FormGroup>
            <ControlLabel>Effort</ControlLabel>
              <InputGroup>
                <FormControl value={this.state.effort_gte} onChange={this.onChangeEffortGte} />
                <InputGroup.Addon>-</InputGroup.Addon>
                <FormControl value={this.state.effort_lte} onChange={this.onChangeEffortLte} />
              </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={3}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar >
              <ButtonGroup bsSize="">{/*the only way for sizing all group of button*/}
                <Button bsStyle="primary" onClick={this.applyFilter}>Apply</Button>
                <Button onClick={this.resetFilter} disabled={!this.state.changed}>Reset</Button>
                <Button onClick={this.clearFilter}>Clear</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}
IssueFilter.propTypes = {
   setFilter: PropTypes.func.isRequired,
   initFilter: PropTypes.object.isRequired,
}
// default
