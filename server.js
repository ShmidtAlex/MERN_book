const express = require("express");
const app = express();
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
app.listen(3000, () => {
	console.log("App started on port 3000");
});
//some checking for nodemon is it works or not ---OK