var mongodb = require('../dao/mongodb');
var user = require('../models/user');

module.exports = {
    login: function(req, res, next) {
      var userItem = {
        account:"caiyidong",
        password:"Cyd1404008"
      }
      user.create(userItem,function(err,result){
        return _successMessage(res, next, "hao");
      });
    },
    register: function(req, res, next){
    	return _successMessage(res, next, "good");
    },
    findUser: function(req, res, next){
    	return _successMessage(res, next, "good");
    },
    userAsk: function(req, res, next){
      return _successMessage(res, next, "I am listening");
    }
    
}

_successMessage = function(res, next, sendData) {
  res.statusCode = 200;
  res.send({
    state: true,
    result: sendData
  });
  return next();
};