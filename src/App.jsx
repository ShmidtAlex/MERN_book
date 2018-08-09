import 'babel-polyfill';
import React from 'react';

import PropTypes from 'prop-types';

//import IssueAddNavItem from './IssueAddNavItem.jsx';
//import WithToast from './withToast.jsx';
import Header from './Header.jsx';


const App = (props) => (
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

App.propTypes = {
  children: PropTypes.object.isRequired,
};

export default App;