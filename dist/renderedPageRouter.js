'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _HelloWorld = require('../src/HelloWorld.jsx');

var _HelloWorld2 = _interopRequireDefault(_HelloWorld);

var _template = require('./template.js');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderedPageRouter = new _express2.default();

renderedPageRouter.get('*', function (req, res) {
  var html = (0, _server.renderToString)(_react2.default.createElement(_HelloWorld2.default, null));
  res.send((0, _template2.default)(html));
});
exports.default = renderedPageRouter;
//# sourceMappingURL=renderedPageRouter.js.map