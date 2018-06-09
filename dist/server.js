'use strict';

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();
//import mongodb driver features

//create express instance
const app = (0, _express2.default)();
//using middleware static, show that static files placed in 'static' folder
app.use(_express2.default.static('static'));
//create and mount bodyParser middleware, which helps to parse .json file 
//to simple object, at the application level
app.use(_bodyParser2.default.json());
//create global variable for mongoDB connection
let db;

//this API is designed for finding issues by filter
//'/api' is a prefix, which shows that issues is an API, it's not path
app.get('/api/issues', (req, res) => {
  //by default filter is empty object
  const filter = {};
  //if in parsed query string from request from client there is any status,
  if (req.query.status) {
    //than filter became not empty, and it's status is equal status from parsed query string
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
  db.collection('issues').find(filter).toArray().then(issues => {
    //returning document given by find(filter) method 
    const metadata = { total_count: issues.length };
    res.json({ _metadata: metadata, records: issues });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server error ${error}` });
  });
});

//this API is designed for creating new 'issues'
//.post creates an object which is supplied from the body
app.post('/api/issues', (req, res) => {
  //req.body containts the body of created new issue, it's valid for post 
  //NOTE: req.body will be undefined, if there is no middleware (bodyParser f.e.x) for interpret
  const newIssue = req.body;
  //because of we have no filed for setting date, we assign it here
  newIssue.created = new Date();
  //if created issue doesn't have any status from user initally, assign status 'New'
  if (!newIssue.status) {
    newIssue.status = 'New';
  }
  const err = _issue2.default.validateIssue(newIssue);
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` });
    return;
  }
  //insert newIssue variable, which contains created issue to data base
  //before insert validate newIssue by cleanupIssue function from imported Issue variable
  db.collection('issues').insertOne(_issue2.default.cleanupIssue(newIssue)).then(result =>
  //while it's inserting, it gets new id, which stored in property insertedId
  //.limit(1) shows, that we only
  db.collection('issues').find({ _id: result.insertedId }).limit(1).next()).then(savedIssue => {
    res.json(savedIssue);
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
});

//MongoClient is an object provided by mongodb module, allows us act as a client
//'connect' method connecting the database from Node.js
_mongodb.MongoClient.connect('mongodb://localhost/IssueTracker').then(connection => {
  //assign our connection with mongo database (called IssueTracker) to global varibale db
  db = connection.db('IssueTracker');
  //start express server after getting connection
  app.listen(3000, () => {
    console.log("App started on port 3000");
  });
}).catch(error => {
  console.log('ERROR:', error);
});

app.get('*', (req, res) => {
  res.sendFile(_path2.default.resolve('static/index.html'));
});
//# sourceMappingURL=server.js.map