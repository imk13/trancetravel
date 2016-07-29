module.exports = function (config , db) {
	db.User.findOne({email:config.admin.email , role : 'admin'} , function (err , adm) {
		console.log(adm , err);
		if(adm) {
			config.admin = adm;
		}
		else if(!err) {
			new db.User(config.admin).save(function (err , admin) {
				if(err || !admin) {
				}
				else {
					config.admin = admin;
				}
			})
		}else{
			if(err || !adm) return;
		}

	})
}
