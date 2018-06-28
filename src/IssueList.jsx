
import React from 'react';
import 'isomorphic-fetch';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button, Glyphicon, Table, Panel } from 'react-bootstrap';

import IssueFilter from './IssueFilter.jsx';
import Toast from './Toast.jsx';
//import IssueAddNavItem from './IssueAddNavItem.jsx';

const IssueRow = (props) => {
  //console.log(props);
  function onDeleteClick() {
    props.deleteIssue(props.issue._id);
  }
  return(
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
      <td>
        <Button bsSize="xsmall" onClick={onDeleteClick}>
          <Glyphicon glyph="trash" />
        </Button>
      </td>
    </tr>
  );
};
IssueRow.propTypes = {
  issue: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  deleteIssue: PropTypes.func.isRequired,
};
function IssueTable(props) {
  //here props mean the array of issues
  const issueRows = props.issues.map(issue => <IssueRow key={issue._id} issue={issue} deleteIssue={props.deleteIssue} />);
  return (
    <Table bordered condensed responsive hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </Table>
  );
}
IssueTable.propTypes = {
  issues: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  deleteIssue: PropTypes.func.isRequired,
};

export default class IssueList extends React.Component {
  static dataFetcher({ urlBase, location }) {
    return fetch(`${urlBase || ''}/api/issues${location.search}`).then(response => {
      if(!response.ok) return response.json().then(error => Promise.reject(error));
      return  response.json().then(data => ({ IssueList: data}));
    });
  }
  constructor(props, context) {
    //context = initialState of IssueList, props = location, history etc
    super(props, context);
    const issues = context.initialState.IssueList ? context.initialState.IssueList.records : [];
    issues.forEach(issue => {
      issue.created = new Date(issue.created);
      if (issue.completionDate) {
        issue.completionDate = new Date(issue.completionDate);
      }
    });
    this.state = { 
      issues,
      toastVisible: false, toastMessage: '', toastType: 'success',
    };
    this.setFilter = this.setFilter.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
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
  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
  }
  dismissToast() {
    this.setState({ toastVisible: false });
  }
  loadData() {
    //this.props.location.search = ?effort_gte=some_number&status(filter value in unparsed URL)
    IssueList.dataFetcher({ location: this.props.location })
    .then(data => {
      const issues = data.IssueList.records;
      issues.forEach(issue => {
        issue.created = new Date(issue.created);
        if (issue.completionDate) {
          issue.completionDate = new Date(issue.completionDate);
        }
      });
      this.setState({ issues });
    }).catch(err => {
      this.showError('Error in fetching data from server:', err);
    });
  }
  //this method calls from the IssueFilter component
  setFilter(query){//takes 'query' which is an object f.e.g.{ status: 'Open', effort_gte: '10', effort_lte: '11'} according to filter settings
    //and push it to browser URL as a query string looks like ?effort_gte=10&effort_lte=11&status=Open
    this.props.router.push({ pathname: this.props.location.pathname, query });
  }
  //this method calls from the IssueAdd component
  
  deleteIssue(id) {
    fetch(`/api/issues/${id}`, {method: 'DELETE'}).then(response => {
      if (!response.ok) {
        this.showError('Failed to delete issue');
      } else {
        this.loadData();
      }
    })
  }
  render() {
    return (
      <div>
        <Panel collapsible header="Filter">
          <IssueFilter setFilter={this.setFilter} initFilter={this.props.location.query} />
        </Panel>
        <hr />
        <IssueTable issues={this.state.issues} deleteIssue={this.deleteIssue} />
        <hr />
        <Toast showing={this.state.toastVisible} message={this.state.toastMessage} onDismiss={this.dismissToast} 
        bsStyle={this.state.toastType}/>
      </div>
    );
  }
}
IssueList.propTypes = {
  location: PropTypes.object.isRequired,
  router: PropTypes.object,
}
IssueList.contextTypes = {
  initialState: PropTypes.object,
}
