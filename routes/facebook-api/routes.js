var express = require('express');
var router = express.Router();
var url = require('url');
var config = require('../../config');
var FB = require('fb');
var Promise = require('promise');
var when = require('when');
var MongoClient = require('mongodb').MongoClient;

FB.options({version:'v2.8'});
FB.setAccessToken(config.fb.access_token); //token need to renew every 60 days!

/* home page. */
router.get('/', function(req, res, next) {
  res.render('facebook-api/index', { title: 'Facebook API Viewer' ,
                                    endpoints: ['facebook/SP-Search',	'facebook/Achievement',	'facebook/Achievement-Type',
												'facebook/Album',	'facebook/Analytics',	'facebook/App-Link-Host',
												'facebook/App-Request',						'facebook/Application',
												'facebook/Application-Context',				'facebook/Comment',
												'facebook/Conversation',					'facebook/Debug-Token',
												'facebook/Doc',		'facebook/Domain',		'facebook/Education-Experience',
												'facebook/Event',	'facebook/Friend-List',	'facebook/Group-Doc',
												'facebook/Instagram-Comment',				'facebook/Instagram-User',
												'facebook/Life-Event',						'facebook/Link',
												'facebook/Live-Video',						'facebook/Mailing-Address',
												'facebook/Media-Fingerprint',				'facebook/Milestone',
												'facebook/Native-Offer',					'facebook/Notification',
												'facebook/Open-Graph-Action-Type',			'facebook/Open-Graph-Context',
												'facebook/Open-Graph-Object-Type',			'facebook/Page',
												'facebook/Page-Admin-Note',					'facebook/Page-Call-To-Action',
												'facebook/Page-Label',						'facebook/Payment',
												'facebook/Photo',	'facebook/Place',		'facebook/Place-Tag',
												'facebook/Place-Topic',						'facebook/Post',
												'facebook/Promotion-Info',					'facebook/Request',
												'facebook/Saved-Message-Response', 			'facebook/Test-User',
												'facebook/Thread',	'facebook/User',		'facebook/User-Context',
												'facebook/Video',	'facebook/Video-Copyright',
												'facebook/Video-Copyright-Rule',			'facebook/Video-List',
												'facebook/Work-Experience']
                                    });
});

/* keyword search user, page, event, group, place, placetopic*/
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

/* Achievement + 2 edges */
router.get('/Achievement',function(req,res,next){
	var requestParams = require('./params/achievement');
	res.render('facebook-api/paramForm',{title: 'Represents a user gaining an achievement in a Facebook game.',
							url: '/facebook/Achievement',
							params: requestParams});
});
router.post('/Achievement',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Achievement-Type + 0 edge */
router.get('/Achievement-Type',function(req,res,next){
	var requestParams = require('./params/achievementType');
	res.render('facebook-api/paramForm',{title: 'A games achievement type created by a Facebook App',
							url: '/facebook/Achievement-Type',
							params: requestParams});
});
router.post('/Achievement-Type',function(req,res,next){
	FB.api(req.body['achievement-type-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Album + 6 edges */
router.get('/Album',function(req,res,next){
	var requestParams = require('./params/album');
	res.render('facebook-api/paramForm',{title: 'Represents a photo album. The /{album-id} node returns a single album.',
							url: '/facebook/Album',
							params: requestParams});
});
router.post('/ALbum',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Analytics + 0 edge */
router.get('/Analytics',function(req,res,next){
	var requestParams = require('./params/analytics');
	res.render('facebook-api/paramForm',{title: 'Analytics app events export job',
							url: '/facebook/Analytics',
							params: requestParams});
});
router.post('/Analytics',function(req,res,next){
	FB.api(req.body['analytics-app-events-export-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* App-Link-Host 0 edge */
router.get('/App-Link-Host',function(req,res,next){
	var requestParams = require('./params/appLinkHost');
	res.render('facebook-api/paramForm',{title: 'An individual app link host object created by an app. An app link host is a wrapper for a group of different app links.',
							url: '/facebook/App-Link-Host',
							params: requestParams});
});
router.post('/App-Link-Host',function(req,res,next){
	FB.api(req.body['app-link-host-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* App-Request 0 edge */
router.get('/App-Request',function(req,res,next){
	var requestParams = require('./params/appRequest');
	res.render('facebook-api/paramForm',{title: 'An individual app request received by someone, sent by an app or another person.',
							url: '/facebook/App-Request',
							params: requestParams});
});
router.post('/App-Request',function(req,res,next){
	FB.api(req.body['app-request-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Application 33 edges */
router.get('/Application',function(req,res,next){
	var requestParams = require('./params/application');
	res.render('facebook-api/paramForm',{title: 'A Facebook app',
							url: '/facebook/Application',
							params: requestParams});
});
router.post('/Application',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Application-Context 1 edge */
router.get('/Application-Context',function(req,res,next){
	var requestParams = require('./params/applicationContext');
	res.render('facebook-api/paramForm',{title: 'Provides access to available social context edges for this app',
							url: '/facebook/Application-Context',
							params: requestParams});
});
router.post('/Application-Context',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* comment 3 edges */
router.get('/Comment',function(req,res,next){
	var requestParams = require('./params/comment');
	res.render('facebook-api/paramForm',{title: 'A comment can be made on various types of content on Facebook. '+
												'The /{comment-id} node returns a single comment.',
							url: '/facebook/Comment',
							params: requestParams});
});
router.post('/Comment',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* conversation 1 edge */
router.get('/Conversation',function(req,res,next){
	var requestParams = require('./params/conversation');
	res.render('facebook-api/paramForm',{title: 'A Facebook Messages conversation between a person and a Facebook Page.',
							url: '/facebook/Conversation',
							params: requestParams});
});
router.post('/Conversation',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Debug-Token 0 edge */
router.get('/Debug-Token',function(req,res,next){
	var requestParams = require('./params/debugToken');
	res.render('facebook-api/paramForm',{title: 'This returns metadata about a given access token.',
							url: '/facebook/Debug-Token',
							params: requestParams});
});
router.post('/Debug-Token',function(req,res,next){
	FB.api('debug_token?input_token='+ req.body['input-token'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Doc 0 edge */
router.get('/Doc',function(req,res,next){
	var requestParams = require('./params/doc');
	res.render('facebook-api/paramForm',{title: 'Reading A Document.',
							url: '/facebook/Doc',
							params: requestParams});
});
router.post('/Doc',function(req,res,next){
	FB.api(req.body['doc-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Domain 0 edge */
router.get('/Domain',function(req,res,next){
	var requestParams = require('./params/domain');
	res.render('facebook-api/paramForm',{title: 'A website domain within the Graph API.'+
										'To register your own domain, you must claim your domain name using Facebook Insights.',
							url: '/facebook/Domain',
							params: requestParams});
});
router.post('/Domain',function(req,res,next){
	FB.api(req.body['domain-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Education-Experience 0 edge */
router.get('/Education-Experience',function(req,res,next){
	var requestParams = require('./params/education');
	res.render('facebook-api/paramForm',{title: 'Reading The person\'s education history.',
							url: '/facebook/Education-Experience',
							params: requestParams});
});
router.post('/Education-Experience',function(req,res,next){
	FB.api(req.body['education-experience-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Event 13 edge */
router.get('/Event',function(req,res,next){
	var requestParams = require('./params/event');
	res.render('facebook-api/paramForm',{title: 'Represents a Facebook event. The /{event-id} node returns a single event.',
							url: '/facebook/Event',
							params: requestParams});
});
router.post('/Event',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Friend-List 0 edge */
router.get('/Friend-List',function(req,res,next){
	var requestParams = require('./params/friendList');
	res.render('facebook-api/paramForm',{title: 'A friend list - an object which refers to a grouping of friends created by someone or generated'+ 
											'automatically for someone (such as the "Close Friends" or "Acquaintances" lists).',
							url: '/facebook/Friend-List',
							params: requestParams});
});
router.post('/Friend-List',function(req,res,next){
	FB.api(req.body['friend-list-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Group 10 edge */
router.get('/Group',function(req,res,next){
	var requestParams = require('./params/group');
	res.render('facebook-api/paramForm',{title: 'Represents a Facebook group. The /{group-id} node returns a single group.',
							url: '/facebook/Group',
							params: requestParams});
});
router.post('/Group',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Group-Doc 0 edge */
router.get('/Group-Doc',function(req,res,next){
	var requestParams = require('./params/groupDoc');
	res.render('facebook-api/paramForm',{title: 'Represents a doc within a Facebook group. The /{group-doc-id} node returns a single doc.',
							url: '/facebook/Group-Doc',
							params: requestParams});
});
router.post('/Group-Doc',function(req,res,next){
	FB.api(req.body['group-doc-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Instagram-Comment 0 edge */
router.get('/Instagram-Comment',function(req,res,next){
	var requestParams = require('./params/instagram');
	res.render('facebook-api/paramForm',{title: 'Reading An Instagram comment',
							url: '/facebook/Instagram-Comment',
							params: requestParams});
});
router.post('/Instagram-Comment',function(req,res,next){
	FB.api(req.body['instagram-comment-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Instagram-User 2 edges */
router.get('/Instagram-User',function(req,res,next){
	var requestParams = require('./params/instagramUser');
	res.render('facebook-api/paramForm',{title: 'Reading an Instagram User',
							url: '/facebook/Instagram-User',
							params: requestParams});
});
router.post('/Instagram-User',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Life-Event 4 edges */
router.get('/Life-Event',function(req,res,next){
	var requestParams = require('./params/lifeEvent');
	res.render('facebook-api/paramForm',{title: 'The Life Event node part of the data returned for a Page\'s milestone edge.',
							url: '/facebook/Life-Event',
							params: requestParams});
});
router.post('/Life-Event',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Link 2 edges */
router.get('/Link',function(req,res,next){
	var requestParams = require('./params/link');
	res.render('facebook-api/paramForm',{title: 'A link shared on Facebook.',
							url: '/facebook/Link',
							params: requestParams});
});
router.post('/Link',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Live-Video 4 edges */
router.get('/Live-Video',function(req,res,next){
	var requestParams = require('./params/liveVideo');
	res.render('facebook-api/paramForm',{title: 'A live video',
							url: '/facebook/Live-Video',
							params: requestParams});
});
router.post('/Live-Video',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Mailing-Address 0 edge */
router.get('/Mailing-Address',function(req,res,next){
	var requestParams = require('./params/mailingAddress');
	res.render('facebook-api/paramForm',{title: 'Reading An Mailing Address object',
							url: '/facebook/Mailing-Address',
							params: requestParams});
});
router.post('/Mailing-Address',function(req,res,next){
	FB.api(req.body['mailing-address-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Media-Fingerprint 0 edge */
router.get('/Media-Fingerprint',function(req,res,next){
	var requestParams = require('./params/mediaFingerprint');
	res.render('facebook-api/paramForm',{title: 'Reading A media fingerprint object',
							url: '/facebook/Media-Fingerprint',
							params: requestParams});
});
router.post('/Media-Fingerprint',function(req,res,next){
	FB.api(req.body['media-fingerprint-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Message 2 edges */
router.get('/Message',function(req,res,next){
	var requestParams = require('./params/message');
	res.render('facebook-api/paramForm',{title: 'An individual message in Facebook Messenger. This is a Pages-only endpoint.',
							url: '/facebook/Message',
							params: requestParams});
});
router.post('/Message',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Milestone 2 edges */
router.get('/Milestone',function(req,res,next){
	var requestParams = require('./params/milestone');
	res.render('facebook-api/paramForm',{title: 'This represents a milestone on a Facebook Page. The /{milestone-id} node returns a single \'milestone\'.',
							url: '/facebook/Milestone',
							params: requestParams});
});
router.post('/Milestone',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Native-Offer 1 edge */
router.get('/Native-Offer',function(req,res,next){
	var requestParams = require('./params/nativeOffer');
	res.render('facebook-api/paramForm',{title: 'A native offer represents an Offer on Facebook. The /{offer_id} node returns a single native offer.',
							url: '/facebook/Native-Offer',
							params: requestParams});
});
router.post('/Native-Offer',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Notification 0 edge */
router.get('/Notification',function(req,res,next){
	var requestParams = require('./params/notification');
	res.render('facebook-api/paramForm',{title: 'An individual unread Facebook notification. This is an API that\'s only available for Pages.',
							url: '/facebook/Notification',
							params: requestParams});
});
router.post('/Notification',function(req,res,next){
	FB.api(req.body['notification-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Open-Graph-Action-Type 0 edge */
router.get('/Open-Graph-Action-Type',function(req,res,next){
	var requestParams = require('./params/actionType');
	res.render('facebook-api/paramForm',{title: 'An Open Graph action type',
							url: '/facebook/Open-Graph-Action-Type',
							params: requestParams});
});
router.post('/Open-Graph-Action-Type',function(req,res,next){
	FB.api(req.body['open-graph-action-type-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Open-Graph-Context 4 edges */
router.get('/Open-Graph-Context',function(req,res,next){
	var requestParams = require('./params/context');
	res.render('facebook-api/paramForm',{title: 'Social context for Graph API objects. This can be used on major nodes in the Graph API.',
							url: '/facebook/Open-Graph-Context',
							params: requestParams});
});
router.post('/Open-Graph-Context',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Open-Graph-Object-Type 0 edge */
router.get('/Open-Graph-Object-Type',function(req,res,next){
	var requestParams = require('./params/objectType');
	res.render('facebook-api/paramForm',{title: 'An Open Graph object type',
							url: '/facebook/Open-Graph-Object-Type',
							params: requestParams});
});
router.post('/Open-Graph-Object-Type',function(req,res,next){
	FB.api(req.body['open-graph-object-type-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Page 61 edeges */
router.get('/Page',function(req,res,next){
	var requestParams = require('./params/page');
	res.render('facebook-api/paramForm',{title: 'SThis represents a Facebook Page. The /{page-id} node returns a single page.',
							url: '/facebook/Page',
							params: requestParams});
});
router.post('/Page',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Page-Admin-Note 0 edge */
router.get('/Page-Admin-Note',function(req,res,next){
	var requestParams = require('./params/pageAdminNote');
	res.render('facebook-api/paramForm',{title: 'Reading a Page Admin Note',
							url: '/facebook/Page-Admin-Note',
							params: requestParams});
});
router.post('/Page-Admin-Note',function(req,res,next){
	FB.api(req.body['page-admin-note-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Page-Call-To-Action 0 edge */
router.get('/Page-Call-To-Action',function(req,res,next){
	var requestParams = require('./params/pageCall');
	res.render('facebook-api/paramForm',{title: 'A page access token with pages_manage_cta permission is required for creating, updating and deleting.',
							url: '/facebook/Page-Call-To-Action',
							params: requestParams});
});
router.post('/Page-Call-To-Action',function(req,res,next){
	FB.api(req.body['page-call-to-action-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Page-Label 1 edege */
router.get('/Page-Label',function(req,res,next){
	var requestParams = require('./params/pageLabel');
	res.render('facebook-api/paramForm',{title: 'Page\'s label',
							url: '/facebook/Page-Label',
							params: requestParams});
});
router.post('/Page-Label',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Payment 2 edeges */
router.get('/Payment',function(req,res,next){
	var requestParams = require('./params/payment');
	res.render('facebook-api/paramForm',{title: 'The details of a payment made in an app using Facebook Payments.',
							url: '/facebook/Payment',
							params: requestParams});
});
router.post('/Payment',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Photo 7 edeges */
router.get('/Photo',function(req,res,next){
	var requestParams = require('./params/photo');
	res.render('facebook-api/paramForm',{title: 'Represents an individual photo on Facebook.',
							url: '/facebook/Photo',
							params: requestParams});
});
router.post('/Photo',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Place 0 edge */
router.get('/Place',function(req,res,next){
	var requestParams = require('./params/place');
	res.render('facebook-api/paramForm',{title: 'Reading a Place',
							url: '/facebook/Place',
							params: requestParams});
});
router.post('/Place',function(req,res,next){
	FB.api(req.body['place-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Place-Tag 0 edge */
router.get('/Place-Tag',function(req,res,next){
	var requestParams = require('./params/placeTag');
	res.render('facebook-api/paramForm',{title: 'Reading a Place Tag',
							url: '/facebook/Place-Tag',
							params: requestParams});
});
router.post('/Place-Tag',function(req,res,next){
	FB.api(req.body['place-tag-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Place-Topic 0 edge */
router.get('/Place-Topic',function(req,res,next){
	var requestParams = require('./params/placeTopic');
	res.render('facebook-api/paramForm',{title: 'Reading a Place Topic',
							url: '/facebook/Place-Topic',
							params: requestParams});
});
router.post('/Place-Topic',function(req,res,next){
	FB.api(req.body['place-topic-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Post 6 edeges */
router.get('/Post',function(req,res,next){
	var requestParams = require('./params/post');
	res.render('facebook-api/paramForm',{title: 'An individual entry in a profile\'s feed. The profile could be a user, page, app, or group.',
							url: '/facebook/Post',
							params: requestParams});
});
router.post('/Post',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Promotion-Info 0 edge */
router.get('/Promotion-Info',function(req,res,next){
	var requestParams = require('./params/promotion');
	res.render('facebook-api/paramForm',{title: 'Reading A promotional info for the post.',
							url: '/facebook/Promotion-Info',
							params: requestParams});
});
router.post('/Promotion-Info',function(req,res,next){
	FB.api(req.body['promotion-info-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Request 0 edge */
router.get('/Request',function(req,res,next){
	var requestParams = require('./params/request');
	res.render('facebook-api/paramForm',{title: 'An individual game request received by someone, sent by an app or by another person.',
							url: '/facebook/Request',
							params: requestParams});
});
router.post('/Request',function(req,res,next){
	FB.api(req.body['request-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Saved-Message-Response 1 edge */
router.get('/Saved-Message-Response',function(req,res,next){
	var requestParams = require('./params/messageResponse');
	res.render('facebook-api/paramForm',{title: 'A saved message response for a Facebook Page.',
							url: '/facebook/Saved-Message-Response',
							params: requestParams});
});
router.post('/Saved-Message-Response',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Status 4 edges */
router.get('/Status',function(req,res,next){
	var requestParams = require('./params/status');
	res.render('facebook-api/paramForm',{title: 'A status message in a profile\'s feed.Warning: You can\'t'+ 
									'get a valid status ID from users\' post URLs or their timelines. You need to'+
									'call the Graph API (e.g. via /user/feed) to get a valid status ID.',
							url: '/facebook/Status',
							params: requestParams});
});
router.post('/Status',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Test-User 1 edge */
router.get('/Test-User',function(req,res,next){
	var requestParams = require('./params/testUser');
	res.render('facebook-api/paramForm',{title: 'A test user associated with a Facebook app. Test users are created and associated using the /{app-id}/accounts/test-users edge or in the App Dashboard.',
							url: '/facebook/Test-User',
							params: requestParams});
});
router.post('/Test-User',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Thread 0 edge */
router.get('/Thread',function(req,res,next){
	var requestParams = require('./params/thread');
	res.render('facebook-api/paramForm',{title: 'A Facebook Messages conversation thread. This endpoint is only '+
												'accessible for users that are developers of the app making the ' +
'												request. Pages should use the Conversation object.',
							url: '/facebook/Thread',
							params: requestParams});
});
router.post('/Thread',function(req,res,next){
	FB.api(req.body['thread-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* User 56 edge */
router.get('/User',function(req,res,next){
	var requestParams = require('./params/user');
	res.render('facebook-api/paramForm',{title: 'A user represents a person on Facebook. The /{user-id} node returns a single user.',
							url: '/facebook/User',
							params: requestParams});
});
router.post('/User',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* User- 4 edge */
router.get('/User-Context',function(req,res,next){
	var requestParams = require('./params/userContext');
	res.render('facebook-api/paramForm',{title: 'Social context for a person.',
							url: '/facebook/User-Context',
							params: requestParams});
});
router.post('/User-Context',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Video 10 edges */
router.get('/Video',function(req,res,next){
	var requestParams = require('./params/video');
	res.render('facebook-api/paramForm',{title: 'Represents an individual video on Facebook.',
							url: '/facebook/Video',
							params: requestParams});
});
router.post('/Video',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Video-Copyright 0 edge */
router.get('/Video-Copyright',function(req,res,next){
	var requestParams = require('./params/videoCopyright');
	res.render('facebook-api/paramForm',{title: 'For more information about the Rights Manager API, check out our Rights Manager API intro docs.',
							url: '/facebook/Video-Copyright',
							params: requestParams});
});
router.post('/Video-Copyright',function(req,res,next){
	FB.api(req.body['video-copyright-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Video-Copyright-Rule 0 edge */
router.get('/Video-Copyright-Rule',function(req,res,next){
	var requestParams = require('./params/videoCopyrightRule');
	res.render('facebook-api/paramForm',{title: 'For more information about the Rights Manager API, check out our Rights Manager API intro docs.',
							url: '/facebook/Video-Copyright-Rule',
							params: requestParams});
});
router.post('/Video-Copyright-Rule',function(req,res,next){
	FB.api(req.body['video-copyright-rule-id'],function(fb){
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

/* Video-List 1 edge */
router.get('/Video-List',function(req,res,next){
	var requestParams = require('./params/videoList');
	res.render('facebook-api/paramForm',{title: 'A list of videos in the Graph API. Used from other nodes like Pages that might have a list of videos.',
							url: '/facebook/Video-List',
							params: requestParams});
});
router.post('/Video-List',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] != 'on'){
			var base = fbAddEdges(node,'').then(function(data){
				fbData.push(data); //store the returned fb instance
			});
			promises.push(base);
		}else{	
			var edges = fbAddEdges(node,'/'+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* SPECIAL Search 6 edges */
router.get('/SP-Search',function(req,res,next){
	var requestParams = require('./params/search');
	res.render('facebook-api/paramForm',{title: 'You can search over many public objects in the social graph with the /search endpoint.',
							url: '/facebook/SP-Search',
							params: requestParams});
});
router.post('/SP-Search',function(req,res,next){
	var fbData = [];
	var promises = [];
	for (key in req.body){
		if (req.body[key]!= 'on'){
			var node = req.body[key];
		}
	} // find the node
	for (key in req.body){
		if (req.body[key] === 'on'){
			var edges = fbAddEdges('search?q='+node,'&type='+key).then(function(data){
				fbData.push(data);
			});
			promises.push(edges);
		}
	}
	when.all(promises).then(function(){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fbData));
		mongoStore(fbData);
	});
});

/* Work-Experience 0 edge */
router.get('/Work-Experience',function(req,res,next){
	var requestParams = require('./params/workExperience');
	res.render('facebook-api/paramForm',{title: 'Information about a user\'s work',
							url: '/facebook/Work-Experience',
							params: requestParams});
});
router.post('/Work-Experience',function(req,res,next){
	FB.api(req.body['work-experience-id'],function(fb){
		res.setHeader('Content-Type','application/json');
		res.send(JSON.stringify(fb));
		mongoStore(fb);
	});	
});

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

/* add edges using promise library */
var fbAddEdges = function(base,edge){
	var promise = new Promise((resolve,reject) => {
		console.log(base + edge);
		FB.api(base + edge, function(fb){
				resolve({key:edge,value:fb});
			});
		});
	return promise;
}

module.exports = router;
