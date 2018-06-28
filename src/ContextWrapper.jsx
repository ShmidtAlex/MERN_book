import React from 'react';
import PropTypes from 'prop-types';

export default class ContextWrapper extends React.Component {
  getChildContext() {
    {/*this.props.initialState consist the array of all issues (Mongo documents)*/}
    return { initialState: this.props.initialState };
  }
  render() {
    return this.props.children;
  }
}
ContextWrapper.childContextTypes = {
  initialState: PropTypes.object,
}
ContextWrapper.propTypes = {
  children: PropTypes.object.isRequired,
  initialState: PropTypes.object,
}