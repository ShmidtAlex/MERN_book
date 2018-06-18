import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {Form, Col, FormGroup, FormControl, ControlLabel, ButtonToolbar, Button, Panel, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';

export default class IssueEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      issue: {
        //these are the properties of issue object and names for each inputs both
        _id:'', title: '', status: '', owner: '', effort: null, 
        completionDate: null, created: null,
      },
      invalidFields: {}, showingValidation: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id){
      this.loadData();
    }
  }
  //we got 'valid' argument from child component
  onValidityChange(event, valid) {
    const invalidFields = Object.assign({}, this.state.invalidFields);
    //in case, where user typed any wrong value,
    if (!valid) {
      invalidFields[event.target.name] = true;
    } else {
      //if it is correct initially or was corrected by user before submit
      delete invalidFields[event.target.name];
    }
    //this manage only that state, which exists before submit
    this.setState({ invalidFields });
  }
  //this works only without submit yet
  onChange(event, convertedValue){
    //clone state object to empty object 'issue' for the purpose of access to the 'name' properties of inputs
    const issue = Object.assign({}, this.state.issue);
    const value = (convertedValue !== undefined) ? convertedValue : event.target.value;
    //f.e.g: event.target.name = status, event.target.value = New or date:'some date in string format'; 
    //we use target's name as a key in the state object to set the value in the state object
   issue[event.target.name] = value;
    //change this.state object conserning to new status
    this.setState({ issue });

  }
  //the normal practice in react is creating our own submit function, and don't use default one
  onSubmit(event) {
    //because of 'submission' imply validation, which we have already done.
    //(and if we don't use preventDefault, we get 'Error in sending data to server' message in this case)
    event.preventDefault();
    this.showValidation(); //shows validation message if some error
    //this one enumerate all properties of this.state.invalidFields (including properties of prototype)
    if (Object.keys(this.state.invalidFields).length !== 0) {
      return;
    }
      fetch(`/api/issues/${this.props.params.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state.issue),
    }).then(response => {
      if (response.ok) {
        response.json().then(updatedIssue => {
          updatedIssue.created = new Date(updatedIssue.created);
          if (updatedIssue.completionDate) {
            updatedIssue.completionDate = new Date(updatedIssue.completionDate);
          }
          this.setState({ issue: updatedIssue });
          alert('Updated issue successfully.');
        });
      } else {
        response.json().then(error => {
          alert(`Failed to update issue: ${error.message}`);
        });
      }
    }).catch(err => {
      alert(`Error in sending data to server: ${err.message}`);
    });
  }
 
  loadData() {
    //this.props.params.id means the issue id
    fetch(`/api/issues/${this.props.params.id}`).then(response => {
      if(response.ok) {
        response.json().then(issue => {
          //convert date to string
          issue.created = new Date(issue.created);
          //if issue.comletionDate NOT equal null, convert given new Date object to string, else - leave it empty
          issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate) : null;
          //change this.state accordingly converted data
          this.setState({ issue });
        });
      } else {
        response.json().then(error => {
          alert(`Failed to fetch issue: ${error.message}`);
        });
      }
    }).catch(err => {
      alert(`Error in fetching data from server: ${err.message}`);
    });
  }
   showValidation() {
    this.setState({ showingValidation: true });
  }
  dismissValidation() {
    this.setState({ showingValidation: false });
  }
  render() {
    const issue = this.state.issue;
    let validationMessage  = null; 
    if (Object.keys(this.state.invalidFields).length !== 0 && this.state.showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please, correct invalid fields before submitting.
        </Alert>
      );
    }
    return (
      <Panel header="Edit Issue">
        <Form horizontal onSubmit={this.onSubmit}>
          {/*horizontal helps us to set up pretty view of lines in this table*/}
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}> ID: </Col>
          <Col sm={9}>
            <FormControl.Static> {issue._id}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          {/*we use ControlLabel as a componentClass of Col tag, because of we whish to combine Col and ControlLabel in one tag
          and if it will be just simply put together (which is normally for others tags) we'll lose indentation*/}
          <Col componentClass={ ControlLabel } sm={3}> Created: </Col>
          <Col sm={9}>
            {/*we  use .Static for the sake of clarity, that the element is unchangeable*/}
            <FormControl.Static> {issue.created ? issue.created.toDateString() : ''}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ ControlLabel } sm={3}> Status: </Col>
          <Col sm={9}>
            <FormControl componentClass="select" name="status" value={issue.status} onChange={this.onChange}>
              <option value="New">New</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Verified">Verified</option>
              <option value="Closed">Closed</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ ControlLabel } sm={3}> Owner: </Col>
          <Col sm={9}>
            <FormControl name="owner" value={issue.owner} onChange={this.onChange}/>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ ControlLabel } sm={3}> Effort:</Col>
          <Col sm={9}>
            <FormControl componentClass={NumInput} name="effort" value={issue.effort} onChange={this.onChange}/>
          </Col>
        </FormGroup>
      {/*validationState is an instrument of react-bootstrap. variants of values of validateState are these:
      error, succes, warning. in our case it'll be 'error' or 'null'*/}
        <FormGroup validationState={this.state.invalidFields.completionDate ? 'error' : null}>
          <Col componentClass={ ControlLabel } sm={3}> Completion Date:</Col>
          <Col sm={9}>
            <FormControl componentClass={DateInput} name="completionDate" value={issue.completionDate} 
            onChange={this.onChange} onValidityChange={this.onValidityChange} />
          {/*Feetback means the icon in the line if validation isn't passed*/}
            <FormControl.Feedback />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ ControlLabel } sm={3}> Title:</Col>
          <Col sm={9}>
            <FormControl name="title" value={issue.title} onChange={this.onChange}/>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col smOffset={3} sm={6}> 
            <ButtonToolbar>
              <Button bsStyle="primary" type="submit">Submit</Button>
              <LinkContainer to="/issues"> 
                <Button bsStyle="link" type="submit">Back</Button>
              </LinkContainer>
            </ButtonToolbar>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col smOffset={3} sm={6}>{validationMessage}</Col>
        </FormGroup>
        </Form>
        {/*every input, including 'select', has 'name' property for differetiate one from one for onChange
          function, which is common method for all of the inputs*/}
        {/*'this' helps us identify a target of event in onChange() function*/}
      {/*LinkContainer allows styling button as a link and send user to issues page*/}
      </Panel>
       
    );
  }
}
IssueEdit.propTypes = {
  params: PropTypes.object.isRequired,
};

