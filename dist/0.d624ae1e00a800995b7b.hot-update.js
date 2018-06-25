exports.id = 0;
exports.modules = {

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
	
	    console.log(props);
	    var issues = context.initialState.data.records;
	    console.log(props, context);
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

/***/ })

};
//# sourceMappingURL=0.d624ae1e00a800995b7b.hot-update.js.map