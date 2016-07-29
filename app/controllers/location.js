module.exports = function (db , utils) {
	/*
	user data controller
	*/

	return  {
		create : function (req , res , next) {
			if(!req.body.uid) {
				return utils.error(res, 403, 'Requires valid used id')
			}
			else if(!req.body.location) {
				return utils.error(res, 403, 'Requires valid location')
			}
			new db.Location(req.body).save(function (err , location) {
				if(err) {
					return utils.error(res, 403, "record already found");
				}
				else if(!location) {
					return utils.error(res, 403, "invalid user parameters");
				}
				console.log("location.js line no. : " + 21);
				console.log(location);
				res.json(location);

			})
		},

		createAll : function (req , res , next) {
			var locationData = req.body.data;
			var invalidDataFlag = false;
			for(var idx in locationData) {
				if(!(locationData[idx].spid && locationData[idx].location.lat && locationData[idx].location.lng)){
					invalidDataFlag = true;
					break;
				}else{
					locationData[idx].uid = req.body.uid;
				}
			}
			if(!(req.body.uid)) {
				return utils.error(res, 403, 'Requires valid used id')
			}
			else if (!(locationData && invalidDataFlag)) {
				return utils.error(res, 403, 'Requires valid location')
			}
			locationData.forEach(function (locVal) {
				new db.Location(locVal).save(function (err , location) {
					if(err) {
						return utils.error(res, 403, "record already found");
					}
					else if(!location) {
						return utils.error(res, 403, "invalid user parameters");
					}
					console.log("location.js line no. : " + 21);
					console.log(location);
				})
			});

			res.json({'success' : true});
		},

		update : function (req , res, next) {
			db.Location.findById(utils.id(req.params.id) , req.body , function (err , location) {
				if(err || !location) {
					 return utils.error(res, 403, 'Invalid location id')
				}else{
					res.json(location);
				}
			})
		},

		list : function (req , res , next) {
			console.log(utils.id(req.params.id));
			db.Location.find({"uid" : utils.id(req.params.id)}, {location : 1, _id : 0} ,  function (err , locList) {
				console.log(locList);
				res.send(locList || []);
			})
		},

		byLastUpdated : function (req , res , next) {
			db.Location.find({} , { "sort" : {"updated_at": -1} , "limit" : 1} ,  function (err , locList) {
				console.log(locList);
				res.send(locList || {});
			})
		},

		show : function (req , res , next) {
			db.Location.findById(utils.id(req.params.id)).exec(function (err , location) {
				if(err || !location) {
					 return utils.error(res, 403, 'Invalid location id')
				}else{
					res.json(location);
				}
			})
		}
	}
};