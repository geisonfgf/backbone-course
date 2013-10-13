"use strict";

// Include dependences
var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    sqlite3 = require("sqlite3").verbose();

var app = express();

// Database
var db = new sqlite3.Database("database/tdp.db");

// Create Tables

// Config
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	
	// Handle 404
	app.use(function(req, res, next){
		res.status(404);

		// respond with html page
		if (req.accepts('html')) {
			res.render('404', { url: req.url });
			return;
		}

		// respond with json
		if (req.accepts('json')) {
			res.send({ error: 'Not found' });
			return;
		}

		// default to plain-text. send()
		res.type('txt').send('Not found');
	});
	// Handle 500
	app.use(function(error, req, res, next) {
		res.status(500);

		// respond with html page
		if (req.accepts('html')) {
			res.render('500', { error: '500: Internal Server Error' });
			return;
		}

		// respond with json
		if (req.accepts('json')) {
			res.send({ error: '500: Internal Server Error' });
			return;
		}

		// default to plain-text. send()
		res.type('txt').send('500: Internal Server Error', 500);
	});

	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Entrypoints

/***************************************************************************/
/** INDEX ENTRYPOINT *******************************************************/
/***************************************************************************/

// api url index - hp/v0.1/backbone/api
app.get('/', function (req, res) {
	console.log("Called root api");
	res.send('Welcome to Backbone.js');
});

/***************************************************************************/
/** USER ENTRYPOINT ********************************************************/
/***************************************************************************/

// api url user - hp/v0.1/backbone/api/users (GET)
app.get('/hp/v0.1/backbone/api/users', function (req, res) {
	console.log("Called get all user");
	db.serialize(function() {
		db.all("SELECT * FROM users", function(err, rows){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else if(typeof rows == 'undefined' && rows.length <= 0){
				res.status(404);
				res.send({ error: 'Not found' });
			}else{
				res.status(200);
				res.send(rows);
			}
		});
	});
});

// api url user - hp/v0.1/backbone/api/users/:id (GET)
app.get('/hp/v0.1/backbone/api/users/:id', function (req, res) {
	console.log("Called get user by id");
	db.serialize(function() {
		db.get("SELECT * FROM users WHERE user_id = ?", req.params.id, function(err, row){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else if(typeof row == 'undefined'){
				res.status(404);
				res.send({ error: 'Not found' });
			}else{
				res.status(200);
				res.send(row);
			}
		});
	});
});

// api url user - hp/v0.1/backbone/api/users (POST)
app.post('/hp/v0.1/backbone/api/users', function (req, res) {
	console.log("Called create user");
	console.log(req.body);
	var user = [
		req.body.screen_name,
		req.body.name,
		req.body.profile_image_url,
		req.body.email,
		req.body.url,
		req.body.description,
		new Date(),
		0,
		0
	];

	db.serialize(function() {
		var sql = "INSERT INTO users (screen_name, name, " +
			"profile_image_url, email, url, description, " +
			"created_at, followers_count, friends_count ) " +
			"VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		db.run(sql, user, function(err, row){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else{
				res.status(200);
				res.send(row);
			}
		});
	});
});

// api url user - hp/v0.1/backbone/api/users/:id (PUT)
app.put('/hp/v0.1/backbone/api/users/:id', function (req, res) {
	console.log("Called update user by id");
	console.log(req.body);
	var id = req.params.id;
	var fields = "";
	var user = [];
	var field;
	var comma = "";
	
	for(field in req.body){
		if(fields != "") comma = ", ";
		fields = fields + comma + field + "=? ";
		user.push(req.body[field]);
	}
	
	user.push(id);

	db.serialize(function() {
		var sql = "UPDATE users SET " + fields + "WHERE user_id = ?";
		console.log(sql);
		db.run(sql, user, function(err, row){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else{
				res.status(200);
				res.send(row);
			}
		});
	});
});

// api url user - hp/v0.1/backbone/api/users/:id (DELETE)
app.delete('/hp/v0.1/backbone/api/users/:id', function (req, res) {
	console.log("Called delete user by id");
	db.serialize(function() {
		var sql = "DELETE FROM users WHERE user_id = ?";
		db.get(sql, req.params.id, function(err, row){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else{
				res.status(200);
				res.send(row);
			}
		});
	});
});

/***************************************************************************/
/** TWEETS ENTRYPOINT ********************************************************/
/***************************************************************************/

// api url tweets - hp/v0.1/backbone/api/tweets (GET)
app.get('/hp/v0.1/backbone/api/tweets', function (req, res) {
	console.log("Called get all tweets");
	db.serialize(function() {
		db.all("SELECT * FROM tweets", function(err, rows){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else if(typeof rows == 'undefined' && rows.length <= 0){
				res.status(404);
				res.send({ error: 'Not found' });
			}else{
				res.status(200);
				res.send(rows);
			}
		});
	});
});

// api url tweets - hp/v0.1/backbone/api/tweets/:id (GET)
app.get('/hp/v0.1/backbone/api/tweets/:id', function (req, res) {
	console.log("Called get tweet by id");
	db.serialize(function() {
		db.get("SELECT * FROM tweets WHERE tweet_id = ?", req.params.id, function(err, row){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else if(typeof row == 'undefined'){
				res.status(404);
				res.send({ error: 'Not found' });
			}else{
				res.status(200);
				res.send(row);
			}
		});
	});
});

// api url user - hp/v0.1/backbone/api/tweets (POST)
app.post('/hp/v0.1/backbone/api/tweets', function (req, res) {
	console.log("Called create tweet");
	console.log(req.body);
	var user = [
		req.body.tweet_text,
		new Date(),
		req.body.user_id,
		req.body.screen_name,
		req.body.name,
		req.body.profile_image_url
	];

	db.serialize(function() {
		var sql = "INSERT INTO tweets (tweet_text, user_id, " +
			"screen_name, name, profile_image_url ) " +
			"VALUES( ?, ?, ?, ?, ?)";
		db.run(sql, user, function(err, row){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else{
				res.status(200);
				res.send(row);
			}
		});
	});
});

// api url tweets - hp/v0.1/backbone/api/tweets/:id (PUT)
app.put('/hp/v0.1/backbone/api/tweets/:id', function (req, res) {
	console.log("Called update tweet by id");
	console.log(req.body);
	var id = req.params.id;
	var fields = "";
	var tweet = [];
	var field;
	var comma = "";
	
	for(field in req.body){
		if(fields != "") comma = ", ";
		fields = fields + comma + field + "=? ";
		user.push(req.body[field]);
	}
	
	user.push(id);

	db.serialize(function() {
		var sql = "UPDATE tweets SET " + fields + "WHERE tweet_id = ?";
		console.log(sql);
		db.run(sql, user, function(err, row){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else{
				res.status(200);
				res.send(row);
			}
		});
	});
});

// api url tweets - hp/v0.1/backbone/api/tweets/:id (DELETE)
app.delete('/hp/v0.1/backbone/api/tweets/:id', function (req, res) {
	console.log("Called delete tweet by id");
	db.serialize(function() {
		var sql = "DELETE FROM tweets WHERE tweet_id = ?";
		db.get(sql, req.params.id, function(err, row){
			if(err){
				console.log(err);
				res.status(500);
				res.send({ error: '500: Internal Server Error' });
			}else{
				res.status(200);
				res.send(row);
			}
		});
	});
});

// Launch server
console.log("Start TDP REST Server...");
app.listen(4242);