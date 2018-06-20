import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import HelloWorld from '../src/HelloWorld.jsx';

const contentNode = document.getElementById('contents');

ReactDom.render(<HelloWorld />, contentNode);

if (module.hot) {
  module.hot.accept();
}