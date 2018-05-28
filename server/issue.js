'use strict'

const validIssueStatus = {
	New: true,
	Open: true,
	Assigned: true,
	Fixed: true,
	Verified: true,
	Closed: true
};
const issueFieldType = {
	status: "required",
	owner: "required",
	effort: "optional",
	created: "required",
	completionDate: "optional",
	title: "required"
};

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
module.exports = {
	validateIssue: validateIssue
};