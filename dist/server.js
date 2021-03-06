'use strict';

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

var _renderedPageRouter = require('./renderedPageRouter.jsx');

var _renderedPageRouter2 = _interopRequireDefault(_renderedPageRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();
//import mongodb driver features


//create express instance
var app = (0, _express2.default)();
//using middleware static, show that static files placed in 'static' folder
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
_mongodb.MongoClient.connect('mongodb://localhost/IssueTracker').then(function (connection) {
  //assign our connection with mongo database (called IssueTracker) to global varibale db
  db = connection.db('IssueTracker');
  app.listen(3000, function () {
    //start express server after getting connection
    console.log("App started on port 3000");
  });
}).catch(function (error) {
  console.log('ERROR:', error);
});
//returning one and only one real page in our SPA for avoid situation, when router
//can't find correct path /api/issues,(instead it find /issues) 
//after hitting 'reload' button in browser/ it also affects webpack.config 'historyApiFallback'
//# sourceMappingURL=server.js.map