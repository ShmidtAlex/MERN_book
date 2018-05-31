'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

require('babel-polyfill');

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();
// console.log(keys.mongoURI);
// mongoose.connect(keys.mongoURI);
const app = (0, _express2.default)();
app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

app.get('/api/issues', (req, res) => {
	db.collection('issues').find().toArray().then(issues => {
		const metadata = { total_count: issues.length };
		res.json({ _metadata: metadata, records: issues });
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server error ${error}` });
	});
});

//this two objects define what is the valid object "issue"


app.post('/api/issues', (req, res) => {
	const newIssue = req.body;
	//we don't need this one anymore
	//newIssue.id = issues.length + 1;
	newIssue.created = new Date();
	if (!newIssue.status) {
		newIssue.status = "New";
	}
	const err = _issue2.default.validateIssue(newIssue);
	if (err) {
		res.status(422).json({ message: `Invalid request: ${err}` });
		return;
	}
	db.collection('issues').insertOne(newIssue).then(result => {
		db.collection('issues').find({ _id: result.insertedId }).limit(1).next();
	}).then(newIssue => {
		res.json(newIssue);
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server Error: ${error}` });
	});
	// issues.push(newIssue);
	// res.json(newIssue);
});

//throw new Error("TEST!!!");

let db;
_mongodb.MongoClient.connect('mongodb://localhost/IssueTracker').then(connection => {
	db = connection.db('IssueTracker');
	app.listen(3000, () => {
		console.log("App started on port 3000");
	});
}).catch(error => {
	console.log('ERROR:', error);
});
//# sourceMappingURL=server.js.map