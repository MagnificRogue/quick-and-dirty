var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('twitter-api/index', { title: 'Twitter API Viewer' ,
                                    endpoints: ['twitter/search/tweets', 'twitter/statuses/user_timeline']
                                    });
});

router.get('/search/tweets', function(req, res, next){
  var requestParams = require('./searchTweetsParams'); 
  res.render('twitter-api/searchTweets', {title: 'Search Tweets', params: requestParams});
});

router.get('/statuses/user_timeline', function(req, res, next){
  var requestParams = require('./userTimelineParams');
  res.render('twitter-api/usertimeline',{title: 'User Timeline', params: requestParams});
})

function getAccessToken(callback){

  var authorization = {
    consumerKey : config.twitter.consumer_key,
    consumerSecret : config.twitter.consumer_secret,
    bearerTokenCredentials : config.twitter.consumer_key + ':' + config.twitter.consumer_secret,
  }

  var encoding = new Buffer(authorization.bearerTokenCredentials).toString('base64');


  var options = {
    method: 'POST',
    uri:'https://api.twitter.com/oauth2/token',
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
      "Authorization": 'Basic ' + encoding 
    },
    body: 'grant_type=client_credentials'
  };

  request(options, function(error, response, body){
    if(error) {
      callback(error);
    }

    if(response && response.statusCode == 200) {
      callback(response);
    } 
  });

}


function getTweets(uri, accessToken, query, callback){
  var options = {
    method: 'GET',
    uri: uri,
    headers: {
      'Authorization': 'Bearer ' + accessToken 
    }
  };

  for( var key in query){
    if(query.hasOwnProperty(key) && query[key]){
      //check to see if we have to put & for additional parameters, kind've sloppy
        
        var value = query[key] !== 'on' ? query[key] : 'true';

        options.uri +=  key + "=" + encodeURIComponent(value) + '&'; 
    }
  }


  request(options, function(error, response, body){

    if(error) {
      callback(error);
    }
    
    if(response) {
      callback(response); 
    }
  });


}


router.post('/search/tweets', function(req, res, next){
  getAccessToken(function(response){
    getTweets('https://api.twitter.com/1.1/search/tweets.json?', JSON.parse(response.body).access_token, req.body, function(tweets){
      res.render('twitter-api/viewTweets', {'tweets': JSON.parse(tweets.body).statuses});
    });
  });
});

router.post('/statuses/user_timeline', function(req, res, next){
  getAccessToken(function(response){
    getTweets('https://api.twitter.com/1.1/statuses/user_timeline.json?', JSON.parse(response.body).access_token, req.body, function(tweets){
      res.render('twitter-api/viewTweets', {'tweets': JSON.parse(tweets.body).statuses});       
    });
  });
});



module.exports = router;
