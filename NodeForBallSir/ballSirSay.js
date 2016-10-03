var restify = require('restify');
var mongodb = require('./dao/mongodb');
var config = require('./configure/config');


var server = restify.createServer({
    name : "myapp"
});
if (process.argv[3] != null) {
    process.env['NODE_ENV'] = process.argv[3];
  }

console.log(process.env['NODE_ENV']);

mongodb.init(config['development'], function(err, result) {
if (err) {
  process.exit(1);
}
if (result) {
  return console.log("successfully connect mongodb");
}
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var api = require('./configure/api')(server);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});


