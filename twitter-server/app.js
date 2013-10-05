"use strict";

// Include dependences
var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    sqlite3 = require("sqlite3").verbose();;

var app = express();

// Database
var db = new sqlite3.Database("database/tdp.db");

// Config
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Entrypoints
// api url - hp/v0.1/backbone/api
app.get('/', function (req, res) {
	console.log("Called root api");
	res.send('Welcome to Backbone.js');
});

// Launch server
console.log("Start TDP REST Server...");
app.listen(4242);