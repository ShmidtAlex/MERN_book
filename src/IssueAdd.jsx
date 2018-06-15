
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, Button, FormGroup } from 'react-bootstrap';

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
      <div >
        <Form inline name="issueAdd" onSubmit={this.handleSubmit}>
          <FormGroup bsSize="small">
            <FormControl name="owner" placeholder="Owner" />{' '}
            <FormControl name="title" placeholder="Title" />{' '}
            <FormControl name="effort" placeholder="Effort" />{' '}
            <FormControl name="completionDate" placeholder="Completion Date" />{' '}
          </FormGroup>{' '}
          <Button bsSize="small">Add</Button>
        </Form>
      </div>
    );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};
