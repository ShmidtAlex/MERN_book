// var contentNode = document.getElementById("contents");
// var component = <div><h1>Hello, World!</h1> <div>some content</div></div>;
// 
//rewrite the above code with es2015 after installing corresponding babel-preset:

const contentNode = document.getElementById('contents');
const continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
const message = continents.map(c => `Hello ${c}! ` ).join(' ');

const component = <p>{message}</p>;

ReactDOM.render(component, contentNode);