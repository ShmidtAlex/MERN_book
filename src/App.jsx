// var contentNode = document.getElementById("contents");
// var component = <div><h1>Hello, World!</h1> <div>some content</div></div>;
// 
//rewrite the above code with es2015 after installing corresponding babel-preset:

const contentNode = document.getElementById('contents');
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
class IssueFilter extends React.Component {
	render() {
		return(
			<div>
				<div>This is placeholder for  the Issue Filter</div>
			</div>
		);
	}
}
class IssueTable extends React.Component {
	render() {
		//const borderedStyle = {border:"1px solid silver", padding: 6};
		const issueRows = this.props.issues.map(issue => <IssueRow key={issue.id} issue={issue} />);
		return(
			<table className="bordered-table">
				<thead>
					<tr>
						<th>Id</th>
						<th>Status</th>
						<th>Owner</th>
						<th>Created</th>
						<th>Effort</th>
						<th>Completion date</th>
						<th>Title</th>
					</tr>
				</thead>
				<tbody>
					{issueRows}
				</tbody>
			</table>
		)
	}
}
class IssueAdd extends React.Component {
	constructor(){
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(e){
		e.preventDefault();
		let form = document.forms.issueAdd;
		this.props.createIssue({
			owner: form.owner.value,
			title: form.title.value,
			status: 'New',
			created: new Date(),
		});
		form.owner.value = ""; form.title.value = "";
	}
	render() {
		return(
			<div>
				<form action="" name="issueAdd" onSubmit={this.handleSubmit}>
					<input type="text" name="owner" placeholder="Owner"/>
					<input type="text" name="title" placeholder="Title"/>
					<button >Add</button>
				</form>
			</div>
		);
	}
}
class IssueRow extends React.Component {
	render() {
		console.log("how many times the render() method called?");
		const issue = this.props.issue;
		return (
			<tr>
				<td>{issue.id}</td>
				<td>{issue.status}</td>
				<td>{issue.owner}</td>
				<td>{issue.created.toDateString()}</td>
				<td>{issue.effort}</td>
				<td>{issue.completionDate ? issue.completionDate.toDateString() : ''}</td>
				<td>{issue.title}</td>
			</tr>
		);
	}
}
class IssueList extends React.Component {
	constructor(){
		super();
		this.state = { issues: [] };
		this.createIssue = this.createIssue.bind(this);
	}
	componentDidMount(){
		this.loadData();
	}
	loadData() {
		setTimeout(() => {
			this.setState({issues:issues});
		}, 500);
	}
	createIssue(newIssue){
		const newIssues = this.state.issues.slice();
		newIssue.id = this.state.issues.length + 1;
		newIssues.push(newIssue);
		this.setState({ issues: newIssues });
	}
	
	render() {
		return(
			<div>
				<h1>Issue Tracker</h1>
				<IssueFilter />
				<hr/>
				<IssueTable issues = {this.state.issues}/>
				<hr/>
				<IssueAdd createIssue={this.createIssue} />
			</div>
		);
	}
}
//const continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
//const message = continents.map(c => `Hello ${c}! ` ).join(' ');

//const component = <p>{message}</p>;

ReactDOM.render(<IssueList/>, contentNode);