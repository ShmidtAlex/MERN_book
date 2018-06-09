import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
import 'babel-polyfill';

import express from "express";
import bodyParser from 'body-parser';
import path from 'path';
//import mongodb driver features
import { MongoClient } from 'mongodb';
import Issue from './issue.js'
//create express instance
const app = express();
//using middleware static, show that static files placed in 'static' folder
app.use(express.static('static'));
//create and mount bodyParser middleware, which helps to parse .json file 
//to simple object, at the application level
app.use(bodyParser.json());
//create global variable for mongoDB connection
let db;

//this API is designed for finding issues by filter
//'/api' is a prefix, which shows that issues is an API, it's not path
app.get('/api/issues', (req, res) => {
  const filter = {};//by default filter is empty object
  if (req.query.status) {//if in parsed query string from request from client there is any status,
    //now filter's status is equal to status from parsed query string
    filter.status = req.query.status;
  }
  if (req.query.effort_lte || req.query.effort_gte) {
    filter.effort = {};
  }
  if (req.query.effort_lte ) {
    filter.effort.$lte = parseInt(req.query.effort_lte, 10);
  }
  if (req.query.effort_gte ) {
    filter.effort.$gte = parseInt(req.query.effort_gte, 10);
  }
  //any collection in mongo DB has method 'collection', which allows us supply the name
  //of collection (issues in this case), to indicate exactly which collection from data base
  db.collection('issues').find(filter).toArray()
  .then(issues => {
    //returning document given by find(filter) method 
    const metadata = { total_count: issues.length };
    res.json({ _metadata: metadata, records: issues });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server error ${error}` });
  });
});


//this API is designed for creating new 'issues'
//.post creates an object which is supplied from the body
app.post('/api/issues',(req, res) => {
  //req.body containts the body of created new issue, it's valid for post 
  //NOTE: req.body will be undefined, if there is no middleware (bodyParser f.e.x) for interpret
  const newIssue = req.body;
  newIssue.created = new Date();//because of we have no filed for setting date, we assign it here
  //if created issue doesn't have any status from user initally, assign status 'New'
  if (!newIssue.status) {
    newIssue.status = 'New';
  }
  const err = Issue.validateIssue(newIssue);
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` });
    return;
  }
  //insert newIssue variable, which contains created issue to data base
  //before insert validate newIssue by cleanupIssue function from imported Issue variable
  db.collection('issues').insertOne(Issue.cleanupIssue(newIssue)).then(result => 
    //while it's inserting, it gets new id, which stored in property insertedId
    db.collection('issues').find({_id: result.insertedId}).limit(1)
    .next()
  )
  .then(savedIssue => {
    res.json(savedIssue);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: `Internal Server Error: ${error}` });
  });
});

//MongoClient is an object provided by mongodb module, allows us act as a client
//'connect' method connecting the database from Node.js
MongoClient.connect('mongodb://localhost/IssueTracker').then(connection => {
  //assign our connection with mongo database (called IssueTracker) to global varibale db
	db = connection.db('IssueTracker');
	app.listen(3000, () => {//start express server after getting connection
		console.log("App started on port 3000");
	});	
}).catch(error => {
	console.log('ERROR:', error);
});
//returning one and only one real page in our SPA for avoid situation, when router
//can't find correct path /api/issues,(instead it find /issues) 
//after hitting 'reload' button in browser/ it also affects webpack.config 'historyApiFallback'
app.get('*', (req, res) => {
  res.sendFile(path.resolve('static/index.html'));//sendFile(path) respons that exacly file corresponds to exaxtly path
});