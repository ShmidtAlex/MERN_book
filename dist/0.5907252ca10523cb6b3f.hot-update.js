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
	
	var _reactRouter = __webpack_require__(13);
	
	var _express = __webpack_require__(7);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _template = __webpack_require__(14);
	
	var _template2 = _interopRequireDefault(_template);
	
	var _Routes = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../src/Routes.jsx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _Routes2 = _interopRequireDefault(_Routes);
	
	var _ContextWrapper = __webpack_require__(16);
	
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

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(19);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ContextWrapper = function (_React$Component) {
	  _inherits(ContextWrapper, _React$Component);
	
	  function ContextWrapper() {
	    _classCallCheck(this, ContextWrapper);
	
	    return _possibleConstructorReturn(this, (ContextWrapper.__proto__ || Object.getPrototypeOf(ContextWrapper)).apply(this, arguments));
	  }
	
	  _createClass(ContextWrapper, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return { initialState: this.props.initialState };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.props.children;
	    }
	  }]);
	
	  return ContextWrapper;
	}(_react2.default.Component);
	
	exports.default = ContextWrapper;
	
	ContextWrapper.childContextTypes = {
	  initialState: _propTypes2.default.object
	};
	ContextWrapper.propTypes = {
	  children: _propTypes2.default.object.isRequired,
	  initialState: _propTypes2.default.object
	};

/***/ }),

/***/ 19:
/***/ (function(module, exports) {

	module.exports = require("prop-types");

/***/ })

};
//# sourceMappingURL=0.5907252ca10523cb6b3f.hot-update.js.map