
import React from 'react';
import 'isomorphic-fetch';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button, Glyphicon, Table, Panel, Pagination } from 'react-bootstrap';

import IssueFilter from './IssueFilter.jsx';
import WithToast from './withToast.jsx';
//import IssueAddNavItem from './IssueAddNavItem.jsx';
/*temporary constant for constrains number of issues on one page
in future it'll be a variable, setted by user */

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
const PAGE_SIZE = 10;
class IssueList extends React.Component {
  static dataFetcher({ urlBase, location }) {
    const query = Object.assign({}, location.query);
    const pageStr = query._page;
    if (pageStr) {
      delete query._page;
      query._offset = (parseInt(pageStr, 10) -1) * PAGE_SIZE;
    }
    query._limit = PAGE_SIZE;
    const search = Object.keys(query).map(k => `${k}=${query[k]}`).join('&');
    return fetch(`${urlBase || ''}/api/issues?${search}`).then(response => {
      if(!response.ok) return response.json().then(error => Promise.reject(error));
      return  response.json().then(data => ({ IssueList: data}));
    });
  }
  constructor(props, context) {
    //context = initialState of IssueList, props = location, history etc
    super(props, context);
    const data = context.initialState.IssueList ? context.initialState.IssueList : { metadata: {totalCount:0}, records: [] };
    const issues = data.records;
    issues.forEach(issue => {
      issue.created = new Date(issue.created);
      if (issue.completionDate) {
        issue.completionDate = new Date(issue.completionDate);
      }
    });
    this.state = { 
      issues,
      totalCount: data.metadata.totalCount,
    };
    this.setFilter = this.setFilter.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.selectPage = this.selectPage.bind(this);
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
        oldQuery.effort_lte === newQuery.effort_lte &&
        oldQuery._page === newQuery._page) {
      return;
    }
    this.loadData();
  }
  selectPage(eventKey) {
    const query = Object.assign(this.props.location.query, {_page: eventKey });
    this.props.router.push({ pathname: this.props.location.pathname, query });
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
      this.setState({ issues, totalCount: data.IssueList.metadata.totalCount });

    }).catch(err => {
      this.props.showError('Error in fetching data from server:', err);
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
        this.props.showError('Failed to delete issue');
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
        <Pagination items={Math.ceil(this.state.totalCount / PAGE_SIZE) } activePage={parseInt(this.props.location.query._page || '1', 10)} onSelect={this.selectPage} maxButtons={7} next prev boundaryLinks />
        <hr />
        <IssueTable issues={this.state.issues} deleteIssue={this.deleteIssue} />
        <hr />
      </div>
    );
  }
}
IssueList.propTypes = {
  location: PropTypes.object.isRequired,
  router: PropTypes.object,
  showError: PropTypes.func.isRequired,
}
IssueList.contextTypes = {
  initialState: PropTypes.object,
}

const IssueListWithToast = WithToast(IssueList);
IssueListWithToast.dataFetcher = IssueList.dataFetcher;

export default IssueListWithToast;