'use strict';

// var contentNode = document.getElementById("contents");
// var component = <div><h1>Hello, World!</h1> <div>some content</div></div>;
// 
//rewrite the above code with es2015 after installing corresponding babel-preset:

var contentNode = document.getElementById('contents');
var continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
var message = continents.map(function (c) {
  return 'Hello ' + c + '! ';
}).join(' ');

var component = React.createElement(
  'p',
  null,
  message
);

ReactDOM.render(component, contentNode);