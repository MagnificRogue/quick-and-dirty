var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config');
var url = require('url');
var google = require('googleapis');

var youtube = google.youtube('v3');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('youtube-api/index', { title: 'Youbue API Viewer' ,
                                    endpoints: ['/youtube/search',
                                                ]
                                    });
});

/*
 * GET /search[params]
 * returns: Some youtube response I guess?
 */
router.get('/search', function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  
  if(!query.query){
    res.statusCode = 400;
    res.send(JSON.stringify({error: 'Parameter $query is required'}));
    return;
  }
  var response = youtube.search.list({
    part: 'snippet',
    q:query.query,
    key: config.youtube.api_key,
    maxResults: 50

  }, (error, data) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  });
});

module.exports = router;
