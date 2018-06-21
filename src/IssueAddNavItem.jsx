import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap';
import Toast from './Toast.jsx';
//we don't use 'export default class' because of we use whthRouter function instead. It means, that we wrap this whole
//component before exporting, not after as it is in App.jsx with IssueList. thus we encapsulate usage of router within this component
class IssueAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      toastVisible: false, toastMessage: '', toastType:  'success',
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.submit = this.submit.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }
  showModal() {
    this.setState({ showing: true });
  }
  hideModal() {
    this.setState({ showing: false });
  }
  showError() {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger'});
  }
  dismissToast() {
    this.setState({ toastVisible: false });
  }
  submit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.issueAdd;
    const newIssue = {
      owner: form.owner.value, title: form.title.value, status: 'New', created: new Date(),
    };
    fetch('api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue),
    }).then(response => {
      if (response.ok) {
        response.json().then(updatedIssue => {
          this.props.router.push(`/issues/${updatedIssue._id}`);
        });
      }
    }).catch(err => {
      this.showError(`Error in sending data to server: ${err.message}`);
    });
  }
  render() {
    return(
      <NavItem onClick={this.showModal}><Glyphicon glyph="plus"/>Create Issue
        <Modal keyboard show={this.state.showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="issueAdd">
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Owner</ControlLabel>
                <FormControl name="owner" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button type="button" bsStyle="primary" onClick={this.submit}>Submit</Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </NavItem>
    );
  }
}
IssueAddNavItem.propTypes = {
  router: PropTypes.object,
}
export default withRouter(IssueAddNavItem);