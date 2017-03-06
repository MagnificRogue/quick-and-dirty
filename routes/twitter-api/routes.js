var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config');
var DB = require('../../bin/connectDB');
var url = require('url');
var Twitter = require('twitter');
var client = new Twitter({
			consumer_key:config.twitter.consumer_key,
			consumer_secret:config.twitter.consumer_secret,
			access_token_key:config.twitter.access_token_key,
			access_token_secret:config.twitter.access_token_secret
		})

/* home page. */
router.get('/', function(req, res, next) {
  res.render('twitter-api/index', { title: 'Twitter API Viewer' ,
                                    endpoints: ['twitter/account/settings',
												'twitter/account/verify_credentials',
												'twitter/search', 
												'twitter/user_timeline',
												'twitter/result']
                                    });
});

/* search tweets by keyword */
router.get('/search', function(req, res, next){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  
  if(!query.query){
    res.statusCode = 400;
    res.send(JSON.stringify({error: 'Parameter $query is required'}));
    return;
  }
  var response = client.get('search/tweets',{'q':query.query},(error,tweets)=>{
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(tweets.statuses));			
			});
});

/* account/settings */
router.get('/account/settings',function(req,res,next){
	client.get('account/settings',{}, function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(tweets));
			//mongoDB
		});
});

/* account/verify_credential */
router.get('/account/verify_credentials',function(req,res,next){
	var requestParams = require('./params/credentialsParams');
	res.render('twitter-api/paramForm',{title:'testing if authentication of the requesting user is successful or not',
										url: '/twitter/account/verify_credentials',
										params: requestParams});
});
router.post('/account/verify_credentials',function(req,res,next){
	for (var key in req.body){
		if (req.body[key] === 'on'){
			req.body[key] = 'true';
		}
	}
	console.log(req.body);
	client.get('account/verify_credentials',req.body, function(error,tweets,response){
		if(error) throw JSON.stringify(error);
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoDB
	});
});

/* user_timeline 
router.get('/user_timeline',function(req, res, next){
  var requestParams = require('./userTimelineParams'); 
  res.render('twitter-api/userTimeline', {title: 'Render User Timeline', params: requestParams});
});

router.post('/user_timeline', function(req, res, next){
    //console.log(req.body);
	twtTimeline(req);
});

var twtTimeline = function(req){
		client.get('statuses/user_timeline',req.body, function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			DB.removeJson('twitter');
			DB.storeJson('twitter',tweets);
			// connect to a mongo db a dump the return json into it;
		});
} */

/* present data 
router.get('/result',function(req,res,next){
	var MongoClient = require('mongodb').MongoClient, assert = require('assert');
	var url = config.mongo.url;
	MongoClient.connect(url, function (err, db) {
		if (err) {
					console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
					console.log('connected to fetch data');
					db.collection('twitter', function(err, collection1) {
						collection1.find().toArray(function(err, twts) {
							res.render('twitter-api/viewResults', {'twitter':twts});
							db.close();
							});
						});
				}
	});
}); */


module.exports = router;
