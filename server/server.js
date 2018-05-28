//it doesnt work, becouse we need 
// import bodyParser from 'body-parser';
// import express from "express";

const express = require('express');
// const mongoose = require('mongoose');
// const keys = require('./config/keys');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const Issue = require('./issue.js');
// console.log(keys.mongoURI);
// mongoose.connect(keys.mongoURI);
const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/api/issues', (req, res) => {
	db.collection('issues').find().toArray().then(issues => {
		const metadata = {total_count: issues.length};
		res.json({_metadata: metadata, records: issues});
	}).catch(error => {
		console.log(error);
		res.status(500).json({message: `Internal Server error ${error}` });
	});
});


//this two objects define what is the valid object "issue"


app.post('/api/issues',(req, res) => {
	const newIssue = req.body;
	//we don't need this one anymore
	//newIssue.id = issues.length + 1;
	newIssue.created = new Date();
	if (!newIssue.status) {
		newIssue.status = "New";
	}
	const err = Issue.validateIssue(newIssue)
	if (err) {
		res.status(422).json({message: `Invalid request: ${err}` });
		return;
	}
	db.collection('issues').insertOne(newIssue).then(result => {
		db.collection('issues').find({_id: result.insertedId}).limit(1).next()
	}).then(newIssue => {
		res.json(newIssue);
	}).catch(error => {
		console.log(error);
		res.status(500).json({message: `Internal Server Error: ${error}` });
	});
	// issues.push(newIssue);
	// res.json(newIssue);
});

//test was done
// app.post('/api/issues', (req, res) => {
// 	const newIssue = req.body;
// 	newIssue.id = issues.length +1;
// 	newIssue.effort = newIssue.effort
// 	newIssue.created = new Date();
// 	if (!newIssue.status) {
// 		newIssue.status = "New";
// 	}
// 	issues.push(newIssue);
// 	res.json(newIssue);
// });
let db;
MongoClient.connect('mongodb://localhost/IssueTracker').then(connection => {
	db = connection.db('IssueTracker');
	app.listen(3000, () => {
		console.log("App started on port 3000");
	});	
}).catch(error => {
	console.log('ERROR:', error);
});

