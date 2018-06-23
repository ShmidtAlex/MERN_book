(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setDb = exports.app = undefined;
	
	var _express = __webpack_require__(3);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _bodyParser = __webpack_require__(4);
	
	var _bodyParser2 = _interopRequireDefault(_bodyParser);
	
	var _mongodb = __webpack_require__(5);
	
	var _issue = __webpack_require__(6);
	
	var _issue2 = _interopRequireDefault(_issue);
	
	var _renderedPageRouter = __webpack_require__(7);
	
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
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

	module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = require("body-parser");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = require("mongodb");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var validIssueStatus = {
	  New: true,
	  Open: true,
	  Assigned: true,
	  Fixed: true,
	  Verified: true,
	  Closed: true
	};
	
	var issueFieldType = {
	  status: 'required',
	  owner: 'required',
	  effort: 'optional',
	  created: 'required',
	  completionDate: 'optional',
	  title: 'required'
	};
	
	function cleanupIssue(issue) {
	  var cleanedUpIssue = {};
	  Object.keys(issue).forEach(function (field) {
	    if (issueFieldType[field]) cleanedUpIssue[field] = issue[field];
	  });
	  return cleanedUpIssue;
	}
	
	function convertIssue(issue) {
	  if (issue.created) issue.created = new Date(issue.created);
	  if (issue.completionDate) issue.completionDate = new Date(issue.completionDate);
	  return cleanupIssue(issue);
	}
	
	function validateIssue(issue) {
	  var errors = [];
	  Object.keys(issueFieldType).forEach(function (field) {
	    if (issueFieldType[field] === 'required' && !issue[field]) {
	      errors.push('Missing mandatory field: ' + field);
	    }
	  });
	
	  if (!validIssueStatus[issue.status]) {
	    errors.push(issue.status + ' is not a valid status.');
	  }
	
	  return errors.length ? errors.join('; ') : null;
	}
	
	exports.default = {
	  validateIssue: validateIssue,
	  cleanupIssue: cleanupIssue,
	  convertIssue: convertIssue
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(8);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _server = __webpack_require__(9);
	
	var _express = __webpack_require__(3);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _HelloWorld = __webpack_require__(10);
	
	var _HelloWorld2 = _interopRequireDefault(_HelloWorld);
	
	var _template = __webpack_require__(12);
	
	var _template2 = _interopRequireDefault(_template);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var renderedPageRouter = new _express2.default();
	
	renderedPageRouter.get('*', function (req, res) {
	  var initialState = { addresse: 'Universe' };
	  var html = (0, _server.renderToString)(_react2.default.createElement(_HelloWorld2.default, initialState));
	  res.send((0, _template2.default)(html, initialState));
	});
	exports.default = renderedPageRouter;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = require("react");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	module.exports = require("react-dom/server");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(8);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(11);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var HelloWorld = function (_React$Component) {
	  _inherits(HelloWorld, _React$Component);
	
	  function HelloWorld(props) {
	    _classCallCheck(this, HelloWorld);
	
	    var _this = _possibleConstructorReturn(this, (HelloWorld.__proto__ || Object.getPrototypeOf(HelloWorld)).call(this, props));
	
	    _this.state = Object.assign({}, _this.props);
	    return _this;
	  }
	
	  _createClass(HelloWorld, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      setTimeout(function () {
	        _this2.setState({ addressee: 'Universe' });
	      }, 5000);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'h1',
	        null,
	        'Hello ',
	        this.state.addressee,
	        '!'
	      );
	    }
	  }]);
	
	  return HelloWorld;
	}(_react2.default.Component);
	
	exports.default = HelloWorld;
	
	HelloWorld.propTypes = {
	  addressee: _propTypes2.default.string
	};
	HelloWorld.defaultProps = {
	  addressee: ''
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = require("prop-types");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = template;
	function template(body, initalState) {
	  return "<!DOCTYPE HTML>\n<html>\n<head>\n  <meta charset=\"UTF-8\" />\n  <title>Pro MERN Stack</title>\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <link rel=\"stylesheet\" href=\"/bootstrap/css/bootstrap.min.css\" >\n  <style>\n    .panel-title a {display: block; width: 100%; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <div id=\"contents\">" + body + "</div>    <!-- this is where our component will appear -->\n  <script> window.__INITIAL_STATE__ = " + JSON.stringify(initalState) + "</script>\n  <script src=\"/vendor.bundle.js\"></script>\n  <script src=\"/app.bundle.js\"></script>\n</body>\n</html>\n";
	}

/***/ })
/******/ ])));
//# sourceMappingURL=server.bundle.js.map