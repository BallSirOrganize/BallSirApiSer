module.exports = function(server) {
	var user = require('../routes/user');
	server.post('/api/user/login', user.login);
	server.post('/api/user/register', user.register);
	
}