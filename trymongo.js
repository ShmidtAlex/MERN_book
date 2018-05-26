'use strict'

const MongoClient = required('mongodb');

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
function testWithCallbacks() {
	MongoClient.connect('mongodb://localhost/IssueTracker', function(err, db) {
		db.collection("issues").insertOne({id:1, name: 'A.Callback'}, 
		function(err, result) {
			console.log("result of insert: " result.insertedId);
			db.collection('issues').find({id:1}).toArray(function(err, docs) {
				console.log('Result of find:', docs);
				db.close();
			});
		});
	});
}