"use strict";
import React from 'react';

export default class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var form = document.forms.issueAdd;
    this.props.createIssue({
      owner: form.owner.value,
      title: form.title.value,
      effort: form.effort.value,
      status: 'New',
      created: new Date(),
    });
    // clear the form for the next input
    form.owner.value = ""; form.title.value = "";
  }

  render() {
    return (
      <div>
        <form name="issueAdd" onSubmit={this.handleSubmit}>
          <input type="text" name="owner" placeholder="Owner" />
          <input type="text" name="title" placeholder="Title" />
          <input type="text" name="effort" placeholder="Effort" />
          <input type="text" name="completionDate" placeholder="CompletionDate" />

          <button>Add</button>
        </form>
      </div>
    )
  }
}
