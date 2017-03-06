var express = require('express');
var router = express.Router();
var DB = require('../../bin/connectDB');
var url = require('url');
var config = require('../../config');
var FB = require('fb');
var Promise = require('promise');
var when = require('when');

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
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var promises = [];
  var fbData = [];
  //console.log(query.query);
  
  if(!query.query){
    res.statusCode = 400;
    res.send(JSON.stringify({error: 'Parameter $query is required'}));
    return;
  }
  
  var fbSearchPagePromise = fbSearchPage(query.query).then(function(data){
	  fbData.push(data);
  });
  promises.push(fbSearchPagePromise);

  var fbSearchUserPromise = fbSearchUser(query.query).then(function(data){
	  fbData.push(data);
  });
  promises.push(fbSearchUserPromise); 
  
  var fbSearchEventPromise = fbSearchEvent(query.query).then(function(data){
	  fbData.push(data);
  });
  promises.push(fbSearchEventPromise);
  
  var fbSearchGroupPromise = fbSearchGroup(query.query).then(function(data){
	  fbData.push(data);
  });
  promises.push(fbSearchGroupPromise);

  var fbSearchPlacePromise = fbSearchPlace(query.query).then(function(data){
	  fbData.push(data);
  });
  promises.push(fbSearchPlacePromise); 
  
  var fbSearchPtopicPromise = fbSearchPtopic(query.query).then(function(data){
	  fbData.push(data);
  });
  promises.push(fbSearchPtopicPromise);
  
  when.all(promises).then(function(){
	  res.setHeader('Content-Type','application/json');
	  res.send(JSON.stringify(fbData));
  });
});

/* user, page, event, group, place, placetopic */
var fbSearchUser = function(query){
	var promise = new Promise((resolve,reject) => {
		FB.api('search?q=' + query + '&type=user',function(fb){
			if(!fb || fb.error) {
				reject(fb.error);
			}else{
				resolve(fb.data);
			}
		  });
	});
	return promise;
}

var fbSearchPage = function(query){
	var promise = new Promise((resolve,reject) => {
		FB.api('search?q=' + query + '&type=page',(fb)=>{
			if(!fb || fb.error) {
				reject(fb.error);
			}else{
				resolve(fb.data);
			}
		  });
	});
	return promise;
}

var fbSearchEvent = function(query){
	var promise = new Promise((resolve,reject) => {
		FB.api('search?q=' + query + '&type=event',(fb)=>{
			if(!fb || fb.error) {
				reject(fb.error);
			}else{
				resolve(fb.data);
			}
		  });
	});
	return promise;
}

var fbSearchGroup = function(query){
	var promise = new Promise((resolve,reject) => {
		FB.api('search?q=' + query + '&type=group',(fb)=>{
			if(!fb || fb.error) {
				reject(fb.error);
			}else{
				resolve(fb.data);
			}
		  });
	});
	return promise;
}

var fbSearchPlace = function(query){
	var promise = new Promise((resolve,reject) => {
		FB.api('search?q=' + query + '&type=place',(fb)=>{
			if(!fb || fb.error) {
				reject(fb.error);
			}else{
				resolve(fb.data);
			}
		  });
	});
	return promise;
}

var fbSearchPtopic = function(query){
	var promise = new Promise((resolve,reject) => {
		FB.api('search?q=' + query + '&type=placetopic',(fb)=>{
			if(!fb || fb.error) {
				reject(fb.error);
			}else{
				resolve(fb.data);
			}
		  });
	});
	return promise;
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
