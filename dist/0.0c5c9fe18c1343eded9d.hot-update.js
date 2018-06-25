exports.id = 0;
exports.modules = {

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(13);
	
	var _App = __webpack_require__(16);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _IssueList = __webpack_require__(22);
	
	var _IssueList2 = _interopRequireDefault(_IssueList);
	
	var _IssueEdit = __webpack_require__(25);
	
	var _IssueEdit2 = _interopRequireDefault(_IssueEdit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NoMatch = function NoMatch() {
	  return _react2.default.createElement(
	    'p',
	    null,
	    'Page Not Found'
	  );
	};
	
	exports.default = _react2.default.createElement(
	  _reactRouter.Route,
	  { path: '/', component: _App2.default },
	  _react2.default.createElement(_reactRouter.IndexRedirect, { to: '/issues' }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues', component: (0, _reactRouter.withRouter)(_IssueList2.default) }),
	  _react2.default.createElement(_reactRouter.Route, { path: 'issues/:id', component: _IssueEdit2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '*', component: NoMatch })
	);

/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(31);
	
	var _propTypes = __webpack_require__(20);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _reactRouter = __webpack_require__(13);
	
	var _reactBootstrap = __webpack_require__(17);
	
	var _IssueFilter = __webpack_require__(24);
	
	var _IssueFilter2 = _interopRequireDefault(_IssueFilter);
	
	var _Toast = __webpack_require__(21);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	var _IssueAddNavItem = __webpack_require__(19);
	
	var _IssueAddNavItem2 = _interopRequireDefault(_IssueAddNavItem);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var IssueRow = function IssueRow(props) {
	  function onDeleteClick() {
	    props.deleteIssue(props.issue._id);
	  }
	  return _react2.default.createElement(
	    'tr',
	    null,
	    _react2.default.createElement(
	      'td',
	      null,
	      _react2.default.createElement(
	        _reactRouter.Link,
	        { to: '/issues/' + props.issue._id },
	        props.issue._id.substr(-4)
	      )
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.status
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.owner
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.created.toDateString()
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.effort
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.completionDate ? props.issue.completionDate.toDateString() : ''
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      props.issue.title
	    ),
	    _react2.default.createElement(
	      'td',
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Button,
	        { bsSize: 'xsmall', onClick: onDeleteClick },
	        _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'trash' })
	      )
	    )
	  );
	};
	IssueRow.propTypes = {
	  issue: _propTypes2.default.object.isRequired, // eslint-disable-line react/forbid-prop-types
	  deleteIssue: _propTypes2.default.func.isRequired
	};
	function IssueTable(props) {
	  var issueRows = props.issues.map(function (issue) {
	    return _react2.default.createElement(IssueRow, { key: issue._id, issue: issue, deleteIssue: props.deleteIssue });
	  });
	  return _react2.default.createElement(
	    _reactBootstrap.Table,
	    { bordered: true, condensed: true, responsive: true, hover: true },
	    _react2.default.createElement(
	      'thead',
	      null,
	      _react2.default.createElement(
	        'tr',
	        null,
	        _react2.default.createElement(
	          'th',
	          null,
	          'Id'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Status'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Owner'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Created'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Effort'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Completion Date'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Title'
	        ),
	        _react2.default.createElement(
	          'th',
	          null,
	          'Action'
	        )
	      )
	    ),
	    _react2.default.createElement(
	      'tbody',
	      null,
	      issueRows
	    )
	  );
	}
	IssueTable.propTypes = {
	  issues: _propTypes2.default.array.isRequired, // eslint-disable-line react/forbid-prop-types
	  deleteIssue: _propTypes2.default.func.isRequired
	};
	
	var IssueList = function (_React$Component) {
	  _inherits(IssueList, _React$Component);
	
	  function IssueList(props, context) {
	    _classCallCheck(this, IssueList);
	
	    var _this = _possibleConstructorReturn(this, (IssueList.__proto__ || Object.getPrototypeOf(IssueList)).call(this, props, context));
	
	    var issues = context.initialState.data.records;
	    issues.forEach(function (issue) {
	      issue.created = new Date(issue.created);
	      if (issue.completionDate) {
	        issue.completionDate = new Date(issue.completionDate);
	      }
	    });
	    _this.state = {
	      issues: issues,
	      toastVisible: false, toastMessage: '', toastType: 'success'
	    };
	    _this.setFilter = _this.setFilter.bind(_this);
	    _this.deleteIssue = _this.deleteIssue.bind(_this);
	    _this.showError = _this.showError.bind(_this);
	    _this.dismissToast = _this.dismissToast.bind(_this);
	    return _this;
	  }
	
	  _createClass(IssueList, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.loadData();
	    }
	    //this function look for any changes in filter fields and invoked immediately after updating occurs
	
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      //prevProps means state of props before changing
	      var oldQuery = prevProps.location.query; //location - URL address of prevProps
	      var newQuery = this.props.location.query;
	      //if comparing show no changes, return prevProps as it was
	      if (oldQuery.status === newQuery.status && oldQuery.effort_gte === newQuery.effort_gte && oldQuery.effort_lte === newQuery.effort_lte) {
	        return;
	      }
	      this.loadData();
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
	    key: 'loadData',
	    value: function loadData() {
	      var _this2 = this;
	
	      //this.props.location.search = ?effort_gte=some_number&status(filter value in unparsed URL)
	      fetch('/api/issues' + this.props.location.search).then(function (response) {
	        if (response.ok) {
	          // ok = true and means, that response was successful
	          response.json().then(function (data) {
	            //data is a variable, which get data from server, _metadata is an object of that data
	            console.log('Total count of records:', data._metadata.total_count); //total count is a property of metadata
	            data.records.forEach(function (issue) {
	              //records is a property which keeps issues = [{...}] inside it
	              issue.created = new Date(issue.created); //assign date of creation issue
	              if (issue.completionDate) {
	                // if user appointed date to complete issue
	                issue.completionDate = new Date(issue.completionDate); //take this and put in object Date()
	              }
	            });
	            _this2.setState({ issues: data.records }); //then change the state issues:[] to real issues data
	          });
	        } else {
	          response.json().then(function (error) {
	            _this2.showError('Failed to fetch issues:' + error.message);
	          });
	        }
	      }).catch(function (err) {
	        _this2.showError('Error in fetching data from server:', err);
	      });
	    }
	    //this method calls from the IssueFilter component
	
	  }, {
	    key: 'setFilter',
	    value: function setFilter(query) {
	      //takes 'query' which is an object f.e.g.{ status: 'Open', effort_gte: '10', effort_lte: '11'} according to filter settings
	      //and push it to browser URL as a query string looks like ?effort_gte=10&effort_lte=11&status=Open
	      this.props.router.push({ pathname: this.props.location.pathname, query: query });
	    }
	    //this method calls from the IssueAdd component
	
	  }, {
	    key: 'deleteIssue',
	    value: function deleteIssue(id) {
	      var _this3 = this;
	
	      fetch('/api/issues/' + id, { method: 'DELETE' }).then(function (response) {
	        if (!response.ok) {
	          _this3.showError('Failed to delete issue');
	        } else {
	          _this3.loadData();
	        }
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Panel,
	          { collapsible: true, header: 'Filter' },
	          _react2.default.createElement(_IssueFilter2.default, { setFilter: this.setFilter, initFilter: this.props.location.query })
	        ),
	        _react2.default.createElement('hr', null),
	        _react2.default.createElement(IssueTable, { issues: this.state.issues, deleteIssue: this.deleteIssue }),
	        _react2.default.createElement('hr', null),
	        _react2.default.createElement(_Toast2.default, { showing: this.state.toastVisible, message: this.state.toastMessage, onDismiss: this.dismissToast,
	          bsStyle: this.state.toastType })
	      );
	    }
	  }]);
	
	  return IssueList;
	}(_react2.default.Component);
	
	exports.default = IssueList;
	
	IssueList.propTypes = {
	  location: _propTypes2.default.object.isRequired,
	  router: _propTypes2.default.object
	};
	IssueList.contextTypes = {
	  initialState: _propTypes2.default.object
	};

/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(20);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _reactBootstrap = __webpack_require__(17);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	//import { a  } from 'react-router';
	
	var IssueFilter = function (_React$Component) {
	  _inherits(IssueFilter, _React$Component);
	
	  function IssueFilter(props) {
	    _classCallCheck(this, IssueFilter);
	
	    var _this = _possibleConstructorReturn(this, (IssueFilter.__proto__ || Object.getPrototypeOf(IssueFilter)).call(this, props)); //props means props given from parent component (setFilter in this case)
	
	
	    _this.state = { //this is initial state of filter: any value from previous filtering or ''
	      status: props.initFilter.status || '', //initFilter is a variable, which is a part of state
	      effort_gte: props.initFilter.effort_gte || '', //initFilter connects state and displayed value
	      effort_lte: props.initFilter.effort_lte || '', //so, when we change initFilter, displayed value changing too
	      changed: false
	    };
	    _this.onChangeStatus = _this.onChangeStatus.bind(_this);
	    _this.onChangeEffortGte = _this.onChangeEffortGte.bind(_this);
	    _this.onChangeEffortLte = _this.onChangeEffortLte.bind(_this);
	    _this.resetFilter = _this.resetFilter.bind(_this);
	    _this.applyFilter = _this.applyFilter.bind(_this);
	    _this.clearFilter = _this.clearFilter.bind(_this);
	    return _this;
	  }
	  //author of the book uses this method despite warning on React official documentation(ROD)
	  //he says it because of componentWillReceiveProps make code more readable and clear
	  //it's invoked whenever the props are changing, before a mounted component r e s e i v e s new props
	  //and update this.state on the fly
	
	  _createClass(IssueFilter, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(newProps) {
	      this.setState({
	        status: newProps.initFilter.status || '',
	        effort_gte: newProps.initFilter.effort_gte || '',
	        effort_lte: newProps.initFilter.effort_lte || '',
	        changed: false
	      });
	    }
	    //should be invoked by clicking corresponding button in filter section
	    //clear any filter settings before applying, similar to clearFilter, but before sending data
	
	  }, {
	    key: 'resetFilter',
	    value: function resetFilter() {
	      this.setState({
	        status: this.props.initFilter.status || '',
	        effort_gte: this.props.initFilter.effort_gte || '',
	        effort_lte: this.props.initFilter.effort_lte || '',
	        changed: false
	      });
	    }
	  }, {
	    key: 'clearFilter',
	    value: function clearFilter(e) {
	      e.preventDefault();
	      this.props.setFilter({});
	    }
	  }, {
	    key: 'onChangeStatus',
	    value: function onChangeStatus(e) {
	      this.setState({ status: e.target.value, changed: true });
	    }
	    //next two functions check if values in effort fields are digital, and if they are, change state variable
	
	  }, {
	    key: 'onChangeEffortGte',
	    value: function onChangeEffortGte(e) {
	      var effortString = e.target.value;
	      console.log(typeof fortString === 'undefined' ? 'undefined' : _typeof(fortString));
	      if (effortString.match(/^\d+/)) {
	        this.setState({ effort_gte: e.target.value, changed: true });
	      }
	    }
	  }, {
	    key: 'onChangeEffortLte',
	    value: function onChangeEffortLte(e) {
	      var effortString = e.target.value;
	      console.log(typeof fortString === 'undefined' ? 'undefined' : _typeof(fortString));
	      if (effortString.match(/^\d+/)) {
	        this.setState({ effort_lte: e.target.value, changed: true });
	      }
	    }
	  }, {
	    key: 'applyFilter',
	    value: function applyFilter() {
	      var newFilter = {}; //variable for keeping each new filter settings
	      if (this.state.status) {
	        newFilter.status = this.state.status;
	      }
	      if (this.state.effort_gte) {
	        newFilter.effort_gte = this.state.effort_gte;
	      }
	      if (this.state.effort_lte) {
	        newFilter.effort_lte = this.state.effort_lte;
	      }
	      this.props.setFilter(newFilter); //this is parent props setFilter, with parameters from variable
	      //newFilter
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _reactBootstrap.Row,
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { xs: 6, sm: 4, md: 3, lg: 3 },
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.ControlLabel,
	              null,
	              'Status'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.FormControl,
	              { componentClass: 'select', value: this.state.status, onChange: this.onChangeStatus },
	              _react2.default.createElement(
	                'option',
	                { value: '' },
	                '(Any)'
	              ),
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
	          _reactBootstrap.Col,
	          { xs: 6, sm: 4, md: 3, lg: 3 },
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.ControlLabel,
	              null,
	              'Effort'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.InputGroup,
	              null,
	              _react2.default.createElement(_reactBootstrap.FormControl, { value: this.state.effort_gte, onChange: this.onChangeEffortGte }),
	              _react2.default.createElement(
	                _reactBootstrap.InputGroup.Addon,
	                null,
	                '-'
	              ),
	              _react2.default.createElement(_reactBootstrap.FormControl, { value: this.state.effort_lte, onChange: this.onChangeEffortLte })
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { xs: 6, sm: 4, md: 3, lg: 3 },
	          _react2.default.createElement(
	            _reactBootstrap.FormGroup,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.ControlLabel,
	              null,
	              '\xA0'
	            ),
	            _react2.default.createElement(
	              _reactBootstrap.ButtonToolbar,
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.ButtonGroup,
	                { bsSize: '' },
	                _react2.default.createElement(
	                  _reactBootstrap.Button,
	                  { bsStyle: 'primary', onClick: this.applyFilter },
	                  'Apply'
	                ),
	                _react2.default.createElement(
	                  _reactBootstrap.Button,
	                  { onClick: this.resetFilter, disabled: !this.state.changed },
	                  'Reset'
	                ),
	                _react2.default.createElement(
	                  _reactBootstrap.Button,
	                  { onClick: this.clearFilter },
	                  'Clear'
	                )
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);
	
	  return IssueFilter;
	}(_react2.default.Component);
	
	exports.default = IssueFilter;
	
	IssueFilter.propTypes = {
	  setFilter: _propTypes2.default.func.isRequired,
	  initFilter: _propTypes2.default.object.isRequired
	  // default
	
	};

/***/ }),

/***/ 31:
/***/ (function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ })

};
//# sourceMappingURL=0.0c5c9fe18c1343eded9d.hot-update.js.map