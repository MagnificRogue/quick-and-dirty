var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../config');
var MongoClient = require('mongodb').MongoClient;
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
                                    endpoints: ['twitter/search', 
												'twitter/account/settings',				'twitter/account/verify_credentials',
												'twitter/application/rate_limit_status','twitter/blocks/ids',
												'twitter/blocks/list',					'twitter/collections/entries', 
												'twitter/collections/list',				'twitter/collections/show',
												'twitter/direct_messages',				'twitter/direct_messages/sent',
												'twitter/direct_messages/show',			'twitter/favorites/list',
												'twitter/followers/ids',				'twitter/followers/list',
												'twitter/friends/ids',					'twitter/friends/list',
												'twitter/friendships/incoming',			'twitter/friendships/lookup',
												'twitter/friendships/no_retweets/ids',  'twitter/friendships/outgoing',
												'twitter/friendships/show',				'twitter/geo/id/:place_id',
												'twitter/geo/reverse_geocode',			'twitter/geo/search',
												'twitter/help/configuration',			'twitter/help/languages',
												'twitter/help/privacy',					'twitter/help/tos',
												'twitter/lists/list',					'twitter/lists/members',
												'twitter/lists/members/show',			'twitter/lists/memberships',
												'twitter/lists/ownerships',				'twitter/lists/show',
												'twitter/lists/statuses',				'twitter/lists/subscribers',
												'twitter/lists/subscribers/show',		'twitter/lists/subscriptions',
												'twitter/mutes/users/ids',				'twitter/mutes/users/list',
												'twitter/saved_searches/list',			'twitter/saved_searches/show',
												'twitter/statuses/home_timeline',		'twitter/statuses/lookup',
												'twitter/statuses/mentions_timeline',	'twitter/statuses/retweeters/ids',
												'twitter/statuses/retweets',		'twitter/statuses/retweets_of_me',
												'twitter/statuses/show',			'twitter/statuses/user_timeline',
												'twitter/trends/available',				'twitter/trends/closest',
												'twitter/trends/place',					'twitter/users/lookup',
												'twitter/users/profile_banner',			'twitter/users/search',
												'twitter/users/show',					'twitter/users/suggestions',
												'twitter/users/suggestions/:slug',		'twitter/users/suggestions/:slug/members']
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
			//mongoStore(tweets);
		});
});

/* help/configuration */
router.get('/help/configuration',function(req,res,next){
	client.get('help/configuration',{}, function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(tweets));
			//mongoStore(tweets);
		});
});

/* help/languages */
router.get('/help/languages',function(req,res,next){
	client.get('help/languages',{}, function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(tweets));
			//mongoStore(tweets);
		});
});

/* help/privacy */
router.get('/help/privacy',function(req,res,next){
	client.get('help/privacy',{}, function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(tweets));
			//mongoStore(tweets);
		});
});

/* help/tos */
router.get('/help/tos',function(req,res,next){
	client.get('help/tos',{}, function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(tweets));
			//mongoStore(tweets);
		});
});

/* saved_searches/list */
router.get('/saved_searches/list',function(req,res,next){
	client.get('saved_searches/list',{}, function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(tweets));
			//mongoStore(tweets);
		});
});

/* trends/available */
router.get('/trends/available',function(req,res,next){
	client.get('trends/available',{}, function(error,tweets,response){
			if(error) throw JSON.stringify(error);
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(tweets));
			//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
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
		//mongoStore(tweets);
	});	
});

/* geo/id/:place_id (no response)*/
router.get('/geo/id/:place_id',function(req,res,next){
	var requestParams = require('./params/geoPlaceIdParams');
	res.render('twitter-api/paramForm',{title:'Returns all the information about a known place.',
										url: '/twitter/geo/id/:place_id',
										params: requestParams});
});
router.post('/geo/id/:place_id',function(req,res,next){
	twitterPost(req, 'geo/id/:place_id').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* geo/reverse_geocode */
router.get('/geo/reverse_geocode',function(req,res,next){
	var requestParams = require('./params/geoRcodeParams');
	res.render('twitter-api/paramForm',{title:'Given a latitude and a longitude, searches for up to 20 places that can be used as a place_id when updating a status.',
										url: '/twitter/geo/reverse_geocode',
										params: requestParams});
});
router.post('/geo/reverse_geocode',function(req,res,next){
	twitterPost(req, 'geo/reverse_geocode').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* geo/search */
router.get('/geo/search',function(req,res,next){
	var requestParams = require('./params/geoSearchParams');
	res.render('twitter-api/paramForm',{title:'Search for places that can be attached to a statuses/update.' 
											  +'Given a latitude and a longitude pair, an IP address, or a name,'+
											  'this request will return a list of all the valid places that can be' +
											  'used as the place_id when updating a status.',
										url: '/twitter/geo/search',
										params: requestParams});
});
router.post('/geo/search',function(req,res,next){
	twitterPost(req, 'geo/search').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/list (no response)*/
router.get('/lists/list',function(req,res,next){
	var requestParams = require('./params/listsListParams');
	res.render('twitter-api/paramForm',{title:'Returns all lists the authenticating or specified user subscribes to, including their own.',
										url: '/twitter/lists/list',
										params: requestParams});
});
router.post('/lists/list',function(req,res,next){
	twitterPost(req, 'lists/list').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/members (no response)*/
router.get('/lists/members',function(req,res,next){
	var requestParams = require('./params/listsMembersParams');
	res.render('twitter-api/paramForm',{title:'Returns the members of the specified list.',
										url: '/twitter/lists/members',
										params: requestParams});
});
router.post('/lists/members',function(req,res,next){
	twitterPost(req, 'lists/members').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/members/show (no response)*/
router.get('/lists/members/show',function(req,res,next){
	var requestParams = require('./params/listsMembersShowParams');
	res.render('twitter-api/paramForm',{title:'Check if the specified user is a member of the specified list.',
										url: '/twitter/lists/members/show',
										params: requestParams});
});
router.post('/lists/members/show',function(req,res,next){
	twitterPost(req, 'lists/members/show').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/memberships (no response)*/
router.get('/lists/memberships',function(req,res,next){
	var requestParams = require('./params/listsMembershipsParams');
	res.render('twitter-api/paramForm',{title:'Check if the specified user is a member of the specified list.',
										url: '/twitter/lists/memberships',
										params: requestParams});
});
router.post('/lists/memberships',function(req,res,next){
	twitterPost(req, 'lists/memberships').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/ownerships (no response)*/
router.get('/lists/ownerships',function(req,res,next){
	var requestParams = require('./params/listsOwnershipsParams');
	res.render('twitter-api/paramForm',{title:'Returns the lists owned by the specified Twitter user.',
										url: '/twitter/lists/ownerships',
										params: requestParams});
});
router.post('/lists/ownerships',function(req,res,next){
	twitterPost(req, 'lists/ownerships').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/show (no response)*/
router.get('/lists/show',function(req,res,next){
	var requestParams = require('./params/listsShowParams');
	res.render('twitter-api/paramForm',{title:'Returns the specified list.',
										url: '/twitter/lists/show',
										params: requestParams});
});
router.post('/lists/show',function(req,res,next){
	twitterPost(req, 'lists/show').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/statuses (no response)*/
router.get('/lists/statuses',function(req,res,next){
	var requestParams = require('./params/listsStatusesParams');
	res.render('twitter-api/paramForm',{title: 'Returns a timeline of tweets authored by members of the specified list.',
										url: '/twitter/lists/statuses',
										params: requestParams});
});
router.post('/lists/statuses',function(req,res,next){
	twitterPost(req, 'lists/statuses').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/subscribers (no response)*/
router.get('/lists/subscribers',function(req,res,next){
	var requestParams = require('./params/listsSubscribersParams');
	res.render('twitter-api/paramForm',{title: 'Returns the subscribers of the specified list. ',
										url: '/twitter/lists/subscribers',
										params: requestParams});
});
router.post('/lists/subscribers',function(req,res,next){
	twitterPost(req, 'lists/subscribers').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/subscribers/show (no response)*/
router.get('/lists/subscribers/show',function(req,res,next){
	var requestParams = require('./params/subscribersShowParams');
	res.render('twitter-api/paramForm',{title: 'Check if the specified user is a subscriber of the specified list. Returns the user if they are subscriber.',
										url: '/twitter/lists/subscribers/show',
										params: requestParams});
});
router.post('/lists/subscribers/show',function(req,res,next){
	twitterPost(req, 'lists/subscribers/show').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* lists/subscriptions (no response)*/
router.get('/lists/subscriptions',function(req,res,next){
	var requestParams = require('./params/subscriptionsParams');
	res.render('twitter-api/paramForm',{title: 'Obtain a collection of the lists the specified user is subscribed to, 20 lists per page by default. Does not include the user’s own lists.',
										url: '/twitter/lists/subscriptions',
										params: requestParams});
});
router.post('/lists/subscriptions',function(req,res,next){
	twitterPost(req, 'lists/subscriptions').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* mutes/users/ids */
router.get('/mutes/users/ids',function(req,res,next){
	var requestParams = require('./params/mutesIdsParams');
	res.render('twitter-api/paramForm',{title: 'Returns an array of numeric user ids the authenticating user has muted.',
										url: '/twitter/mutes/users/ids',
										params: requestParams});
});
router.post('/mutes/users/ids',function(req,res,next){
	twitterPost(req, 'mutes/users/ids').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* mutes/users/list */
router.get('/mutes/users/list',function(req,res,next){
	var requestParams = require('./params/mutesListParams');
	res.render('twitter-api/paramForm',{title: 'Returns an array of user objects the authenticating user has muted.',
										url: '/twitter/mutes/users/list',
										params: requestParams});
});
router.post('/mutes/users/list',function(req,res,next){
	twitterPost(req, 'mutes/users/list').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* saved_searches/show*/
router.get('/saved_searches/show',function(req,res,next){
	var requestParams = require('./params/savedSearchesIdParams');
	res.render('twitter-api/paramForm',{title: 'Retrieve the information for the saved search represented by the given id.',
										url: '/twitter/saved_searches/show',
										params: requestParams});
});
router.post('/saved_searches/show',function(req,res,next){
	twitterPost(req, 'saved_searches/show').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* statuses/home_timeline */
router.get('/statuses/home_timeline',function(req,res,next){
	var requestParams = require('./params/homeTimelineParams');
	res.render('twitter-api/paramForm',{title: 'Returns a collection of the most recent Tweets and retweets posted by the authenticating user and the users they follow.',
										url: '/twitter/statuses/home_timeline',
										params: requestParams});
});
router.post('/statuses/home_timeline',function(req,res,next){
	twitterPost(req, 'statuses/home_timeline').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* statuses/lookup */
router.get('/statuses/lookup',function(req,res,next){
	var requestParams = require('./params/statusesLookupParams');
	res.render('twitter-api/paramForm',{title: 'Returns fully-hydrated Tweet objects for up to 100 Tweets per request, as specified by comma-separated values passed to the id parameter.',
										url: '/twitter/statuses/lookup',
										params: requestParams});
});
router.post('/statuses/lookup',function(req,res,next){
	twitterPost(req, 'statuses/lookup').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* statuses/mentions_timeline */
router.get('/statuses/mentions_timeline',function(req,res,next){
	var requestParams = require('./params/statusesMentionsParams');
	res.render('twitter-api/paramForm',{title: 'Returns the 20 most recent mentions (Tweets containing a users’s @screen_name) for the authenticating user.',
										url: '/twitter/statuses/mentions_timeline',
										params: requestParams});
});
router.post('/statuses/mentions_timeline',function(req,res,next){
	twitterPost(req, 'statuses/mentions_timeline').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* statuses/retweeters/ids */
router.get('/statuses/retweeters/ids',function(req,res,next){
	var requestParams = require('./params/statusesRtIdsParams');
	res.render('twitter-api/paramForm',{title: 'Returns a collection of up to 100 user IDs belonging to users who have retweeted the Tweet specified by the id parameter.',
										url: '/twitter/statuses/retweeters/ids',
										params: requestParams});
});
router.post('/statuses/retweeters/ids',function(req,res,next){
	twitterPost(req, 'statuses/retweeters/ids').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* statuses/retweets */
router.get('/statuses/retweets',function(req,res,next){
	var requestParams = require('./params/statusesRtIdParams');
	res.render('twitter-api/paramForm',{title: 'Returns a collection of the 100 most recent retweets of the Tweet specified by the id parameter.',
										url: '/twitter/statuses/retweets',
										params: requestParams});
});
router.post('/statuses/retweets',function(req,res,next){
	twitterPost(req, 'statuses/retweets').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* statuses/retweets_of_me */
router.get('/statuses/retweets_of_me',function(req,res,next){
	var requestParams = require('./params/statusesRtMeParams');
	res.render('twitter-api/paramForm',{title: 'Returns the most recent Tweets authored by the authenticating user that have been retweeted by others.',
										url: '/twitter/statuses/retweets_of_me',
										params: requestParams});
});
router.post('/statuses/retweets_of_me',function(req,res,next){
	twitterPost(req, 'statuses/retweets_of_me').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* statuses/show */
router.get('/statuses/show',function(req,res,next){
	var requestParams = require('./params/statusesShowParams');
	res.render('twitter-api/paramForm',{title: 'Returns a single Tweet, specified by the id parameter. The Tweet’s author will also be embedded within the Tweet.',
										url: '/twitter/statuses/show',
										params: requestParams});
});
router.post('/statuses/show',function(req,res,next){
	twitterPost(req, 'statuses/show').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* statuses/user_timeline */
router.get('/statuses/user_timeline',function(req,res,next){
	var requestParams = require('./params/userTimelineParams');
	res.render('twitter-api/paramForm',{title: 'Returns a collection of the most recent Tweets posted by the user indicated by the screen_name or user_id parameters.',
										url: '/twitter/statuses/user_timeline',
										params: requestParams});
});
router.post('/statuses/user_timeline',function(req,res,next){
	twitterPost(req, 'statuses/user_timeline').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* trends/closest */
router.get('/trends/closest',function(req,res,next){
	var requestParams = require('./params/trendsClosestParams');
	res.render('twitter-api/paramForm',{title: 'Returns the locations that Twitter has trending topic information for, closest to a specified location.',
										url: '/twitter/trends/closest',
										params: requestParams});
});
router.post('/trends/closest',function(req,res,next){
	twitterPost(req, 'trends/closest').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* trends/place */
router.get('/trends/place',function(req,res,next){
	var requestParams = require('./params/trendsPlaceParams');
	res.render('twitter-api/paramForm',{title: 'Returns the top 50 trending topics for a specific WOEID, if trending information is available for it.',
										url: '/twitter/trends/place',
										params: requestParams});
});
router.post('/trends/place',function(req,res,next){
	twitterPost(req, 'trends/place').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* users/lookup */
router.get('/users/lookup',function(req,res,next){
	var requestParams = require('./params/usersLookupParams');
	res.render('twitter-api/paramForm',{title: 'Returns fully-hydrated user objects for up to 100 users per request, as specified by comma-separated values passed to the user_id and/or screen_name parameters.',
										url: '/twitter/users/lookup',
										params: requestParams});
});
router.post('/users/lookup',function(req,res,next){
	twitterPost(req, 'users/lookup').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* users/profile_banner */
router.get('/users/profile_banner',function(req,res,next){
	var requestParams = require('./params/usersBannerParams');
	res.render('twitter-api/paramForm',{title: 'Returns a map of the available size variations of the specified user’s profile banner.',
										url: '/twitter/users/profile_banner',
										params: requestParams});
});
router.post('/users/profile_banner',function(req,res,next){
	twitterPost(req, 'users/profile_banner').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* users/search */
router.get('/users/search',function(req,res,next){
	var requestParams = require('./params/usersSearchParams');
	res.render('twitter-api/paramForm',{title: 'Provides a simple, relevance-based search interface to public user accounts on Twitter.',
										url: '/twitter/users/search',
										params: requestParams});
});
router.post('/users/search',function(req,res,next){
	twitterPost(req, 'users/search').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* users/show */
router.get('/users/show',function(req,res,next){
	var requestParams = require('./params/usersShowParams');
	res.render('twitter-api/paramForm',{title: 'Returns a variety of information about the user specified by the required user_id or screen_name parameter.',
										url: '/twitter/users/show',
										params: requestParams});
});
router.post('/users/show',function(req,res,next){
	twitterPost(req, 'users/show').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* users/suggestions */
router.get('/users/suggestions',function(req,res,next){
	var requestParams = require('./params/usersSuggestionsParams');
	res.render('twitter-api/paramForm',{title: 'Access to Twitter’s suggested user list. This returns the list of suggested user categories.',
										url: '/twitter/users/suggestions',
										params: requestParams});
});
router.post('/users/suggestions',function(req,res,next){
	twitterPost(req, 'users/suggestions').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* users/suggestions/:slug */
router.get('/users/suggestions/:slug',function(req,res,next){
	var requestParams = require('./params/usersSuggestionsSlugParams');
	res.render('twitter-api/paramForm',{title: 'Access the users in a given category of the Twitter suggested user list.',
										url: '/twitter/users/suggestions/:slug',
										params: requestParams});
});
router.post('/users/suggestions/:slug',function(req,res,next){
	twitterPost(req, 'users/suggestions/:slug').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
	});	
});

/* users/suggestions/:slug/members */
router.get('/users/suggestions/:slug/members',function(req,res,next){
	var requestParams = require('./params/usersSuggestionsMembersParams');
	res.render('twitter-api/paramForm',{title: 'Access the users in a given category of the Twitter suggested user list and return their most recent status if they are not a protected user.',
										url: '/twitter/users/suggestions/:slug/members',
										params: requestParams});
});
router.post('/users/suggestions/:slug/members',function(req,res,next){
	twitterPost(req, 'users/suggestions/:slug/members').then(function(tweets){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(tweets));
		//mongoStore(tweets);
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

/* mongoDB store the data*/
var mongoStore = function(data){
	MongoClient.connect(config.mongo.url,(err,db)=>{
		var collection = db.collection(config.mongo.collection);
		var time = + new Date();
		collection.insert({time:time, data:data},(err,result)=>{
		if(err){
				console.log('Insertion error:', err);
				}
			console.log(result);
		});
	});
}


module.exports = router;
