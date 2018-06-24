exports.id = 0;
exports.modules = {

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _server = __webpack_require__(12);
	
	var _reactRouter = __webpack_require__(18);
	
	var _express = __webpack_require__(7);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _template = __webpack_require__(15);
	
	var _template2 = _interopRequireDefault(_template);
	
	var _Routes = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../src/Routes.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _Routes2 = _interopRequireDefault(_Routes);
	
	var _ContextWrapper = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../src/ContextWrapper.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _ContextWrapper2 = _interopRequireDefault(_ContextWrapper);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var renderedPageRouter = new _express2.default();
	
	renderedPageRouter.get('*', function (req, res) {
	  (0, _reactRouter.match)({ routes: _Routes2.default, location: req.url }, function (error, redirectLocation, renderProps) {
	    if (error) {
	      res.status(500).send(error.message);
	    } else if (redirectLocation) {
	      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
	    } else if (renderProps) {
	      fetch('http://localhost:3000/api' + req.url).then(function (response) {
	        return response.json();
	      }).then(function (data) {
	        var initialState = { data: data };
	        var html = (0, _server.renderToString)(_react2.default.createElement(
	          _ContextWrapper2.default,
	          { initialState: initialState },
	          _react2.default.createElement(_reactRouter.RouterContext, renderProps)
	        ));
	        res.status(200).send((0, _template2.default)(html, initialState));
	      }).catch(function (err) {
	        console.log('Error rendering to string: ' + err);
	      });
	    } else {
	      res.status(404).send('Not Found');
	    }
	  });
	});
	exports.default = renderedPageRouter;

/***/ }),

/***/ 18:
/***/ (function(module, exports) {

	module.exports = require("react-router");

/***/ })

};
//# sourceMappingURL=0.f1e031936169f9a4d5d8.hot-update.js.map