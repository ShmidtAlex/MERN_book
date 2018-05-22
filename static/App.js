'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var contentNode = document.getElementById('contents');

var IssueFilter = function (_React$Component) {
	_inherits(IssueFilter, _React$Component);

	function IssueFilter() {
		_classCallCheck(this, IssueFilter);

		return _possibleConstructorReturn(this, (IssueFilter.__proto__ || Object.getPrototypeOf(IssueFilter)).apply(this, arguments));
	}

	_createClass(IssueFilter, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					null,
					'This is placeholder for  the Issue Filter'
				)
			);
		}
	}]);

	return IssueFilter;
}(React.Component);
// use arrow function for description statles components this way


var IssueRow = function IssueRow(props) {
	return React.createElement(
		'tr',
		null,
		React.createElement(
			'td',
			null,
			props.issue.id
		),
		React.createElement(
			'td',
			null,
			props.issue.status
		),
		React.createElement(
			'td',
			null,
			props.issue.owner
		),
		React.createElement(
			'td',
			null,
			props.issue.created.toDateString()
		),
		React.createElement(
			'td',
			null,
			props.issue.effort
		),
		React.createElement(
			'td',
			null,
			props.issue.completionDate ? props.issue.completionDate.toDateString() : ''
		),
		React.createElement(
			'td',
			null,
			props.issue.title
		)
	);
};
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
	var issueRows = props.issues.map(function (issue) {
		return React.createElement(IssueRow, { key: issue.id, issue: issue });
	});
	return React.createElement(
		'table',
		{ className: 'bordered-table' },
		React.createElement(
			'thead',
			null,
			React.createElement(
				'tr',
				null,
				React.createElement(
					'th',
					null,
					'Id'
				),
				React.createElement(
					'th',
					null,
					'Status'
				),
				React.createElement(
					'th',
					null,
					'Owner'
				),
				React.createElement(
					'th',
					null,
					'Created'
				),
				React.createElement(
					'th',
					null,
					'Effort'
				),
				React.createElement(
					'th',
					null,
					'Completion date'
				),
				React.createElement(
					'th',
					null,
					'Title'
				)
			)
		),
		React.createElement(
			'tbody',
			null,
			issueRows
		)
	);
}

var IssueAdd = function (_React$Component2) {
	_inherits(IssueAdd, _React$Component2);

	function IssueAdd() {
		_classCallCheck(this, IssueAdd);

		var _this2 = _possibleConstructorReturn(this, (IssueAdd.__proto__ || Object.getPrototypeOf(IssueAdd)).call(this));

		_this2.handleSubmit = _this2.handleSubmit.bind(_this2);
		return _this2;
	}

	_createClass(IssueAdd, [{
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			//it prevents sending new data from form fields to server and reloading the page
			e.preventDefault();
			var form = document.forms.issueAdd;
			this.props.createIssue({
				owner: form.owner.value,
				title: form.title.value,
				status: 'New',
				created: new Date()
			});
			form.owner.value = "";form.title.value = "";
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'form',
					{ action: '', name: 'issueAdd', onSubmit: this.handleSubmit },
					React.createElement('input', { type: 'text', name: 'owner', placeholder: 'Owner' }),
					React.createElement('input', { type: 'text', name: 'title', placeholder: 'Title' }),
					React.createElement(
						'button',
						null,
						'Add'
					)
				)
			);
		}
	}]);

	return IssueAdd;
}(React.Component);

var issues = [{
	id: 1, status: "Open", owner: "Alex", created: new Date('2018-05-17'), effort: 5,
	completionDate: undefined, title: "Error in console when clicking Add"
}, {
	id: 2, status: "Assigned", owner: "Olga", created: new Date('2018-05-01'), effort: 14,
	completionDate: new Date('2018-06-01'), title: "Missing bottom border on panel"
}];

var IssueList = function (_React$Component3) {
	_inherits(IssueList, _React$Component3);

	function IssueList() {
		_classCallCheck(this, IssueList);

		var _this3 = _possibleConstructorReturn(this, (IssueList.__proto__ || Object.getPrototypeOf(IssueList)).call(this));

		_this3.state = { issues: [] };
		_this3.createIssue = _this3.createIssue.bind(_this3);
		return _this3;
	}

	_createClass(IssueList, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.loadData();
		}
	}, {
		key: 'loadData',
		value: function loadData() {
			var _this4 = this;

			setTimeout(function () {
				_this4.setState({ issues: issues });
			}, 500);
		}
	}, {
		key: 'createIssue',
		value: function createIssue(newIssue) {
			var newIssues = this.state.issues.slice();
			newIssue.id = this.state.issues.length + 1;
			newIssues.push(newIssue);
			this.setState({ issues: newIssues });
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'h1',
					null,
					'Issue Tracker'
				),
				React.createElement(IssueFilter, null),
				React.createElement('hr', null),
				React.createElement(IssueTable, { issues: this.state.issues }),
				React.createElement('hr', null),
				React.createElement(IssueAdd, { createIssue: this.createIssue })
			);
		}
	}]);

	return IssueList;
}(React.Component);
//const continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
//const message = continents.map(c => `Hello ${c}! ` ).join(' ');

//const component = <p>{message}</p>;

ReactDOM.render(React.createElement(IssueList, null), contentNode);