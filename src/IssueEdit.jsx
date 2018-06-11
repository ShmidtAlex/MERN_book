import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

export default class IssueEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      issue: {
        //these are the properties of issue object and names for each inputs both
        _id:'', title: '', status: '', owner: '', effort: '', 
        completionDate: '', created: '',
      },
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id){
      this.loadData();
    }
  }
  //this works only without submit yet
  onChange(event){
    //clone state object to empty object 'issue' for the purpose of access to the 'name' properties of inputs
    const issue = Object.assign({}, this.state.issue);
    //f.e.g: event.target.name = status, event.target.value = New; 
    //we use target's name as a key in the state object to set the value in the state object
    issue[event.target.name] = event.target.value;
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
          issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate).toDateString() : '';
          issue.effort = issue.effort != null ? issue.effort.toString() : '';
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
          Effort: <input name="effort" value={issue.effort} onChange={this.onChange}/>
          <br/>
          Completion Date: <input name="completionDate" value={issue.completionDate} onChange={this.onChange}/>
          <br/>
          Title: <input name="title" size={50} value={issue.title} onChange={this.onChange}/>
          <br/>
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

