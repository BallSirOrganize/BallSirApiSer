var mongodb = require('../dao/mongodb');

module.exports = {
	create: function(userItem, callback){
		console.log("执行create");
		mongodb.insert('user', userItem, function(err, result) {
			console.log("数据库回调");
	        if (err) {
	          log.logError("数据库操作错误：" + err);
	        }
	        return callback(err, result);
      });
	},
	remove: function(userid, callback){
		;
	},
	update: function(userid, callback){
		;
	},
	find: function(userid, callback){
		;
	}
}