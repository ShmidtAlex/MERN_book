exports.id = 0;
exports.modules = {

/***/ 6:
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
	
	var _renderedPageRouter = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./renderedPageRouter.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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

/***/ })

};
//# sourceMappingURL=0.413f7126b8691a904d70.hot-update.js.map