// var contentNode = document.getElementById("contents");
// var component = <div><h1>Hello, World!</h1> <div>some content</div></div>;
// 
//rewrite the above code with es2015 after installing corresponding babel-preset:

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
class IssueTable extends React.Component {
	render() {
		const borderedStyle = {border:"1px solid silver", padding: 6};
		return(
			<table style={{borderCollapse: "collapse"}}>
				<thead>
					<tr>
						<th style={borderedStyle}>Id</th>
						<th style={borderedStyle}>Title</th>
					</tr>
				</thead>
				<tbody>
					<IssueRow issue_id={1}>
						Error in console when clicking Add
					</IssueRow>
					<IssueRow issue_id={2}>
						 Missing bottom <b>border</b> on panel
					</IssueRow>
				</tbody>
			</table>
		)
	}
}
class IssueAdd extends React.Component {
	render() {
		return(
			<div>
				<div>This is placeholder for Issue Adding</div>
			</div>
		);
	}
}
class IssueRow extends React.Component {
	render() {
		const borderedStyle = {border: "1px solid silver", padding: 4};
		return (
			<tr>
				<td style={borderedStyle}>{this.props.issue_id}</td>
				<td style={borderedStyle}>{this.props.issue_title}</td>
			</tr>
		);
	}
}
class IssueList extends React.Component {
	render() {
		return(
			<div>
				<h1>Issue Tracker</h1>
				<IssueFilter />
				<IssueTable />
				<IssueAdd />
			</div>
		);
	}
}
//const continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
//const message = continents.map(c => `Hello ${c}! ` ).join(' ');

//const component = <p>{message}</p>;

ReactDOM.render(<IssueList/>, contentNode);