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
    this.onSingin = this.onSingin.bind(this);
    this.onSingout = this.onSingout.bind(this);
    onSingin(name) {
      this.setState({ user: { signedIn: true, name } });
    }
    render() {
      return (
        <div>
          <Header />
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
    }
    
  }
} 

App.propTypes = {
  children: PropTypes.object.isRequired,
};

