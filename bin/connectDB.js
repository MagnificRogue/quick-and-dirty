var config = require('../config');

// connect to database and insert documents
var storeJson = function(collection_name,arrayOfJson){
	var MongoClient = require('mongodb').MongoClient, assert = require('assert');
	var url = config.mongo.url;
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected correctly to server");
	  //removeCollection(db,collection_name,function(){
		insertDocuments(db,collection_name, function(){
			db.close(); 
			});
	 // });
	});

	// insert
	var insertDocuments = function(db,collection_name,callback){
		var collection = db.collection(collection_name);
		collection.insertMany(arrayOfJson, function(err,result){
						assert.equal(err,null);
						console.log("Insert " +result.ops.length+" docs into the "+collection_name+" collection");
						callback(result);
					 });
	}
	// remove collection
	var removeCollection = function(db,collection_name,callback){
		var collection = db.collection(collection_name);
		collection.remove({},function(err,result){
			assert.equal(err,null);
			console.log("remove the whole collection: "+collection_name);
			callback();
		});
	};
}

//remove all
var removeJson = function(collection_name){
	var MongoClient = require('mongodb').MongoClient, assert = require('assert');
	var url = config.mongo.url;
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected correctly to server");
	  removeCollection(db,collection_name, function(){ db.close(); });
	});

	var removeCollection = function(db,collection_name,callback){
		var collection = db.collection(collection_name);
		collection.remove({},function(err,result){
			assert.equal(err,null);
			console.log("remove the whole collection");
			callback();
		});
	};
}


module.exports = {storeJson,removeJson};