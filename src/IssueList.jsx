
import React from 'react';
import 'whatwg-fetch';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import IssueAdd from './IssueAdd.jsx';
import IssueFilter from './IssueFilter.jsx';


const IssueRow = props => (
  <tr>
    <td>
      <Link to={`/issues/${props.issue._id}`}>
        { props.issue._id.substr(-4) }
      </Link>
    </td>
    <td>{props.issue.status}</td>
    <td>{props.issue.owner}</td>
    <td>{props.issue.created.toDateString()}</td>
    <td>{props.issue.effort}</td>
    <td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : ''}</td>
    <td>{props.issue.title}</td>
  </tr>
);
IssueRow.propTypes = {
  issue: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
function IssueTable(props) {
  const issueRows = props.issues.map(issue => <IssueRow key={issue._id} issue={issue} />);
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  );
}
IssueTable.propTypes = {
  issues: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  //this function look for any changes in filter fields and invoked immediately after updating occurs
  componentDidUpdate(prevProps) {//prevProps means state of props before changing
    const oldQuery = prevProps.location.query;//location - URL address of prevProps
    const newQuery = this.props.location.query;
    //if comparing show no changes, return prevProps as it was
    if (oldQuery.status === newQuery.status &&
        oldQuery.effort_gte === newQuery.effort_gte &&
        oldQuery.effort_lte === newQuery.effort_lte) {
      return;
    }
    this.loadData();
  }
  loadData() {
    //this.props.location.search = ?effort_gte=some_number&status(filter value in unparsed URL)
    fetch(`/api/issues${this.props.location.search}`).then(response => {
      if (response.ok) {// ok = true and means, that response was successful
        response.json().then((data) => {
          //data is a variable, which get data from server, _metadata is an object of that data
          console.log('Total count of records:', data._metadata.total_count);//total count is a property of metadata
          data.records.forEach((issue) => {//records is a property which keeps issues = [{...}] inside it
            issue.created = new Date(issue.created);//assign date of creation issue
            if (issue.completionDate) { // if user appointed date to complete issue
              issue.completionDate = new Date(issue.completionDate);//take this and put in object Date()
            }
          });
          this.setState({ issues: data.records });//then change the state issues:[] to real issues data
        });
      } else {
        response.json().then((error) => {
          alert(`Failed to fetch issues:${error.message}`);
        });
      }
    }).catch((err) => {
      alert('Error in fetching data from server:', err);
    });
  }
  //this method calls from the IssueFilter component
  setFilter(query){//takes 'query' which is an object f.e.g.{ status: 'Open', effort_gte: '10', effort_lte: '11'} according to filter settings
    //and push it to browser URL as a query string looks like ?effort_gte=10&effort_lte=11&status=Open
    this.props.router.push({ pathname: this.props.location.pathname, query });
  }
  //this method calls from the IssueAdd component
  createIssue(newIssue) {
    //send new issue data to server instead of posting it directly on the client
    fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue),
    }).then((response) => {
      if (response.ok) {
        // response.text().then(r => console.log(r));
        response.json().then((updatedIssue) => {
          updatedIssue.created = new Date(updatedIssue.created);
          if (updatedIssue.completionDate) {
            updatedIssue.completionDate = new Date(updatedIssue.completionDate);
          }
          const newIssues = this.state.issues.concat(updatedIssue);
          this.setState({ issues: newIssues });
        });
      } else {
        response.json().then((error) => {
          alert(`Failed to add issue: ${error.message}`);
        });
      }
    }).catch((err) => {
      alert(`Error in sending data to server: ${err.message}`);
    });
  }

  render() {
    return (
      <div>
        <IssueFilter setFilter={this.setFilter} initFilter={this.props.location.query} />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </div>
    );
  }
}
IssueList.propTypes = {
  location: PropTypes.object.isRequired,
  router: PropTypes.object,
}
