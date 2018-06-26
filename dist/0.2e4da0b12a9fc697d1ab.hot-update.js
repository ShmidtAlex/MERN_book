exports.id = 0;
exports.modules = [
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _sourceMapSupport = __webpack_require__(2);
	
	var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);
	
	__webpack_require__(3);
	
	var _http = __webpack_require__(4);
	
	var _http2 = _interopRequireDefault(_http);
	
	var _mongodb = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_sourceMapSupport2.default.install();
	
	
	var appModule = __webpack_require__(6);
	var db = void 0;
	var server = void 0;
	
	_mongodb.MongoClient.connect('mongodb://localhost/IssueTracker').then(function (connection) {
	  db = connection;
	  server = _http2.default.createServer();
	  appModule.setDb(db);
	  server.on('request', appModule.app);
	  server.listen(3000, function () {
	    console.log('Appstarted on port 3000');
	  });
	}).catch(function (error) {
	  console.log('ERROR:', error);
	});
	if (true) {
	  module.hot.accept(6, function () {
	    server.removeListener('request', appModule.app);
	    appModule = __webpack_require__(6);
	    appModule.setDb(db);
	    server.on('request', appModule.app);
	  });
	}

/***/ })
];
//# sourceMappingURL=0.2e4da0b12a9fc697d1ab.hot-update.js.map