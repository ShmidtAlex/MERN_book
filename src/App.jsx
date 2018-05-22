

const contentNode = document.getElementById('contents');

class IssueFilter extends React.Component {
	render() {
		return(
			<div>
				<div>This is placeholder for  the Issue Filter</div>
			</div>
		);
	}
}
// use arrow function for description statles components this way
const IssueRow = (props) => (
	<tr>
		<td>{props.issue.id}</td>
		<td>{props.issue.status}</td>
		<td>{props.issue.owner}</td>
		<td>{props.issue.created.toDateString()}</td>
		<td>{props.issue.effort}</td>
		<td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : ''}</td>
		<td>{props.issue.title}</td>
	</tr>
)
//or this way
// const IssueRow = (props) => {
// 	return (
// 	<tr>
// 		<td>{props.issue.id}</td>
// 		<td>{props.issue.status}</td>
// 		<td>{props.issue.owner}</td>
// 		<td>{props.issue.created.toDateString()}</td>
// 		<td>{props.issue.effort}</td>
// 		<td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : ''}</td>
// 		<td>{props.issue.title}</td>
// 	</tr>
// )
function IssueTable(props) {
	const issueRows = props.issues.map(issue => <IssueRow key={issue.id} issue={issue} />);
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
class IssueAdd extends React.Component {
	constructor(){
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(e){
		//it prevents sending new data from form fields to server and reloading the page
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
		)
	}
}
// some changes in app for checking nodemon

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

ReactDOM.render(<IssueList/>, contentNode);