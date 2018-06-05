import 'babel-polyfill';
import React from 'react';
import { Router, Route, Redirect, browserHistory, withRouter } from 'react-router';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';

const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not found</p>;

const App = (props) => (
  <div>
    <div className="header">
      <h1>Issue Tracker</h1>
    </div>
    <div className="contents">
      {props.children}
    </div>
    <div className="footer">
      <a href="https://github.com/ShmidtAlex/MERN_book"> GitHub repository of Author </a>
    </div>
  </div>
);
App.propTypes = {
  children: PropTypes.object.isRequired,
}
const RoutedApp = () => (
  <Router history={browserHistory}>
    <Redirect from="/" to="/issues"/>
    <Route path='/' component={App}>
      <Route path='/issues' component={withRouter(IssueList)} />
      <Route path='/issues/:id' component={IssueEdit} />
      <Route path='*' component={NoMatch}/>
    </Route>
  </Router>
);
// some changes on client

ReactDOM.render(<RoutedApp />, contentNode);
// Render the component inside the content Node

if (module.hot) {
  module.hot.accept();
}
