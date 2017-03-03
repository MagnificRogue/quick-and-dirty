var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config');
var url = require('url');

const snoowrap = require('snoowrap');

/*const r = new snoowrap({
  userAgent: config.reddit.userAgent, 
  clientId: config.reddit.client_id, 
  clientSecret: config.reddit.client_secret,
  refreshToken: config.reddit.refreshToken
});*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('reddit-api/index', { title: 'Reddit API Viewer' ,
                                    endpoints: ['/reddit/hot',
                                                '/reddit/top',
                                                '/reddit/new/posts',
                                                '/reddit/new/comments',
                                                '/reddit/controversial',
                                                '/reddit/search',
                                                '/reddit/searchSubreddits',
                                                '/reddit/searchSubredditNames',
                                                '/reddit/searchSubredditTopics'
                                                ]
                                    });
});

/*
 * GET /hot[params]
 * returns: A listing object as json
 */
router.get('/hot', function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var subreddit = query.subreddit? query.subreddit : 'all';

  r.getHot(subreddit).then( (listing) => {

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(listing)); 

  });
 });

/*
 * GET /top[params]
 * returns: A listing object as json
 */
router.get('/top', function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  
  var subreddit = query.subreddit? query.subreddit : 'all';
  var sort = query.sort? query.sort : 'controversial';
  var time = query.time? query.time : 'day';

  r.getTop(subreddit, {sort:sort, time:time}).then( (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  });
 });

/*
 * GET /new/posts[params]
 * returns: A listing object as json
 */
router.get('/new/posts', function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  
  var subreddit = query.subreddit? query.subreddit : 'all';
  var sort = query.sort? query.sort : 'controversial';
  var time = query.time? query.time : 'day';

  r.getNew(subreddit, {sort:sort, time:time}).then( (listing) => {
    listing.fetchAll().then(function(data){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    })
  });
 });

router.get('/new/comments', (req, res, next) => {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  
  var subreddit = query.subreddit? query.subreddit : 'all';

  r.getNewComments(subreddit, {limit:1000}).then( (listing) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(listing));
  });

});

/*
 * GET /controversial[params]
 * returns: A listing object as json
 */
router.get('/controversial', function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  
  var subreddit = query.subreddit? query.subreddit : 'all';
  var sort = query.sort? query.sort : 'controversial';
  var time = query.time? query.time : 'day';

  r.getControversial(subreddit, {sort:sort, time:time}).then( (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  });
 });

/*
 * GET /search/subredditTopis[params]
 * returns: An array of objects containing subreddit names as json 
 */
router.get('/search/subredditTopics', (req,res,next) =>{
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  if(!query.query){
    res.statusCode = 400;
    res.send(JSON.stringify({error: 'Parameter $query is required'}));
    return;
  }
  

  r.searchSubredditTopics({query:query.query}).then( (data) =>  {
    res.setHeader('Content-Type','application/json'); 
    res.send(JSON.stringify(data));
  });

});

/*
 * GET /search/subredditNames[params]
 * returns: An array of strings containg subreddit names
 */
router.get('/search/subredditNames', (req,res,next) =>{
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  if(!query.query){
    res.statusCode = 400;
    res.send(JSON.stringify({error: 'Parameter $query is required'}));
    return;
  }
  
  var nsfw = query.nsfw ? query.nsfw : false;

  r.searchSubredditNames({query:query.query, nsfw: nsfw}).then( (data) =>  {
    res.setHeader('Content-Type','application/json'); 
    res.send(JSON.stringify(data));
  });
});

/*
 * GET /search/subreddits[params]
 * returns: An array of strings containg subreddit names
 */
router.get('/search/subreddits', (req,res,next) =>{
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  if(!query.query){
    res.statusCode = 400;
    res.send(JSON.stringify({error: 'Parameter $query is required'}));
    return;
  }
  
  r.searchSubreddits({query:query.query}).then( (listing) =>  {
    res.setHeader('Content-Type','application/json'); 
    listing.fetchAll().then( (data) => {
      res.send(JSON.stringify(data));
    })
  });
});




/*
 * GET /search[params]
 * returns: A listing object as json
 */
router.get('/search', (req,res,next) =>{
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  if(!query.query){
    res.statusCode = 400;
    res.send(JSON.stringify({error: 'Parameter $query is required'}));
    return;
  }

  var time = query.time? query.time : 'day';
  var subreddit = query.subreddit? query.subreddit : '';
  var restrictSr = query.restrictSr? query.restrictSr: true;
  var sort = query.sort? query.sort : 'relevance';
  var syntax = query.syntax? query.syntax : 'plain';

  r.search({
    query: query.query,
    time: time,
    subreddit: subreddit,
    restrictSr: restrictSr,
    sort: sort,
    syntax: syntax
  }).then( (listing) => {
    listing.fetchAll().then( (data) => {
      res.setHeader('Content-Type','application/json');
      res.send(JSON.stringify(listing));
    })
  });
});


module.exports = router;
