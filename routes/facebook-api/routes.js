var express = require('express');
var router = express.Router();
var DB = require('../../bin/connectDB');

var config = require('../../config');
var FB = require('fb');
FB.options({version:'v2.8'});
FB.setAccessToken(config.fb.access_token); //token need to renew every 60 days!

/* home page. */
router.get('/', function(req, res, next) {
  res.render('facebook-api/index', { title: 'Facebook API Viewer' ,
                                    endpoints: ['facebook/search', 'facebook/feed','facebook/result',]
                                    });
});

/* keyword search */
router.get('/search', function(req, res, next){
  var requestParams = require('./fbSearchParams'); 
  res.render('facebook-api/keywordSearch', {title: 'keyword Search', params: requestParams});
});

router.post('/search', function(req, res, next){
		fbSearch(req);
		//res.render('facebook-api/viewResults',{'fbData':fbData});
});

var fbSearch = function(req){
	var base = 'search?q='+req.body['q']+'&type=';
	DB.removeJson('facebook');
	for (var key in req.body) {
		if (key != 'q'){
			var query=base + key;
						
			// fire a Fb query
			var FB = require('fb');
			FB.options({version:'v2.8'});
			FB.setAccessToken(config.fb.access_token); //token need to renew every 60 days!
			FB.api(query,function(res) {
				if(!res || res.error) {
					console.log(!res ? 'error occurred' : res.error);
					return;
				}else{
					//erase last time's result in database before firing up a new error
					DB.storeJson('facebook',res.data);
					//connect to a mongo db and dump the return json into it
				}
			});
		}
	}
}

/* get the feed given an id */
router.get('/feed', function(req, res, next){
  //var requestParams = require('./fbSearchParams'); 
  res.render('facebook-api/getFeed', {title: 'get Feed', params: null});
});

router.post('/feed', function(req, res, next){
		fbTimeline(req);
		//res.render('facebook-api/viewResults',{'fbData':fbData});
});

var fbTimeline = function(req){
	DB.removeJson('facebook');
	// fire a Fb query
	var query = '/'+req.body['id']+'/feed';
	var FB = require('fb');
	FB.options({version:'v2.8'});
	FB.setAccessToken(config.fb.access_token); //token need to renew every 60 days!
	FB.api(query,function(res) {
		if(!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return;
		}else{
			//console.log(res.data);
			DB.storeJson('facebook',res.data);
			}
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
					db.collection('facebook', function(err, collection1) {
						collection1.find().toArray(function(err, fbs) {
							res.render('facebook-api/viewResults', {'facebook':fbs});
							db.close();
							});
						});
				}
	});
});

module.exports = router;
