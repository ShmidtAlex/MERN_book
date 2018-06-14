import 'babel-polyfill';
import React from 'react';
import { Router, Route, Redirect, browserHistory, withRouter } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';

const contentNode = document.getElementById('contents');
const NoMatch = () => <p>Page Not found</p>;
const Header = () => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>Issue Tracker</Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <LinkContainer to="/issues">
        <NavItem>Issues</NavItem>
      </LinkContainer>
      <LinkContainer to="/reports">
        <NavItem>Reports</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      <NavItem><Glyphicon glyph="plus" />Create Issue</NavItem>
      <NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-horizontal"/>} noCaret>
        <MenuItem>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
);
const App = (props) => (
  <div>
    <Header />
    <div className="container-fluid">
      {props.children}
      <h5>
        <small>
          <a href="https://github.com/ShmidtAlex/MERN_book"> GitHub repository of Author </a>
        </small>
      </h5>
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
