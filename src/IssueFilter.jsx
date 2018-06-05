
import React from 'react';
//import { a  } from 'react-router';

export default class IssueFilter extends React.Component {
  constructor() {
    super();
    this.clearFilter = this.clearFilter.bind(this);
    this.setFilterOpen = this.setFilterOpen.bind(this);
    this.setFilterAssigned = this.setFilterAssigned.bind(this);
    this.setFilterNew = this.setFilterNew.bind(this);
  }
  clearFilter(e) {
    e.preventDefault();
    this.props.setFilter({});
  }
  setFilterOpen(e) {
    e.preventDefault();
    this.props.setFilter({ status: 'Open' });
  }
  setFilterAssigned(e) {
    e.preventDefault();
    this.props.setFilter({ status: 'Assigned' });
  }
  setFilterNew(e) {
    e.preventDefault();
    this.props.setFilter({ status: 'New' });
  }
  render() {
  	const Separator = () => <span> | </span>;
    return (
      <div>
        <a href='#' onClick={ this.clearFilter }>All issues</a >
        <Separator/>
        <a href='#' onClick={ this.setFilterOpen }>Open Issues</a >
        <Separator/>
        <a href='#' onClick={ this.setFilterAssigned }>Assigned Issues</a >
        <Separator/>
        <a href='#' onClick={ this.setFilterNew }>New Issues</a >
      </div>
    );
  }
}
// default
