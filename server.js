//for some reason it doesnt work:
// import bodyParser from 'body-parser';
// import express from "express";

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
//this two objects define what is the valid object "issue"
const validIssueStatus = {
	New: true,
	Open: true,
	Assigned: true,
	Fixed: true,
	Verified: true,
	Closed: true
}
const issueFieldType = {
	id: "required",
	status: "required",
	owner: "required",
	effort: "optional",
	created: "required",
	completionDate: "optional",
	title: "required"
}
function validateIssue(issue) {
	for (const field in issueFieldType) {
		const type = issueFieldType[field];
		if(!type) {
			delete issue[field];
		} else if (type === "required" && !issue[field]){
			return `${field} is required.`;
		}
	}
	if (!validIssueStatus[issue.status]){
		return `${issue.staus} is a not valid status.`;
	}
	return null;
}
app.post('/api/issues',(req, res) => {
	const newIssue = req.body;
	newIssue.id = issues.length + 1;
	if (!newIssue.status) {
		newIssue.status = "New";
	}
	const err = validateIssue(newIssue)
	if (err) {
		rews.status(422).json({message: `Invalid request: ${err}` });
		return;
	}
	issues.push(newIssue);
	res.json(newIssue);
});
app.get('/api/issues', (req, res) => {
	const metadata = {total_count: issues.length};
	res.json({_metadata: metadata, records: issues});
});
//test was done
app.post('/api/issues', (req, res) => {
	const newIssue = req.body;
	newIssue.id = issues.length +1;
	newIssue.effort = newIssue.effort
	newIssue.created = new Date();
	if (!newIssue.status) {
		newIssue.status = "New";
	}
	issues.push(newIssue);
	res.json(newIssue);
});
app.listen(3000, () => {
	console.log("App started on port 3000");
});
