import 'babel-polyfill';
import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';

const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not found</p>;
const RoutedApp = () => (
  <Router >
    <Switch  >
      <Route exact path='/' component={IssueList} />
      <Route path='/issueEdit' component={IssueEdit} />
      <Route path='*' component={NoMatch} />
    </Switch>
  </Router>
);
// some changes on client

ReactDOM.render(<RoutedApp />, contentNode);
// Render the component inside the content Node

if (module.hot) {
  module.hot.accept;
}
