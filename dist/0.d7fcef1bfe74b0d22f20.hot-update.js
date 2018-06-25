exports.id = 0;
exports.modules = [
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setDb = exports.app = undefined;
	
	var _express = __webpack_require__(7);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _bodyParser = __webpack_require__(8);
	
	var _bodyParser2 = _interopRequireDefault(_bodyParser);
	
	var _mongodb = __webpack_require__(5);
	
	var _issue = __webpack_require__(9);
	
	var _issue2 = _interopRequireDefault(_issue);
	
	var _renderedPageRouter = __webpack_require__(10);
	
	var _renderedPageRouter2 = _interopRequireDefault(_renderedPageRouter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	//create express instance
	var app = (0, _express2.default)();
	//using middleware static, show that static files placed in 'static' folder
	
	//import mongodb driver features
	app.use(_express2.default.static('static'));
	//create and mount bodyParser middleware, which helps to parse .json file 
	//to simple object, at the application level
	app.use(_bodyParser2.default.json());
	//create global variable for mongoDB connection
	var db = void 0;
	
	//this API is designed for finding issues by filter
	//'/api' is a prefix, which shows that issues is an API, it's not path
	app.get('/api/issues', function (req, res) {
	  var filter = {}; //by default filter is empty object
	  if (req.query.status) {
	    //if in parsed query string from request from client there is any status,
	    //now filter's status is equal to status from parsed query string
	    filter.status = req.query.status;
	  }
	  if (req.query.effort_lte || req.query.effort_gte) {
	    filter.effort = {};
	  }
	  if (req.query.effort_lte) {
	    filter.effort.$lte = parseInt(req.query.effort_lte, 10);
	  }
	  if (req.query.effort_gte) {
	    filter.effort.$gte = parseInt(req.query.effort_gte, 10);
	  }
	  //any collection in mongo DB has method 'collection', which allows us supply the name
	  //of collection (issues in this case), to indicate exactly which collection from data base
	  db.collection('issues').find(filter).toArray().then(function (issues) {
	    //returning document given by find(filter) method 
	    var metadata = { total_count: issues.length };
	    res.json({ _metadata: metadata, records: issues });
	  }).catch(function (error) {
	    console.log(error);
	    res.status(500).json({ message: 'Internal Server error ' + error });
	  });
	});
	
	//this API is designed for creating new 'issues'
	//.post creates an object which is supplied from the body
	app.post('/api/issues', function (req, res) {
	  //req.body containts the body of created new issue, it's valid for post 
	  //NOTE: req.body will be undefined, if there is no middleware (bodyParser f.e.x) for interpret
	  var newIssue = req.body;
	  newIssue.created = new Date(); //because of we have no filed for setting date, we assign it here
	  //if created issue doesn't have any status from user initally, assign status 'New'
	  if (!newIssue.status) {
	    newIssue.status = 'New';
	  }
	  var err = _issue2.default.validateIssue(newIssue);
	  if (err) {
	    res.status(422).json({ message: 'Invalid request: ' + err });
	    return;
	  }
	  //insert newIssue variable, which contains created issue to data base
	  //before insert validate newIssue by cleanupIssue function from imported Issue variable
	  db.collection('issues').insertOne(_issue2.default.cleanupIssue(newIssue)).then(function (result) {
	    return (
	      //while it's inserting, it gets new id, which stored in property insertedId
	      db.collection('issues').find({ _id: result.insertedId }).limit(1).next()
	    );
	  }).then(function (savedIssue) {
	    res.json(savedIssue);
	  }).catch(function (error) {
	    console.log(error);
	    res.status(500).json({ message: 'Internal Server Error: ' + error });
	  });
	});
	
	app.get('/api/issues/:id', function (req, res) {
	  var issueId = void 0;
	  console.log(req.params.id);
	  try {
	    issueId = new _mongodb.ObjectId(req.params.id); //for using ObjectId() you need import it from mongodb
	  } catch (error) {
	    res.status(422).json({ message: 'Invalid issue ID format : ' + error });
	    return;
	  }
	  db.collection('issues').find({ _id: issueId }).limit(1).next().then(function (issue) {
	    if (!issue) {
	      res.status(404).json({ message: 'No such issue: ' + issueId });
	    } else {
	      res.json(issue);
	    }
	  }).catch(function (error) {
	    console.log(error);
	    res.status(500).json({ message: 'Internal Server Error: ' + error });
	  });
	});
	//Update API
	app.put('/api/issues/:id', function (req, res) {
	  var issueId = void 0;
	  try {
	    issueId = new _mongodb.ObjectId(req.params.id);
	  } catch (error) {
	    res.status(422).json({ message: 'Invalid issue ID format: ' + error });
	    return;
	  }
	  var issue = req.body;
	  delete issue._id;
	  var err = _issue2.default.validateIssue(issue);
	  if (err) {
	    res.status(422).json({ message: 'Invalid request: ' + err });
	    return;
	  }
	  db.collection('issues').updateOne({ _id: issueId }, _issue2.default.convertIssue(issue)).then(function () {
	    return db.collection('issues').find({ _id: issueId }).limit(1).next();
	  }).then(function (savedIssue) {
	    res.json(savedIssue);
	  }).catch(function (error) {
	    console.log(error);
	    res.status(500).json({ message: 'Internal Server Error: ' + error });
	  });
	});
	//delete API:
	app.delete('/api/issues/:id', function (req, res) {
	  var issueId = void 0;
	  try {
	    issueId = new _mongodb.ObjectId(req.params.id);
	  } catch (error) {
	    res.status(422).json({ message: 'Invalid issue ID format: ' + error });
	    return;
	  }
	  db.collection('issues').deleteOne({ _id: issueId }).then(function (deleteResult) {
	    if (deleteResult.result.n === 1) {
	      res.json({ status: "OK" });
	    } else {
	      res.json({ status: "Warning: object not found" });
	    }
	  }).catch(function (error) {
	    console.log(error);
	    res.status(500).json({ message: 'Internal server error: ' + error });
	  });
	});
	app.use('/', _renderedPageRouter2.default);
	//MongoClient is an object provided by mongodb module, allows us act as a client
	//'connect' method connecting the database from Node.js
	function setDb(newDb) {
	  db = newDb;
	}
	exports.app = app;
	exports.setDb = setDb;

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _server = __webpack_require__(12);
	
	var _reactRouter = __webpack_require__(13);
	
	var _express = __webpack_require__(7);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _template = __webpack_require__(14);
	
	var _template2 = _interopRequireDefault(_template);
	
	var _Routes = __webpack_require__(15);
	
	var _Routes2 = _interopRequireDefault(_Routes);
	
	var _ContextWrapper = __webpack_require__(28);
	
	var _ContextWrapper2 = _interopRequireDefault(_ContextWrapper);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var renderedPageRouter = new _express2.default();
	
	renderedPageRouter.get('*', function (req, res) {
	  (0, _reactRouter.match)({ routes: _Routes2.default, location: req.url }, function (error, redirectLocation, renderProps) {
	    if (error) {
	      res.status(500).send(error.message);
	    } else if (redirectLocation) {
	      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
	    } else if (renderProps) {
	      fetch('http://localhost:3000/api' + req.url).then(function (response) {
	        return response.json();
	      }).then(function (data) {
	        var initialState = { data: data };
	        var html = (0, _server.renderToString)(_react2.default.createElement(
	          _ContextWrapper2.default,
	          { initialState: initialState },
	          _react2.default.createElement(_reactRouter.RouterContext, renderProps)
	        ));
	        res.status(200).send((0, _template2.default)(html, initialState));
	      }).catch(function (err) {
	        console.log('Error rendering to string: ' + err);
	      });
	    } else {
	      res.status(404).send('Not Found');
	    }
	  });
	});
	exports.default = renderedPageRouter;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = require("react");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = require("react-dom/server");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = require("react-router");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = template;
	function template(body, initalState) {
	  return "<!DOCTYPE HTML>\n<html>\n<head>\n  <meta charset=\"UTF-8\" />\n  <title>Pro MERN Stack</title>\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"/bootstrap/css/bootstrap.min.css\" >\n  <style>\n    .panel-title a {display: block; width: 100%; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <div id=\"contents\">" + body + "</div>    <!-- this is where our component will appear -->\n  <script> window.__INITIAL_STATE__ = " + JSON.stringify(initalState) + "</script>\n  <script src=\"/vendor.bundle.js\"></script>\n  <script src=\"/app.bundle.js\"></script>\n</body>\n</html>\n";
	}

/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	__webpack_require__(3);
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(17);
	
	var _reactRouterBootstrap = __webpack_require__(18);
	
	var _IssueAddNavItem = __webpack_require__(19);
	
	var _IssueAddNavItem2 = _interopRequireDefault(_IssueAddNavItem);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Header = function Header() {
	  return _react2.default.createElement(
	    _reactBootstrap.Navbar,
	    { fluid: true },
	    _react2.default.createElement(
	      _reactBootstrap.Navbar.Header,
	      null,
	      _react2.default.createElement(
	        _reactBootstrap.Navbar.Brand,
	        null,
	        'Issue Tracker'
	      )
	    ),
	    _react2.default.createElement(
	      _reactBootstrap.Nav,
	      null,
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/issues' },
	        _react2.default.createElement(
	          _reactBootstrap.NavItem,
	          null,
	          'Issues'
	        )
	      ),
	      _react2.default.createElement(
	        _reactRouterBootstrap.LinkContainer,
	        { to: '/reports' },
	        _react2.default.createElement(
	          _reactBootstrap.NavItem,
	          null,
	          'Reports'
	        )
	      )
	    ),
	    _react2.default.createElement(
	      _reactBootstrap.Nav,
	      { pullRight: true },
	      _react2.default.createElement(_IssueAddNavItem2.default, null),
	      _react2.default.createElement(
	        _reactBootstrap.NavDropdown,
	        { id: 'user-dropdown', title: _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'option-horizontal' }), noCaret: true },
	        _react2.default.createElement(
	          _reactBootstrap.MenuItem,
	          null,
	          'Logout'
	        )
	      )
	    )
	  );
	};
	
	var App = function App(props) {
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(Header, null),
	    _react2.default.createElement(
	      'div',
	      { className: 'container-fluid' },
	      props.children,
	      _react2.default.createElement('hr', null),
	      _react2.default.createElement(
	        'h5',
	        null,
	        _react2.default.createElement(
	          'small',
	          null,
	          'Full source code available at this ',
	          _react2.default.createElement(
	            'a',
	            { href: 'https://github.com/vasansr/pro-mern-stack' },
	            'GitHub repository'
	          ),
	          '.'
	        )
	      )
	    )
	  );
	};
	
	App.propTypes = {
	  children: _react2.default.PropTypes.object.isRequired
	};
	
	exports.default = App;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = require("react-bootstrap");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = require("react-router-bootstrap");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(20);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _reactRouter = __webpack_require__(13);
	
	var _reactBootstrap = __webpack_require__(17);
	
	var _Toast = __webpack_require__(21);
	
	var _Toast2 = _interopRequireDefault(_Toast);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	//we don't use 'export default class' because of we use whthRouter function instead. It means, that we wrap this whole
	//component before exporting, not after as it is in App.jsx with IssueList. thus we encapsulate usage of router within this component
	var IssueAddNavItem = function (_React$Component) {
	  _inherits(IssueAddNavItem, _React$Component);
	
	  function IssueAddNavItem(props) {
	    _classCallCheck(this, IssueAddNavItem);
	
	    var _this = _possibleConstructorReturn(this, (IssueAddNavItem.__proto__ || Object.getPrototypeOf(IssueAddNavItem)).call(this, props));
	
	    _this.state = {
	      showing: false,
	      toastVisible: false, toastMessage: '', toastType: 'success'
	    };
	    _this.showModal = _this.showModal.bind(_this);
	    _this.hideModal = _this.hideModal.bind(_this);
	    _this.submit = _this.submit.bind(_this);
	    _this.showError = _this.showError.bind(_this);
	    _this.dismissToast = _this.dismissToast.bind(_this);
	    return _this;
	  }
	
	  _createClass(IssueAddNavItem, [{
	    key: 'showModal',
	    value: function showModal() {
	      this.setState({ showing: true });
	    }
	  }, {
	    key: 'hideModal',
	    value: function hideModal() {
	      this.setState({ showing: false });
	    }
	  }, {
	    key: 'showError',
	    value: function showError() {
	      this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
	    }
	  }, {
	    key: 'dismissToast',
	    value: function dismissToast() {
	      this.setState({ toastVisible: false });
	    }
	  }, {
	    key: 'submit',
	    value: function submit(e) {
	      var _this2 = this;
	
	      e.preventDefault();
	      this.hideModal();
	      var form = document.forms.issueAdd;
	      var newIssue = {
	        owner: form.owner.value, title: form.title.value, status: 'New', created: new Date()
	      };
	      fetch('api/issues', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(newIssue)
	      }).then(function (response) {
	        if (response.ok) {
	          response.json().then(function (updatedIssue) {
	            _this2.props.router.push('/issues/' + updatedIssue._id);
	          });
	        }
	      }).catch(function (err) {
	        _this2.showError('Error in sending data to server: ' + err.message);
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _reactBootstrap.NavItem,
	        { onClick: this.showModal },
	        _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'plus' }),
	        'Create Issue',
	        _react2.default.createElement(
	          _reactBootstrap.Modal,
	          { keyboard: true, show: this.state.showing, onHide: this.hideModal },
	          _react2.default.createElement(
	            _reactBootstrap.Modal.Header,
	            { closeButton: true },
	            _react2.default.createElement(
	              _reactBootstrap.Modal.Title,
	              null,
	              'Create Issue'
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Modal.Body,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.Form,
	              { name: 'issueAdd' },
	              _react2.default.createElement(
	                _reactBootstrap.FormGroup,
	                null,
	                _react2.default.createElement(
	                  _reactBootstrap.ControlLabel,
	                  null,
	                  'Title'
	                ),
	                _react2.default.createElement(_reactBootstrap.FormControl, { name: 'title', autoFocus: true })
	              ),
	              _react2.default.createElement(
	                _reactBootstrap.FormGroup,
	                null,
	                _react2.default.createElement(
	                  _reactBootstrap.ControlLabel,
	                  null,
	                  'Owner'
	                ),
	                _react2.default.createElement(_reactBootstrap.FormControl, { name: 'owner' })
	              )
	            )
	          ),
	          _react2.default.createElement(
	            _reactBootstrap.Modal.Footer,
	            null,
	            _react2.default.createElement(
	              _reactBootstrap.ButtonToolbar,
	              null,
	              _react2.default.createElement(
	                _reactBootstrap.Button,
	                { type: 'button', bsStyle: 'primary', onClick: this.submit },
	                'Submit'
	              ),
	              _react2.default.createElement(
	                _reactBootstrap.Button,
	                { bsStyle: 'link', onClick: this.hideModal },
	                'Cancel'
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);
	
	  return IssueAddNavItem;
	}(_react2.default.Component);
	
	IssueAddNavItem.propTypes = {
	  router: _propTypes2.default.object
	};
	exports.default = (0, _reactRouter.withRouter)(IssueAddNavItem);

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = require("prop-types");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(17);
	
	var _propTypes = __webpack_require__(20);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Toast = function (_React$Component) {
	  _inherits(Toast, _React$Component);
	
	  function Toast() {
	    _classCallCheck(this, Toast);
	
	    return _possibleConstructorReturn(this, (Toast.__proto__ || Object.getPrototypeOf(Toast)).apply(this, arguments));
	  }
	
	  _createClass(Toast, [{
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      if (this.props.showing) {
	        clearTimeout(this.dismissTimer);
	        this.dismissTimer = setTimeout(this.props.onDismiss, 5000);
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      clearTimeout(this.dismissTimer);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _reactBootstrap.Collapse,
	        { 'in': this.props.showing },
	        _react2.default.createElement(
	          'div',
	          { style: { position: 'fixed', top: 30, left: 30, right: 0, texAlign: 'center' } },
	          _react2.default.createElement(
	            _reactBootstrap.Alert,
	            { style: { display: 'inline-block', width: 500 }, bsStyle: this.props.bsStyle, onDismiss: this.props.onDismiss },
	            this.props.message
	          )
	        )
	      );
	    }
	  }]);
	
	  return Toast;
	}(_react2.default.Component);
	
	exports.default = Toast;
	
	Toast.propTypes = {
	  showing: _propTypes2.default.bool.isRequired,
	  onDismiss: _propTypes2.default.func.isRequired,
	  bsStyle: _propTypes2.default.string,
	  message: _propTypes2.default.any.isRequired
	};
	Toast.defaultProps = {
	  bsStyle: 'success'
	};

/***/ }),
/* 22 */
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
	
	    console.log(context.initialState.data);
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

/***/ }),
/* 23 */,
/* 24 */
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
/* 25 */
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
	
	  function IssueEdit(props, context) {
	    _classCallCheck(this, IssueEdit);
	
	    var _this = _possibleConstructorReturn(this, (IssueEdit.__proto__ || Object.getPrototypeOf(IssueEdit)).call(this, props, context));
	
	    var issue = context.initialState.data;
	    issue.created = new Date(issue.created);
	    issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate) : null;
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
	      fetch('/api/issues/' + this.props.params.id).then(function (response) {
	        if (response.ok) {
	          response.json().then(function (issue) {
	            //convert date to string
	            issue.created = new Date(issue.created);
	            //if issue.comletionDate NOT equal null, convert given new Date object to string, else - leave it empty
	            issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate) : null;
	            //change this.state accordingly converted data
	            _this3.setState({ issue: issue });
	          });
	        } else {
	          response.json().then(function (error) {
	            _this3.showError('Failed to fetch issue: ' + error.message);
	          });
	        }
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

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(20);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var NumInput = function (_React$Component) {
	  _inherits(NumInput, _React$Component);
	
	  function NumInput(props) {
	    _classCallCheck(this, NumInput);
	
	    //local state with transient state
	    var _this = _possibleConstructorReturn(this, (NumInput.__proto__ || Object.getPrototypeOf(NumInput)).call(this, props));
	
	    _this.state = { value: _this.format(props.value) };
	    _this.onBlur = _this.onBlur.bind(_this);
	    _this.onChange = _this.onChange.bind(_this);
	    return _this;
	  }
	
	  _createClass(NumInput, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(newProps) {
	      this.setState({ value: this.format(newProps.value) });
	    }
	  }, {
	    key: 'onBlur',
	    value: function onBlur(e) {
	      //pass local, transient state to parent after user finished edit, where it became persistence one
	      this.props.onChange(e, this.unformat(this.state.value));
	    }
	  }, {
	    key: 'onChange',
	    value: function onChange(e) {
	      //change persistent state accordingly local state, if it's validated successfully
	      if (e.target.value.match(/^\d*$/)) {
	        this.setState({ value: e.target.value });
	      }
	    }
	  }, {
	    key: 'format',
	    value: function format(num) {
	      //convert number to string, otherwise leave the field empty
	      return num != null ? num.toString() : '';
	    }
	  }, {
	    key: 'unformat',
	    value: function unformat(str) {
	      //convert string to a number, check if it is a number really, and put it 
	      //into the field, otherwise put null value to the field
	      var val = parseInt(str, 10);
	      console.log(val);
	      return isNaN(val) ? null : val;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return (
	        //{...this.props} passing parent's properties into this input's properties
	        //Note, that it is very significant, where we place it concerning native properties, first one overrided by last one
	        _react2.default.createElement('input', _extends({ type: 'text' }, this.props, { value: this.state.value, onBlur: this.onBlur, onChange: this.onChange }))
	      );
	    }
	  }]);
	
	  return NumInput;
	}(_react2.default.Component);
	
	exports.default = NumInput;
	
	NumInput.propTypes = {
	  value: _propTypes2.default.number,
	  onChange: _propTypes2.default.func.isRequired
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(20);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DateInput = function (_React$Component) {
	  _inherits(DateInput, _React$Component);
	
	  function DateInput(props) {
	    _classCallCheck(this, DateInput);
	
	    //state for date field initially not focused, and valid, because of shows valid data
	    var _this = _possibleConstructorReturn(this, (DateInput.__proto__ || Object.getPrototypeOf(DateInput)).call(this, props));
	
	    _this.state = { value: _this.editFormat(props.value), focused: false, valid: true };
	    _this.onFocus = _this.onFocus.bind(_this);
	    _this.onBlur = _this.onBlur.bind(_this);
	    _this.onChange = _this.onChange.bind(_this);
	    return _this;
	  }
	
	  _createClass(DateInput, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(newProps) {
	      //newProps here is edited by user date field. if it was editet, this.state knows about this new values
	      if (newProps.value !== this.props.value) {
	        this.setState({ value: this.editFormat(newProps.value) });
	      }
	    }
	  }, {
	    key: 'onFocus',
	    value: function onFocus() {
	      //this one only changed the focused value in this.state, when user clicked on date field
	      this.setState({ focused: true });
	    }
	  }, {
	    key: 'onBlur',
	    value: function onBlur(e) {
	      //if user typed wrong date, value will be null/ if correct, it will be new date, which he typed
	      var value = this.unformat(this.state.value);
	      //if user type wrong date, valid will be false/ if correct, it will be true
	      var valid = this.state.value === '' || value != null;
	      //if this.state.value != '' && this.unformat(this.state.value) != null
	      //and also if there is any value in onValidityChange prop from parent component
	      if (valid !== this.state.valid && this.props.onValidityChange) {
	        //that parent component recieves two arguments, including 'valid' (this.unformat(this.state value))
	        this.props.onValidityChange(e, valid);
	      }
	      //then we miss focuse, and confirm that valid is true
	      this.setState({ focused: false, valid: valid });
	      if (valid) {
	        //setting parent's onChange with the edited by user and correct date
	        this.props.onChange(e, value);
	      }
	    }
	  }, {
	    key: 'onChange',
	    value: function onChange(e) {
	      //if new value from user corresponding to RegExp, this value can exist in this field, otherwise it even doesn't typing in
	      if (e.target.value.match(/^[\d-]*$/)) {
	        this.setState({ value: e.target.value });
	      }
	    }
	  }, {
	    key: 'displayFormat',
	    value: function displayFormat(date) {
	      return date != null ? date.toDateString() : '';
	    }
	  }, {
	    key: 'editFormat',
	    value: function editFormat(date) {
	      //if there is any date, convert it to string ISO standart from 0 index to 9 (10 symb.length)
	      return date != null ? date.toISOString().substr(0, 10) : '';
	    }
	  }, {
	    key: 'unformat',
	    value: function unformat(str) {
	      //this one check is new unsetted state is a number, and if it is, allows it exist in this field
	      var val = new Date(str);
	      return isNaN(val.getTime()) ? null : val;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      {/*define the conditions for clasName='invalid' (for next styling it and showing to user, that it is)*/}
	
	      var value = this.state.focused || !this.state.valid ? this.state.value : this.displayFormat(this.props.value);
	      var childProps = Object.assign({}, this.props);{/*clone parent props to const childProps*/}
	      delete childProps.onValidityChange;{/*remove unnecessary property onValidityChange*/}
	      return _react2.default.createElement('input', _extends({ type: 'text' }, childProps, { value: value,
	        placeholder: this.state.focused ? 'yyyy-mm-dd' : null,
	        onFocus: this.onFocus, onBlur: this.onBlur, onChange: this.onChange }));
	    }
	  }]);
	
	  return DateInput;
	}(_react2.default.Component);
	
	exports.default = DateInput;
	
	DateInput.propTypes = {
	  value: _propTypes2.default.object,
	  onChange: _propTypes2.default.func.isRequired,
	  onValidityChange: _propTypes2.default.func,
	  name: _propTypes2.default.string.isRequired
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(20);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ContextWrapper = function (_React$Component) {
	  _inherits(ContextWrapper, _React$Component);
	
	  function ContextWrapper() {
	    _classCallCheck(this, ContextWrapper);
	
	    return _possibleConstructorReturn(this, (ContextWrapper.__proto__ || Object.getPrototypeOf(ContextWrapper)).apply(this, arguments));
	  }
	
	  _createClass(ContextWrapper, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return { initialState: this.props.initialState };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.props.children;
	    }
	  }]);
	
	  return ContextWrapper;
	}(_react2.default.Component);
	
	exports.default = ContextWrapper;
	
	ContextWrapper.childContextTypes = {
	  initialState: _propTypes2.default.object
	};
	ContextWrapper.propTypes = {
	  children: _propTypes2.default.object.isRequired,
	  initialState: _propTypes2.default.object
	};

/***/ }),
/* 29 */,
/* 30 */,
/* 31 */
/***/ (function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ })
];
//# sourceMappingURL=0.d7fcef1bfe74b0d22f20.hot-update.js.map