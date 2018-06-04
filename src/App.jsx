import 'babel-polyfill';
import React from 'react';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';

const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not found</p>;
const RoutedApp = () => (
  <Router history={hashHistory}>
    <Redirect from="/" to="/issues"/>
    <Route path='/issues' component={IssueList} />
    <Route path='/issues/:id' component={IssueEdit} />
  </Router>
);
// some changes on client

ReactDOM.render(<RoutedApp />, contentNode);
// Render the component inside the content Node

if (module.hot) {
  module.hot.accept;
}
