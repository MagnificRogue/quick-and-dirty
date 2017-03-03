var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config');
var DB = require('../../bin/connectDB');

/* home page. */
router.get('/', function(req, res, next) {
  res.render('twitter-api/index', { title: 'Twitter API Viewer' ,
                                    endpoints: ['twitter/search', 'twitter/user_timeline','twitter/result']
                                    });
});

/* search tweets by keyword */
router.get('/search', function(req, res, next){
  var requestParams = require('./twitterSearchParams'); 
  res.render('twitter-api/searchTweets', {title: 'keyword Search', params: requestParams});
});

router.post('/search', function(req, res, next){
	//console.log(req.body);
	twtSearch(req);
});

var twtSearch = function(req){
	var Twitter = require('twitter');
		var client = new Twitter({
			consumer_key:config.twitter.consumer_key,
			consumer_secret:config.twitter.consumer_secret,
			access_token_key:config.twitter.access_token_key,
			access_token_secret:config.twitter.access_token_secret
		})
		client.get('search/tweets',req.body,function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			DB.removeJson('twitter');
			DB.storeJson('twitter',tweets.statuses);
			// connect to a mongo db a dump the return json into it;
		});
}


/* user_timeline */
router.get('/user_timeline',function(req, res, next){
  var requestParams = require('./userTimelineParams'); 
  res.render('twitter-api/userTimeline', {title: 'Render User Timeline', params: requestParams});
});

router.post('/user_timeline', function(req, res, next){
    //console.log(req.body);
	twtTimeline(req);
});

var twtTimeline = function(req){
	var Twitter = require('twitter');
		var client = new Twitter({
			consumer_key:config.twitter.consumer_key,
			consumer_secret:config.twitter.consumer_secret,
			access_token_key:config.twitter.access_token_key,
			access_token_secret:config.twitter.access_token_secret
		})
		client.get('statuses/user_timeline',req.body, function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			DB.removeJson('twitter');
			DB.storeJson('twitter',tweets);
			// connect to a mongo db a dump the return json into it;
		});
}

/* present data */
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
});


module.exports = router;
