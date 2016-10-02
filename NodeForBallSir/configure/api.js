module.exports = function(server) {
	var user = require('../routes/user');
	server.get('/api/user/:aid/show', user.login);
}