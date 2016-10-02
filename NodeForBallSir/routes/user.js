module.exports = {
  login: function(req, res, next) {
      return _successMessage(res, next, "hao");
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