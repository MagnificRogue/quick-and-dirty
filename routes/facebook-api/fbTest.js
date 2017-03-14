var express = require('express');
var router = express.Router();
var os = require("os");
var request = require('request');
var Promise = require('promise');
var when = require('when');
var config = require('../config');
var MongoClient = require('mongodb').MongoClient;
var PythonShell = require('python-shell');

router.get('/',function(req,res,next){
	res.render('facebook-api/test',{title: 'exploring a friendly way of interacting with facebook API',
	url: '/test'});
});
router.post('/', (req, res, next) => {
	//console.log(req.body);
	var options = {
	  mode: 'text',
	  pythonPath:'',
	  pythonOptions: ['-u'],
	  scriptPath: 'C:/Users/chenwang/Documents/courses/SP17/php/quick-and-dirty-master/quick-and-dirty-master/routes/facebook-api',
	  args: [req.body['id'][0], req.body['id'][1]]
	};
	PythonShell.run('facebook-networkx.py', options, function(err, results) {
	  if (err) throw err;
	  console.log(results[0][1]);
	  subsequentCall(results[0][1]);
	});
});

var subsequentCall = function(hostname,call){
	var promise = new Promise((resolve,reject) => {
		var options = {
			method: 'GET',
			uri: 'http://localhost:3000/facebook/' + call,
			headers:{
				"Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
			},
		};
		
		request(options,function(error,response,body){
			if(error){
				reject(error);
			}
			if(response){
				resolve(response.body);
			}
		});
	});
	return promise;
}

module.exports = router;
