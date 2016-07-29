module.exports = function (mongoose , config) {
	var schema = mongoose.Schema;
	var ObjectId = schema.ObjectId;
	var locationSchema = new schema({
		uid : { type : mongoose.Schema.Types.ObjectId, ref: 'user'},
		location : { "lat" : {type : String ,  default : "0"} , "lng"  : {type : String , default : "0"} , required : false},
		spid : {type : String , default : new mongoose.Schema.Types.ObjectId() , required : false},
		source : {type : String , default : "None", required : false},
		created_at : {type : Date , default : Date.now, required : false},
		updated_at : {type : Date , default : Date.now, required : false}
	}, {versionKey : false});

	locationSchema.pre('save' , function (next) {
		var location = {};
		location = this;
		console.info("Location.js line no. : " + 13);
		console.log(location);
		next();
	});

	locationSchema.pre('remove' , function (next) {
		var locRemove = this;
		console.log("Locations.js line no. : " + 21);
		console.log(locRemove , "pre remove");
	});
	return mongoose.model('location', locationSchema);;
}
