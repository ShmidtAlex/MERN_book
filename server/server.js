import express from "express";
import bodyParser from 'body-parser';
import 'babel-polyfill';
import { MongoClient } from 'mongodb';
import Issue from './issue.js'
import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
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

//throw new Error("TEST!!!");

let db;
MongoClient.connect('mongodb://localhost/IssueTracker').then(connection => {
	db = connection.db('IssueTracker');
	app.listen(3000, () => {
		console.log("App started on port 3000");
	});	
}).catch(error => {
	console.log('ERROR:', error);
});

