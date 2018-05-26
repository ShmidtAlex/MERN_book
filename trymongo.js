'use strict'
//the goal of this file is testing four different ways of async
//calls: Callback paradigm, Promises paradigm, Generator paradigm and Async module
const MongoClient = require('mongodb');

function usage(){
	console.log('Usage :');
	console.log('node', __filename, '<option>');
	console.log('Where option is one of: ');
	console.log(' callbacks  Use the callbacks paradigm ');
	console.log(' promises  Use the Promises paradigm ');
	console.log(' generator  Use the Generator paradigm ');
	console.log(' async  Use the async module ');
}
if (process.argv.length < 3) {
	console.log("Incorrect number of arguments");
	usage();
} else {
	if (process.argv[2] === 'callbacks') {
		testWithCallback();
	} else if (process.argv[2] === 'promises') {
		testWithPromises();
	} else if (process.argv[2] === 'generator') {
		testWithGenerator();
	} else if (process.argv[2] === 'async') {
		testWithAsync();
	} else {
		console.log("Invalid option: ", process.argv[2]);
		usage();
	}
}
//Callback paradigm
function testWithCallbacks() {
	MongoClient.connect('mongodb://localhost/IssueTracker', function(err, db) {
		db.collection("issues").insertOne({id: 1, name: 'A.Callback'}, 
		function(err, result) {
			console.log("result of insert: ", result.insertedId);
			db.collection('issues').find({id: 1}).toArray(function(err, docs) {
				console.log('Result of find:', docs);
				db.close();
			});
		});
	});
}
//Promises paradigm
function testWithPromises () {
	let db;
	MongoClient.connect('mongodb://localhost/IssueTracker').then(connection => {
		db = connection;
		return db.collection("issues")....insertOne({ id: 1, name: 'B. Promises'});
	}).then(result => {
		console.log("Result of insert:", resulg.insertedId);
		return db.collection("issues").find({id: 1}).toArray();
	}).then(docs => {
		console.log("Result of find: ", docs);
		db.close();
	})catch(err => {
		console.log('ERROR', err);
	});
}
//Generator and co Module paradigm (needed to install npm co)
function testWithGenerator () {
	const co = require('co');
	co(function*(){
		const db = yield MongoClient.connect('mongodb://localhost/IssueTracker');
		const result = yield db.collection("issues")...insertOne({id: 1, name: 'C. Generator'});
		console.log("Result of insert: ", result.insertedId);
		const docs = yield db.collection('issues').find({id: 1}).toArray();
		console.log("Result of find: ", docs);
		db.close();
	}).catch(err => {
		console.log("ERROR", err);
	});
}
//Async module paradigm (needed to install npm async)
function testWithAsync() {
	const async = require('async');
	let db;
	async.waterfall([
		next => {
			MongoClient.connect('mongodb://localhost/IssueTracker', next);
		},
		(connection, next) => {
			db.connection;
			db.collection('issues').insertOne({id: 1, name: 'D. Async'}, next);
		},
		(insertResult, next) => {
			console.log('Insert result: ', insertResult.insertedId);
			db.collection('issues').find({id: 1}).toArray(next);
		},
		(docs, next) => {
			console.log('Result of find:', docs);
			db.close();
			next(null, 'All done');
		}
	], (err, result) => {
		if (err) {
			console.log("ERROR", err);
		} else {
			console.log(result);
		}
	});
}