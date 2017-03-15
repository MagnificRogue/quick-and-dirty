var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');

router.get('/',function(req,res,next){
	res.render('test',{title: 'exploring a friendly way of interacting with facebook and twitter API',
	params:{'facebook':['Album','Comment','Conversation','Event','Group','Live-Video','Page','Photo','Place',
                  'Place-Topic','Post','User','Video','Search'],
			'twitter':['users/search','users/show','trends/available','trends/place','statuses/user_timeline',
                  'statuses/home_timeline','statuses/lookup','geo/search','geo/reverse_geocode','geo/id/:place_id',
                 'friendships/show','friendships/lookup','friends/list','followers/list','favorites/list','search']},
	url: '/test'});
});
router.post('/', (req, res, next) => {
	console.log(req.body);
	
	//if submit fb form
	if ('fb' in req.body){
		var options = {
		  mode: 'text',
		  pythonPath:'',
		  pythonOptions: ['-u'],
		  scriptPath: 'C:/Users/chenwang/Documents/courses/SP17/web/quick-and-dirty-master/routes/',
		  args: [req.body['fb'][0], req.body['fb'][1]]
		};
		PythonShell.run('facebook-networkx.py', options, function(err, results) {
		  if (err) throw err;
		  res.setHeader('Content-Type','text/plain');
		  res.send(results);
		});
	}else if ('twt' in req.body){
		var options = {
		  mode: 'text',
		  pythonPath:'',
		  pythonOptions: ['-u'],
		  scriptPath: 'C:/Users/chenwang/Documents/courses/SP17/web/quick-and-dirty-master/routes/',
		  args: [req.body['twt'][0], req.body['twt'][1]]
		};
		PythonShell.run('twitter-networkx.py', options, function(err, results) {
		  if (err) throw err;
		  res.setHeader('Content-Type','text/plain');
		  res.send(results);
		});
	}
});

var subsequentCall = function(hostname,call){
	
}

module.exports = router;
