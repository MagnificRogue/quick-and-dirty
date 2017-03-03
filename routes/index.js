var express = require('express');
var router = express.Router();
var os = require("os");
var request = require('request');
var Promise = require('promise');
var when = require('when');
var config = require('../config');
var MongoClient = require('mongodb').MongoClient;



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Social Sense API Query System',
                        providers:[
                          {name: 'Search', url:'/search'},
                          {name: 'Twitter', url:'/twitter'},
					      {name: 'Facebook', url:'/facebook'},
                          {name: 'Reddit', url:'/reddit'},         
                          {name: 'Youtube', url:'/youtube'} 
                        ]
                      });
});

router.get('/search', (req, res, next) => {
  res.render('search');
});

router.post('/search', (req, res, next) => {
	console.log(req.body.query);
  if(!req.body.query){
    res.statusCode = 400;
    res.send(JSON.stringify({error: 'Parameter $query is required'}));
    return;
  }

  var promises = [];
  var toReturn = {
    reddit: {},
    youtube: {}
  };

  var subredditsPromise = getSubreddits(req.headers.host, req.body.query).then(function(data){
    toReturn.reddit.subreddits = JSON.parse(data);
  });
  promises.push(subredditsPromise);

  var searchPostsPromise = getPosts(req.headers.host, req.body.query).then(function(data){
    toReturn.reddit.posts = JSON.parse(data);
  });
  promises.push(searchPostsPromise);

  var searchNewCommentsPromise = getNewComments(req.headers.host, req.body.query).then(function(data){
    toReturn.reddit.comments = JSON.parse(data);;
  });
  promises.push(searchNewCommentsPromise);

  var youtubeSearchPromise = getYoutubeSearch(req.headers.host, req.body.query).then(function(data){
    toReturn.youtube = JSON.parse(data); 
  });
  promises.push(youtubeSearchPromise);

  when.all(promises).then(function(){
      res.setHeader('Content-Type','application/json');
      res.send(JSON.stringify(toReturn)); 
  });

});

var getSubreddits = function(hostname, query){
  var promise = new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      uri: 'http://' + hostname + '/reddit/search/subreddits?query=' + query,
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    };

    request(options, function(error, response, body){
      if(error) {
        reject(error);
      }
      
      if(response) {
        resolve(response.body);
      }
      
    }); 
    
  });
  return promise;
}

var getPosts = function(hostname, query){
  var promise = new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      uri: 'http://' + hostname + '/reddit/search?query=' + query + '&time=day&sort=controversial',
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    };

    request(options, function(error, response, body){
      if(error) {
        reject(error);
      }
      
      if(response) {
        resolve(response.body);
      }
    }); 
    
  });
  return promise;
}

var getNewComments = function(hostname, query){
  var promise = new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      uri: 'http://' + hostname + '/reddit/new/comments',
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    };

    request(options, function(error, response, body){
      if(error) {
        reject(error);
      }
      
      if(response) {
        var data = JSON.parse(response.body);
        var toReturn = [];
        data.map( (comment) => {
          if (comment.body.indexOf(query) > -1) {
            toReturn.push(comment); 
          }
        });

        resolve(JSON.stringify(toReturn));

      }
    }); 
    
  });
  return promise;
}


var getYoutubeSearch = function(hostname, query){
  var promise = new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      uri: 'http://' + hostname + '/youtube/search?query=' + query,
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    };

    request(options, function(error, response, body){
      if(error) {
        reject(error);
      }
      
      if(response) {
        resolve(response.body);
      }
    }); 
    
  });
  return promise;
}









module.exports = router;
