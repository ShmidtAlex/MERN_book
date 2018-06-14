
import React from 'react';
import PropTypes from 'prop-types';

export default class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  //we can use parent's createIssue because of we gave it to children component in render section of IssueList component
  handleSubmit(e) {
    const form = document.forms.issueAdd;
    e.preventDefault();
    this.props.createIssue({//it's a callback now
      owner: form.owner.value,
      title: form.title.value,
      effort: Number(form.effort.value),
      status: 'New',
      created: new Date(),
      completionDate: new Date(form.completionDate.value),
    });
    // clear the form for the next input
    form.owner.value = ''; form.title.value = ''; form.completionDate.value = ''; form.effort.value = '';
  }

  render() {
    return (
      <div>
        <form name="issueAdd" onSubmit={this.handleSubmit}>
          <input type="text" name="owner" placeholder="Owner" />
          <input type="text" name="title" placeholder="Title" />
          <input type="text" name="effort" placeholder="Effort" />
          <input type="text" name="completionDate" placeholder="Completion Date" />
          <button>Add</button>
        </form>
      </div>
    );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};
