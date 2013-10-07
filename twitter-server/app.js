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
	var user = {
		user_id: null,
		screen_name: req.body.screen_name,
		name: req.body.name,
		profile_image_url: req.body.profile_image_url,
		email: req.body.email,
		url: req.body.url,
		description: req.body.description,
		followers_count: null,
		friends_count: null,
		created_at: new Date()
	}
	db.serialize(function() {
		var sql = "INSERT INTO users VALUES(" +
			"$user_id, $screen_name, $name, $profile_image_url, " +
			"$url, $description, $followers_count, $friends_count, " +
			"$created_at)";
		db.run(sql, user, function(err, row){
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

// api url user - hp/v0.1/backbone/api/users/:id (PUT)
app.put('/hp/v0.1/backbone/api/users/:id', function (req, res) {
	console.log("Called update user by id");
	var id = req.params.id;
	var fields = "";
	var user = [];

	if(req.body.screen_name){
		fields + "screen_name=?";
		user.push(req.body.screen_name);
	}
	if(req.body.name){
		fields + "name=?";
		user.push(req.body.name);
	}
	if(req.body.profile_image_url){
		fields + "profile_image_url=?";
		user.push(req.body.profile_image_url);
	}
	if(req.body.email){
		fields + "email=?";
		user.push(req.body.email);
	}
	if(req.body.url){
		fields + "url=?";
		user.push(req.body.url);
	}
	if(req.body.description){
		fields + "description=?";
		user.push(req.body.description);
	}

	db.serialize(function() {
		db.run("UPDATE users SET " + fields, user, function(err, row){
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

// api url user - hp/v0.1/backbone/api/users/:id (DELETE)
app.delete('/hp/v0.1/backbone/api/users/:id', function (req, res) {
	console.log("Called delete user by id");
	db.serialize(function() {
		db.get("DELETE FROM users WHERE user_id = ?", req.params.id, function(err, row){
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

// Launch server
console.log("Start TDP REST Server...");
app.listen(4242);