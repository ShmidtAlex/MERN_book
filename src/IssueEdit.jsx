import React from 'react';
import { Link } from 'react-router';
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
        completionDate: null, created: '',
      },
      invalildFields: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
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
    const invalildFields = Object.assign({}, this.state.invalildFields);
    //in case, where user typed any wrong value,
    if (!valid) {
      invalildFields[event.target.name] = true;
      console.log(event.target);
    } else {
      delete invalildFields[event.target.name];
    }
    this.setState({ invalildFields });
  }
  //this works only without submit yet
  onChange(event, convertedValue){
    //clone state object to empty object 'issue' for the purpose of access to the 'name' properties of inputs
    const issue = Object.assign({}, this.state.issue);
    const value = (convertedValue !== undefined ? convertedValue : event.target.value);
    //f.e.g: event.target.name = status, event.target.value = New or date:'some date in string format'; 
    //we use target's name as a key in the state object to set the value in the state object
   issue[event.target.name] = value;
    //change this.state object conserning to new status
    this.setState({ issue });

  }
  loadData() {
    //this.props.params.id means the issue id
    fetch(`/api/issues/${this.props.params.id}`).then(response => {
      if(response.ok) {
        response.json().then(issue => {
          //convert date to string
          issue.created = new Date(issue.created).toDateString();
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
  render() {
    const issue = this.state.issue;
    const validationMessage = Object.keys(this.state.invalildFields).length === 0 ? null : (<div className="error"
    >Please correct invalid fields before submitting.</div>);
    return (
      <div>
        <form>
          ID: {issue._id}
          <br/>
          Created: {issue.created}
          <br/>
        {/*every input, including 'select', has 'name' property for differetiate one from one for onChange
          function, which is common method for all of the inputs*/}
          Status: <select name='status' value={issue.status} onChange={this.onChange}>
            <option value="New">New</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="Fixed">Fixed</option>
            <option value="Verified">Verified</option>
            <option value="Closed">Closed</option>
          </select>
          <br/>
        {/*'this' helps us identify a target of event in onChange() function*/}
          Owner: <input name="owner" value={issue.owner} onChange={this.onChange}/>
          <br/>
          Effort: <NumInput size={5} name="effort" value={issue.effort} onChange={this.onChange}/>
          <br/>
          Completion Date: <DateInput name="completionDate" value={issue.completionDate} onChange={this.onChange}
          onValidityChange={this.onValidityChange}/>
          <br/>
          Title: <input name="title" size={50} value={issue.title} onChange={this.onChange}/>
          <br/>
          {validationMessage}
          <button type="submit">Submit</button>
          <Link to="/issues">Back to issue list</Link>
        </form>
      </div>
    );
  }
}
IssueEdit.propTypes = {
  params: PropTypes.object.isRequired,
};

