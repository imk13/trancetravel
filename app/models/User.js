module.exports = function (mongoose , config) {
	var schema = mongoose.Schema , 
	objectId = schema.ObjectId,
	bcrypt = require("bcrypt"),
	saltFactor = config.salt || 10;
	
	var userSchema = new schema({
		role : { type : String , enum : ["client" , "admin"] , default : "client"} ,
		social_id : {type : [] , required : false , default : []},
		first_name : { type : String, required : true},
		last_name : { type : String, required : false , default : ""},
		gender : {type : String , required : false , default : ""},
		dob : {type : Date , default : Date.now},
		occupation : {type : String , required : false , default : ""},
		pastime : {type : String , required : false , default : ""},
		email : {type : String, required : true},
		password : {type : String , required : true},
		created_at : {type : Date , default : Date.now},
		modified_at : {type : Date , default : Date.now}
		//location : { type : "object" , properties : { "lat " : {type : String} ,  "lng " : {type : String} } } , required : false, default : {"lat" : "0" , "lng" : "0"}}
	}, {versionKey : false});

	function saltPass (user, next) {

	}

	userSchema.pre('save' , function (next) {
		var user = {};
		user = this;
		if(!user.isModified('password')) return next();
		bcrypt.genSalt(saltFactor , function (err ,  salt) {
			if(err) next (err);
			bcrypt.hash(user.password , salt, function (err, hash) {
				if (err) next(err);
				user.password = hash;
				next();
			})
		});
	})

	userSchema.methods.authenticate = function (pass , next) {
		// console.log("user.js 39");
		// console.log(this , pass);
		bcrypt.compare(pass , this.password , function (err , valid) {
			console.log(err , valid);
			if(err) next(err);
			next(null, valid);
		})
	};

	// userSchema parse
	[ 'toObject' , 'toJSON'].forEach(function (prop) {
			userSchema.set(prop, {
	  		transform: function (doc, ret, options) {
	  			delete ret.password
	  		}
	  	})
	});

	return mongoose.model('user', userSchema);
};