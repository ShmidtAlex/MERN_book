//for some reason it doesnt work:
// import bodyParser = from 'body-parser';
// import express = from "express";

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static('static'));

const issues = [
	{
		id: 1, status: "Open", owner: "Alex", created: new Date('2018-05-17'), effort: 5, 
		completionDate: undefined, title: "Error in console when clicking Add"
	},
	{
		id: 2, status: "Assigned", owner: "Olga", created: new Date('2018-05-01'), effort: 14, 
		completionDate: new Date('2018-06-01'), title: "Missing bottom border on panel"
	},
];
app.get('/api/issues', (req, res) => {
	const metadata = {total_count: issues.length};
	res.json({_metadata: metadata, records: issues});
});
app.post('/api/issues', (req, res) => {
	const newIssue = req.body;
	newIssue.id = issues.length +1;
	newIssue.created = new Date();
	if (!newIssue.status) {
		newIssue.status = "New";
	}
	issues.push(newIssue)
	;
	res.json(newIssue);
});
app.listen(3000, () => {
	console.log("App started on port 3000");
});
