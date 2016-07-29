var express = require('express');
var multiViews = require('multi-views');
module.exports = function (app , config) {
	var mongoStore = require("connect-mongo")(express);
	// api sessions
	var sessions = new mongoStore ({
			url : config.db,
			clear_interval : 36000,
			auto_reconnect : true,
			keep_alive : true
		})
	//console.log(sessions);
	// app midware setup
	multiViews.setupMultiViews(app);
	app.set("port" , config.port);
	app.set("views" , [config.root + '/views']);
	var viewDirs = app.get('views');
	viewDirs.push(config.root + '/views/templates');
	viewDirs.push(config.root + '/components/templates');
	//viewDirs.push(config.root + '/app');
	console.log(viewDirs)
	app.set("view engine" , "html");
	app.engine("html" , require("ejs").renderFile);

	// app configuration
	app.disable("X-Powered-By");
	app.configure(function () {
		app.use(express.compress());
		app.use(express.logger("dev"));
		app.use(express.json({limit : '10mb'}));
		app.use(express.urlencoded({limit :'10mb'}))
		app.use(express.cookieParser());
		app.use(express.methodOverride());
		app.use(express.static(config.root + "/public"));
		app.use(express.favicon(config.root + "/public/favicon.ico"));
		app.use(express.session({
			store : sessions , 
			secret : "wewm,oiuoi>W$|sd\\we|[]w%#/t$",
			cookie : {maxAge : 24 * 60 * 60 * 1000}
		}))
		app.use(app.router);
		app.use(function (req , res) {
			res.send("404 Not found" , 404);
		})
	});
	// CORS support
	app.all('*', function (req, res, next) {
		if (!req.get('Origin')) return next();
		// use "*" here to accept any origin
		res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:9090');
		res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	       	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
		res.set('Access-Control-Allow-Credentials', 'true');
	       	// res.set('Access-Control-Allow-Max-Age', 3600);
		if ('OPTIONS' == req.method) return res.send(200);
		next();
	});
};
