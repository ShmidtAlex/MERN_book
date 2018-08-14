import 'babel-polyfill';
import React from 'react';

import PropTypes from 'prop-types';

//import IssueAddNavItem from './IssueAddNavItem.jsx';
//import WithToast from './withToast.jsx';
import Header from './Header.jsx';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { signedIn: false, name: ''},
    };
    this.onSignin = this.onSignin.bind(this);
    this.onSignout = this.onSignout.bind(this);
  }
  onSignin(name) {
    this.setState({ user: { signedIn: true, name } });
  }
  onSignout() {
    this.setState({ user: { signedIn: false, name: ''} });
  }
  render() {
    return (
      <div>
        <Header user={this.state.user} onSignin={this.onSignin} onSignout={this.onSignout}/>
        <div className="container-fluid">
          {this.props.children}
        {/*props.children consists history, location, params, route's path, routes*/}
          <hr />
          <h5><small>
            Full source code available at this <a href="https://github.com/vasansr/pro-mern-stack">
            GitHub repository</a>.
          </small></h5>
        </div>
      </div>
    );
  }
} 

App.propTypes = {
  children: PropTypes.object.isRequired,
};

