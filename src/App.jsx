import 'babel-polyfill';
import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';

import IssueAddNavItem from './IssueAddNavItem.jsx';
import WithToast from './withToast.jsx';

const Header = (props) => (
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
      <IssueAddNavItem showError={props.showError}/> 
      <NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-horizontal" />} noCaret>
        <MenuItem>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
);

const App = (props) => (
  <div>
    <HeaderWithToast />
    <div className="container-fluid">
      {props.children}
    {/*props.children consists history, location, params, route's path, routes*/}
      <hr />
      <h5><small>
        Full source code available at this <a href="https://github.com/vasansr/pro-mern-stack">
        GitHub repository</a>.
      </small></h5>
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.object.isRequired,
};
Header.propTypes = {
  showError: React.PropTypes.func.isRequired,
};
const HeaderWithToast = WithToast(Header);

export default App;