module.exports = function (db , utils) {
	/*
	user data controller
	*/

	return  {
		create : function (req , res , next) {
			if(req.body.email.indexOf('@') == -1 && req.body.email.indexOf('.') == -1) {
				return utils.error(res, 403, 'Requires valid email address')
			}
			else if(req.body.first_name.length == 0) {
				return utils.error(res, 403, 'Requires valid name')
			}
			db.User.findOne({'email' : req.body.email} ,  function (err , user) {
				if(!err && user) {
					console.log("User found %s" , user.email);
					var accountFlag = false;
					user.social_id.forEach(function (socialId) {
						console.log(socialId);
						if(socialId.social === req.body.social_id[0].social && socialId.id === req.body.social_id[0].id) {
							accountFlag = true;
						}
					});
					console.log(accountFlag);
					console.log(user._id);
					if(!accountFlag) {
						db.User.update({'_id' : utils.id(user._id.toString())} , {'$push' :  {"social_id": req.body.social_id[0]} } , function (err , upuser) {
							console.log(user);
							user.social_id = req.body.social_id;
							res.json(user);
						})
					}else{
						return utils.error(res, 403, "account already in exist");
					}
				}else{
					new db.User(req.body).save(function (err , user) {
						if(err) {
							return utils.error(res, 403, "email address is already in use");
						}
						else if(!user) {
							return utils.error(res, 403, "invalid user parameters");
						}
						req.session.user = user;
						res.json(user);

					})
				}
			})
		},

		list : function (req , res , next) {
			db.User.find({role : req.params.role} ,  function (err , userList) {
				console.log(userList);
				res.send(userList || []);
			})
		},

		show : function (req , res , next) {
			db.User.findById(utils.id(req.params.id)).populate("trainer").exec(function (err , user) {
				if(err || !user) {
					 return utils.error(res, 403, 'Invalid user')
				}else{
					res.json(user);
				}
			})
		},

		login : function (req , res , next) {
			db.User.findOne({email : req.body.email}, function (err , user) {
				console.log(user);
				if(err || !user) {
					return utils.error(res , 403 , "invalid user");
				}
				else if(req.params.role != user.role) {
					return utils.error(res, 403, "invalid user privilage");
				}
				user.authenticate(req.body.password , function (err, isValid) {
					//console.log(isValid , err);
					if(err || !isValid) {
						return utils.error(res , 403 , "Invalid user");
					}
					req.session.user = user;
					res.json(user);
				})
			})
		},

		logout : function (req , res, next) {
			res.status(200).end();
		},

		password : function (req , res, next) {
			db.User.findByIdAndUpdate(req.session.user._id , req.body , function (err , user) {
				if(err || !user) {
					return utils.error(res , 403 , "Invalid request");
				}
				res.json(user);
			})
		},

		auth : function (req , res , next) {
			console.log(req.Authorization)
			if(req.session.user == undefined) {
				return utils.error(res , 403 , "invalid session");
			}
			res.send();
		},

		delete : function (req , res, next) {
			db.User.findOne({email : req.session.user.email} , function (err , user) {
				if(err || !user) {
					return utils.error(res , 404 , "user not found");
				}
				user.authenticate(req.body.password , function (err , isValid) {
					if(err || !isValid) {
						return utils.error(res , 403 , "invalid password");
					}
					user.remove();
					res.send();
				})
			})
		}
	}
};
