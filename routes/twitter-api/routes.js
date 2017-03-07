var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config');
var DB = require('../../bin/connectDB');
var url = require('url');
var Promise = require('promise');
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
                                    endpoints: ['twitter/account/settings',				'twitter/account/verify_credentials',
												'twitter/application/rate_limit_status','twitter/blocks/ids',
												'twitter/blocks/list',					'twitter/collections/entries', 
												'twitter/collections/list',				'twitter/collections/show',
												'twitter/direct_messages',				'twitter/direct_messages/sent',
												'twitter/direct_messages/show',			'twitter/favorites/list',
												'twitter/followers/ids',				'twitter/followers/list',
												'twitter/friends/ids',					'twitter/friends/list',
												'twitter/friendships/incoming',			'twitter/friendships/lookup',
												'twitter/friendships/no_retweets/ids',  'twitter/friendships/outgoing',
												'twitter/friendships/show',
												'twitter/search', 
												'twitter/user_timeline',				'twitter/result']
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
	twitterPost(req, 'account/verify_credentials').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* application/rate_limit_status */
router.get('/application/rate_limit_status',function(req,res,next){
	var requestParams = require('./params/rateLimitParams');
	res.render('twitter-api/paramForm',{title:'returns the current rate limits for methods belonging to the specified resource families.',
										url: '/twitter/application/rate_limit_status',
										params: requestParams});
});
router.post('/application/rate_limit_status',function(req,res,next){
	twitterPost(req, 'application/rate_limit_status').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* blocks/ids */
router.get('/blocks/ids',function(req,res,next){
	var requestParams = require('./params/blocksIdsParams');
	res.render('twitter-api/paramForm',{title:'Returns an array of numeric user ids the authenticating user is blocking.',
										url: '/twitter/blocks/ids',
										params: requestParams});
});
router.post('/blocks/ids',function(req,res,next){
	twitterPost(req, 'blocks/ids').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* blocks/list */
router.get('/blocks/list',function(req,res,next){
	var requestParams = require('./params/blocksListParams');
	res.render('twitter-api/paramForm',{title:'Returns a collection of user objects that the authenticating user is blocking.',
										url: '/twitter/blocks/list',
										params: requestParams});
});
router.post('/blocks/list',function(req,res,next){
	twitterPost(req, 'blocks/list').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* collections/entries */
router.get('/collections/entries',function(req,res,next){
	var requestParams = require('./params/colEntriesParams');
	res.render('twitter-api/paramForm',{title:'Retrieve the identified Collection, presented as a list of the Tweets curated within.',
										url: '/twitter/collections/entries',
										params: requestParams});
});
router.post('/collections/entries',function(req,res,next){
	twitterPost(req, 'collections/entries').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* collections/list */
router.get('/collections/list',function(req,res,next){
	var requestParams = require('./params/colListParams');
	res.render('twitter-api/paramForm',{title:'Find Collections created by a specific user or containing a specific curated Tweet.',
										url: '/twitter/collections/list',
										params: requestParams});
});
router.post('/collections/list',function(req,res,next){
	twitterPost(req, 'collections/list').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* collections/show */
router.get('/collections/show',function(req,res,next){
	var requestParams = require('./params/colShowParams');
	res.render('twitter-api/paramForm',{title:'Retrieve information associated with a specific Collection.',
										url: '/twitter/collections/show',
										params: requestParams});
});
router.post('/collections/show',function(req,res,next){
	twitterPost(req, 'collections/show').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* direct_messages  needs direct message permission */
router.get('/direct_messages',function(req,res,next){
	var requestParams = require('./params/dirMessagesParams');
	res.render('twitter-api/paramForm',{title:'Returns the 20 most recent direct messages sent to the authenticating user.',
										url: '/twitter/direct_messages',
										params: requestParams});
});
router.post('/direct_messages',function(req,res,next){
	twitterPost(req, 'direct_messages').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* direct_messages/sent needs direct message permission */
router.get('/direct_messages/sent',function(req,res,next){
	var requestParams = require('./params/dirMessagesSentParams');
	res.render('twitter-api/paramForm',{title:'Returns the 20 most recent direct messages sent by the authenticating user.',
										url: '/twitter/direct_messages/sent',
										params: requestParams});
});
router.post('/direct_messages/sent',function(req,res,next){
	twitterPost(req, 'direct_messages/sent').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* direct_messages/show needs direct message permission */
router.get('/direct_messages/show',function(req,res,next){
	var requestParams = require('./params/dirMessagesShowParams');
	res.render('twitter-api/paramForm',{title:'Returns a single direct message, specified by an id parameter.',
										url: '/twitter/direct_messages/show',
										params: requestParams});
});
router.post('/direct_messages/show',function(req,res,next){
	twitterPost(req, 'direct_messages/show').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* favorites/list */
router.get('/favorites/list',function(req,res,next){
	var requestParams = require('./params/favListParams');
	res.render('twitter-api/paramForm',{title:'Returns the 20 most recent Tweets favorited by the authenticating or specified user.',
										url: '/twitter/favorites/list',
										params: requestParams});
});
router.post('/favorites/list',function(req,res,next){
	twitterPost(req, 'favorites/list').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* followers/ids */
router.get('/followers/ids',function(req,res,next){
	var requestParams = require('./params/followersIdsParams');
	res.render('twitter-api/paramForm',{title:'Returns a cursored collection of user IDs for every user following the specified user.',
										url: '/twitter/followers/ids',
										params: requestParams});
});
router.post('/followers/ids',function(req,res,next){
	twitterPost(req, 'followers/ids').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* followers/list */
router.get('/followers/list',function(req,res,next){
	var requestParams = require('./params/followersListParams');
	res.render('twitter-api/paramForm',{title:'Returns a cursored collection of user objects for users following the specified user.',
										url: '/twitter/followers/list',
										params: requestParams});
});
router.post('/followers/list',function(req,res,next){
	twitterPost(req, 'followers/list').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* friends/ids */
router.get('/friends/ids',function(req,res,next){
	var requestParams = require('./params/friendsIdsParams');
	res.render('twitter-api/paramForm',{title:'Returns a cursored collection of user IDs for every user the specified user is following.',
										url: '/twitter/friends/ids',
										params: requestParams});
});
router.post('/friends/ids',function(req,res,next){
	twitterPost(req, 'friends/ids').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* friends/list */
router.get('/friends/list',function(req,res,next){
	var requestParams = require('./params/friendsListParams');
	res.render('twitter-api/paramForm',{title:'Returns a cursored collection of user objects for every user the specified user is following',
										url: '/twitter/friends/list',
										params: requestParams});
});
router.post('/friends/list',function(req,res,next){
	twitterPost(req, 'friends/list').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* friendships/incoming */
router.get('/friendships/incoming',function(req,res,next){
	var requestParams = require('./params/friendshipsIncParams');
	res.render('twitter-api/paramForm',{title:'Returns a collection of numeric IDs for every user who has a pending request to follow the authenticating user.',
										url: '/twitter/friendships/incoming',
										params: requestParams});
});
router.post('/friendships/incoming',function(req,res,next){
	twitterPost(req, 'friendships/incoming').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* friendships/lookup */
router.get('/friendships/lookup',function(req,res,next){
	var requestParams = require('./params/friendshipsLookupParams');
	res.render('twitter-api/paramForm',{title:'Returns the relationships of the authenticating user to the comma-separated list of up to 100 screen_names or user_ids provided.',
										url: '/twitter/friendships/lookup',
										params: requestParams});
});
router.post('/friendships/lookup',function(req,res,next){
	twitterPost(req, 'friendships/lookup').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* friendships/no_retweets/ids */
router.get('/friendships/no_retweets/ids',function(req,res,next){
	var requestParams = require('./params/friendshipsIdsParams');
	res.render('twitter-api/paramForm',{title:'Returns a collection of user_ids that the currently authenticated user does not want to receive retweets from.',
										url: '/twitter/friendships/no_retweets/ids',
										params: requestParams});
});
router.post('/friendships/no_retweets/ids',function(req,res,next){
	twitterPost(req, 'friendships/no_retweets/ids').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* friendships/outgoing different endpoint .format*/
router.get('/friendships/outgoing',function(req,res,next){
	var requestParams = require('./params/friendshipsOutParams');
	res.render('twitter-api/paramForm',{title:'Returns a collection of user_ids that the currently authenticated user does not want to receive retweets from.',
										url: '/twitter/friendships/outgoing',
										params: requestParams});
});
router.post('/friendships/outgoing',function(req,res,next){
	twitterPost(req, 'friendships/outgoing').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* friendships/show */
router.get('/friendships/show',function(req,res,next){
	var requestParams = require('./params/friendshipsShowParams');
	res.render('twitter-api/paramForm',{title:'Returns detailed information about the relationship between two arbitrary users.',
										url: '/twitter/friendships/show',
										params: requestParams});
});
router.post('/friendships/show',function(req,res,next){
	twitterPost(req, 'friendships/show').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongodb?
	});	
});

/* generic twitter Post */
twitterPost = function(req,base_url){
	var promise = new Promise((resolve, reject) => {
		// interpret and sort the paramters in order to fit twitter library
		for (var key in req.body){
			if (req.body[key] === 'on'){
				req.body[key] = 'true';
			}
			if (req.body[key] === ''){
				delete req.body[key];
			}
		}
		console.log(req.body);
		// e.g. base_url = 'friends/ids'
		client.get(base_url,req.body, function(error,tweets,response){
			if(error) reject(error);
			resolve(tweets);
		});
	});
	return promise;	
}

module.exports = router;
