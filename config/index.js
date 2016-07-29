var path = require("path"),
	rootPath = path.normalize(__dirname + "/.."),
	env = process.env.NODE_ENV || "development",
	port = process.env.PORT || 9090,
	host = "127.0.0.1" || "0.0.0.0";
admin = {
	"role" : "admin" ,
	"email" : "imkx13@gmail.com",
	"password" : "password9090",
	"first_name" : "Mukesh" , 
	"last_name" : "Kumar"
};

var config = {
	development : {
		host : host,
		root : rootPath , 
		app : {
			name : "tranceTravel"
		},
		port : port ,
		db : "mongodb://localhost/trancetravel",
		admin : admin
	},
	production : {
		host : host,
		root : rootPath,
		app : {
			name : "tranceTravel"
		},
		port : port,
		db : "mongodb://127.0.0.1/trancetravel",
		admin : admin
	}
}

module.exports = config[env];
