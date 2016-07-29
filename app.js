var config   = require('./config')
, express  = require('express')
, mongoose = require('mongoose')
, fs       = require('fs')
, socket = require('socket.io')
, db       = {};

// connect mongoose
mongoose.connect(config.db, { server: { keepAlive: 1, auto_reconnect: true } });
var conn = mongoose.connection;

// mongoose connection 'error'
conn.on('error', function () {
	console.log('\nMongoose failed to connect:', config.db)
		mongoose.disconnect()
})

// mongoose connection 'open'
conn.on('open', function () {
	console.log('\nMongoose connection opened:', config.db);

	// config mongoose models
	var modelsPath = __dirname + '/app/models'
		fs.readdirSync(modelsPath).forEach(function (file) {
			if (file.indexOf('.js') >= 0) 
				db[file.replace('.js', '')] = require(modelsPath + '/' + file)(mongoose, config);
		})

	// config Nomadic Fitness affiliate and admin
	require('./config/admin')(config, db);

	// create app
	var app   = express()
		, http  = require('http').createServer(app);
		// config socket conn
		sockio  = socket(http);
		// config app
		require('./config/express')(app, config);
		require('./config/routes')(app, http, db);
		// on socket connection
		sockio.on('connection', function (socket) {
			//console.log(socket);
			socket.emit('news', { hello: 'world' });
			socket.on('ping', function (data) {
				console.log(data);
			});
		});
		// on web load
		app.get('/', function (req, res) {
			//console.log(req);
			res.render('index', function(err, html) {
				if(err) {
					console.log(err);
				}
				res.send(html);
			});
		})

	// serve app
	http.listen(config.port, function () {
		console.log("Nomadic Fitness API running at http://" + config.host + ":" + config.port)
	});
});
