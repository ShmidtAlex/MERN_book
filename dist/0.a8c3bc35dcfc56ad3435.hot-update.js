exports.id = 0;
exports.modules = {

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouterBootstrap = __webpack_require__(18);
	
	var _reactBootstrap = __webpack_require__(17);
	
	var _propTypes = __webpack_require__(20);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _NumInput = __webpack_require__(26);
	
	var _NumInput2 = _interopRequireDefault(_NumInput);
	
	var _DateInput = __webpack_require__(27);
	
	var _DateInput2 = _interopRequireDefault(_DateInput);
	
	var _Toast = __webpack_require__(21);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var IssueEdit = function (_React$Component) {
	  _inherits(IssueEdit, _React$Component);
	
	  _createClass(IssueEdit, null, [{
	    key: 'dataFetcher',
	    value: function dataFetcher(_ref) {
	      var params = _ref.params,
	          urlBase = _ref.urlBase;
	
	      return fetch(((urlBase || '') + '/api/issues/' + params.id).then(function (response) {
	        if (!response.ok) {
	          return response.json().then(function (error) {
	            return Propmise.reject(error);
	          });
	        }
	        return response.json().then(function (data) {
	          return { IssueEdit: data };
	        });
	      }));
	    }
	  }]);
	
	  function IssueEdit(props, context) {
	    _classCallCheck(this, IssueEdit);
	
	    var _this = _possibleConstructorReturn(this, (IssueEdit.__proto__ || Object.getPrototypeOf(IssueEdit)).call(this, props, context));
	
	    var issue = void 0;
	    if (context.initialState.IssueEdit) {
	      issue = context.initialState.IssueEdit;
	      issue.created = new Date(issue.created);
	      issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate) : null;
	    } else {
	      issue = {
	        _id: '', title: '', status: '', owner: '', effort: null, completionDate: null,
	        created: null
	      };
	    }
	    _this.state = {
	      issue: issue,
	      invalidFields: {}, showingValidation: false,
	      toastVisible: false, toastMessage: '', toastType: 'success'
	    };
	    _this.onChange = _this.onChange.bind(_this);
	    _this.onValidityChange = _this.onValidityChange.bind(_this);
	    _this.onSubmit = _this.onSubmit.bind(_this);
	    _this.dismissValidation = _this.dismissValidation.bind(_this);
	    _this.showValidation = _this.showValidation.bind(_this);
	    _this.showSuccess = _this.showSuccess.bind(_this);
	    _this.showError = _this.showError.bind(_this);
	    _this.dismissToast = _this.dismissToast.bind(_this);
	    return _this;
	  }
	
	  _createClass(IssueEdit, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.loadData();
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      if (prevProps.params.id !== this.props.params.id) {
	        this.loadData();
	      }
	    }
	    //we got 'valid' argument from child component
	
	  }, {
	    key: 'onValidityChange',
	    value: function onValidityChange(event, valid) {
	      var invalidFields = Object.assign({}, this.state.invalidFields);
	      //in case, where user typed any wrong value,
	      if (!valid) {
	        invalidFields[event.target.name] = true;
	      } else {
	        //if it is correct initially or was corrected by user before submit
	        delete invalidFields[event.target.name];
	      }
	      //this manage only that state, which exists before submit
	      this.setState({ invalidFields: invalidFields });
	    }
	    //this works only without submit yet
	
	  }, {
	    key: 'onChange',
	    value: function onChange(event, convertedValue) {
	      //clone state object to empty object 'issue' for the purpose of access to the 'name' properties of inputs
	      var issue = Object.assign({}, this.state.issue);
	      var value = convertedValue !== undefined ? convertedValue : event.target.value;
	      //f.e.g: event.target.name = status, event.target.value = New or date:'some date in string format'; 
	      //we use target's name as a key in the state object to set the value in the state object
	      issue[event.target.name] = value;
	      //change this.state object conserning to new status
	      this.setState({ issue: issue });
	    }
	    //the normal practice in react is creating our own submit function, and don't use default one
	
	  }, {
	    key: 'onSubmit',
	    value: function onSubmit(event) {
	      var _this2 = this;
	
	      //because of 'submission' imply validation, which we have already done.
	      //(and if we don't use preventDefault, we get 'Error in sending data to server' message in this case)
	      event.preventDefault();
	      this.showValidation(); //shows validation message if some error
	      //this one enumerate all properties of this.state.invalidFields (including properties of prototype)
	      if (Object.keys(this.state.invalidFields).length !== 0) {
	        return;
	      }
	      fetch('/api/issues/' + this.props.params.id, {
	        method: 'PUT',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(this.state.issue)
	      }).then(function (response) {
	        if (response.ok) {
	          response.json().then(function (updatedIssue) {
	            updatedIssue.created = new Date(updatedIssue.created);
	            if (updatedIssue.completionDate) {
	              updatedIssue.completionDate = new Date(updatedIssue.completionDate);
	            }
	            _this2.setState({ issue: updatedIssue });
	            _this2.showSuccess('Updated issue successfully.');
	          });
	        } else {
	          response.json().then(function (error) {
	            _this2.showError('Failed to update issue: ' + error.message);
	          });
	        }
	      }).catch(function (err) {
	        _this2.showError('Error in sending data to server: ' + err.message);
	      });
	    }
	  }, {
	    key: 'loadData',
	    value: function loadData() {
	      var _this3 = this;
	
	      //this.props.params.id means the issue id
	      IssueEdit.dataFetcher({ paraps: this.props.params }).then(function (data) {
	        var issue = data.IssueEdit;
	        issue.created = new Date(issue.created);
	        issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate) : null;
	        _this3.setState({ issue: issue });
	      }).catch(function (err) {
	        _this3.showError('Error in fetching data from server: ' + err.message);
	      });
	    }
	  }, {
	    key: 'showValidation',
	    value: function showValidation() {
	      this.setState({ showingValidation: true });
	    }
	  }, {
	    key: 'dismissValidation',
	    value: function dismissValidation() {
	      this.setState({ showingValidation: false });
	    }
	  }, {
	    key: 'showSuccess',
	    value: function showSuccess(message) {
	      this.setState({ toastVisible: true, toastMessage: message, toastType: 'success' });
	    }
	  }, {
	    key: 'showError',
	    value: function showError(message) {
	      this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	    }
	  }, {
	    key: 'dismissToast',
	    value: function dismissToast() {
	      this.setState({ toastVisible: false });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var issue = this.state.issue;
	      var validationMessage = null;
	      if (Object.keys(this.state.invalidFields).length !== 0 && this.state.showingValidation) {
	        validationMessage = _react2.default.createElement(
	          _reactBootstrap.Alert,
	          { bsStyle: 'danger', onDismiss: this.dismissValidation },
	          'Please, correct invalid fields before submitting.'
	        );
	      }
	      return _react2.default.createElement(
	        _reactBootstrap.Panel,
	        { header: 'Edit Issue' },
	        _react2.default.createElement(
	          _reactBootstrap.Form,
	          { horizontal: true, onSubmit: this.onSubmit },
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	              ' ID: '
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { sm: 9 },
	              _react2.default.createElement(
	                _reactBootstrap.FormControl.Static,
	                null,
	                ' ',
	                issue._id
	              )
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	              ' Created: '
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { sm: 9 },
	              _react2.default.createElement(
	                _reactBootstrap.FormControl.Static,
	                null,
	                ' ',
	                issue.created ? issue.created.toDateString() : ''
	              )
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	              ' Status: '
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { sm: 9 },
	              _react2.default.createElement(
	                _reactBootstrap.FormControl,
	                { componentClass: 'select', name: 'status', value: issue.status, onChange: this.onChange },
	                _react2.default.createElement(
	                  'option',
	                  { value: 'New' },
	                  'New'
	                ),
	                _react2.default.createElement(
	                  'option',
	                  { value: 'Open' },
	                  'Open'
	                ),
	                _react2.default.createElement(
	                  'option',
	                  { value: 'Assigned' },
	                  'Assigned'
	                ),
	                _react2.default.createElement(
	                  'option',
	                  { value: 'Fixed' },
	                  'Fixed'
	                ),
	                _react2.default.createElement(
	                  'option',
	                  { value: 'Verified' },
	                  'Verified'
	                ),
	                _react2.default.createElement(
	                  'option',
	                  { value: 'Closed' },
	                  'Closed'
	                )
	              )
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	              ' Owner: '
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { sm: 9 },
	              _react2.default.createElement(_reactBootstrap.FormControl, { name: 'owner', value: issue.owner, onChange: this.onChange })
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	              ' Effort:'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { sm: 9 },
	              _react2.default.createElement(_reactBootstrap.FormControl, { componentClass: _NumInput2.default, name: 'effort', value: issue.effort, onChange: this.onChange })
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            { validationState: this.state.invalidFields.completionDate ? 'error' : null },
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	              ' Completion Date:'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { sm: 9 },
	              _react2.default.createElement(_reactBootstrap.FormControl, { componentClass: _DateInput2.default, name: 'completionDate', value: issue.completionDate,
	                onChange: this.onChange, onValidityChange: this.onValidityChange }),
	              _react2.default.createElement(_reactBootstrap.FormControl.Feedback, null)
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { componentClass: _reactBootstrap.ControlLabel, sm: 3 },
	              ' Title:'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { sm: 9 },
	              _react2.default.createElement(_reactBootstrap.FormControl, { name: 'title', value: issue.title, onChange: this.onChange })
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { smOffset: 3, sm: 6 },
	              _react2.default.createElement(
	                _reactBootstrap.ButtonToolbar,
	                null,
	                _react2.default.createElement(
	                  _reactBootstrap.Button,
	                  { bsStyle: 'primary', type: 'submit' },
	                  'Submit'
	                ),
	                _react2.default.createElement(
	                  _reactRouterBootstrap.LinkContainer,
	                  { to: '/issues' },
	                  _react2.default.createElement(
	                    _reactBootstrap.Button,
	                    { bsStyle: 'link', type: 'submit' },
	                    'Back'
	                  )
	                )
	              )
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Col,
	              { smOffset: 3, sm: 6 },
	              validationMessage
	            )
	          )
	        ),
	        _react2.default.createElement(_Toast2.default, { showing: this.state.toastVisible, message: this.state.toastMessage, onDismiss: this.dismissToast,
	          bsStyle: this.state.toastType })
	      );
	    }
	  }]);
	
	  return IssueEdit;
	}(_react2.default.Component);
	
	exports.default = IssueEdit;
	
	IssueEdit.propTypes = {
	  params: _propTypes2.default.object.isRequired
	};
	IssueEdit.contextTypes = {
	  initialState: _propTypes2.default.object
	};

/***/ })

};
//# sourceMappingURL=0.a8c3bc35dcfc56ad3435.hot-update.js.map