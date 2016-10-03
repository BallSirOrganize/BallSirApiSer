// Generated by CoffeeScript 1.7.1
var MongoClient, ReadPreference, async, dbName, dns, mongoLogger, mongodb, replicaset, secondaryPreferred, util, _create, _database, _getConnectionUrl, _getDbConfig, _getOption, _getReplSetConfig, _getServerConfig,
  __hasProp = {}.hasOwnProperty;

dns = require('../utils/dns');

util = require('util');

async = require('async');

mongodb = require('mongodb');

MongoClient = require('mongodb').MongoClient;

ReadPreference = require('mongodb').ReadPreference;

dbName = '';

_database = null;

_create = null;

replicaset = '';

secondaryPreferred = {
  readPreference: ReadPreference.SECONDARY_PREFERRED
};

// mongoLogger = (require('../utils/log')).getLogger({
//   name: 'mongodb_driver',
//   level: 'debug'
// });

module.exports = {
  init: function(_arg, done) {
    var connectionOption, database, domain, poolSize, port, pwd, user;
    domain = _arg.domain, port = _arg.port, poolSize = _arg.poolSize, user = _arg.user, pwd = _arg.pwd, database = _arg.database;
    dbName = database;
    poolSize = poolSize || 100;
    connectionOption = _getOption(poolSize);
    _create = function(callback) {
      return async.waterfall([
        function(cb) {
          return cb(null, ['127.0.0.1']);
          // if (process.env['NODE_ENV'] === 'production') {
          //   return dns.resolve4(domain, cb);
          // } else {
          //   // return cb(null, ['192.168.1.219']);
          //   return cb(null, ['127.0.0.1']);
          // }
        }, function(addresses, cb) {
          var connectionUrl;
          connectionUrl = _getConnectionUrl(dbName, user, pwd, port, addresses);
          console.log("******mongoURL******");
          console.log(connectionUrl);
          console.log("********************");
          return MongoClient.connect("mongodb://127.0.0.1:27017/ballsir", connectionOption, cb);
        }
      ], (function(_this) {
        return function(err, database) {
          if (err) {
            console.log("mongodbError:"+err);
            // mongoLogger.logError("" + (util.inspect(err)));
          }
          if (err) {
            return done(err);
          }
          _database = database;
          _database.databaseName = dbName;
          return callback(null, _database);
        };
      })(this));
    };
    return _create(done);
  },
  db: function() {
    var done, i, option, tasks, tasksCount, _i;
    done = arguments[arguments.length - 1];
    if (typeof done !== 'function') {
      throw new Error("last argument is not a function. " + (util.inspect(arguments)));
    }
    option = arguments[arguments.length - 2];
    if (typeof option === 'object' && !(option instanceof Array)) {
      tasksCount = arguments.length - 2;
    } else {
      option = void 0;
      tasksCount = arguments.length - 1;
    }
    if (!tasksCount) {
      throw new Error("no task is specified. " + (util.inspect(arguments)));
    }
    tasks = [
      function(cb) {
        if (_database) {
          return cb(null, _database);
        }
        return _create(cb);
      }, function(db, cb) {
        _database = db;
        return cb(null, db);
      }
    ];
    for (i = _i = 1; _i <= tasksCount; i = _i += 1) {
      tasks = tasks.concat(arguments[i - 1]);
    }
    return async.waterfall(tasks, function() {
      return done.apply(null, arguments);
    });
  },
  collection: function() {
    var argv, name;
    argv = Array.prototype.slice.call(arguments, 0);
    name = arguments[0];
    argv[0] = function(db, done) {
      return db.collection(name, done);
    };
    return this.db.apply(this, argv);
  },
  findOne: function(name, criteria, readPrefe, callback) {
    if (arguments.length === 3) {
      callback = readPrefe;
      readPrefe = secondaryPreferred;
    }
    if (typeof name !== 'string') {
      throw new Error("name[" + (util.inspect(name)) + "] should be a string");
    }
    if (!criteria) {
      throw new Error("criteria[" + (util.inspect(criteria)) + "] is not available");
    }
    if (typeof criteria !== 'object') {
      criteria = {
        _id: criteria
      };
    }
    return this.collection(name, function(err, collection) {
      if (err) {
        return callback(err);
      }
      return collection.findOne(criteria, readPrefe, callback);
    });
  },
  find: function(name, query, field, done) {
    if (done) {
      field.timeout = true;
      field.maxTimeMS = 500;
    } else {
      done = field;
      field = {};
      field.timeout = true;
      field.maxTimeMS = 500;
    }
    return this.collection(name, function(err, collection) {
      var curso;
      if (err) {
        return done(err);
      }
      curso = collection.find(query, field);
      return curso.toArray(function(err, docs) {
        if (err) {
          return done(err);
        }
        return done(null, docs);
      });
    });
  },
  findBySort: function(name, query, sort, field, done) {
    return this.collection(name, function(err, collection) {
      var curso;
      if (err) {
        return done(err);
      }
      curso = collection.find(query, field);
      curso.sort(sort);
      return curso.toArray(function(err, docs) {
        if (err) {
          return done(err);
        }
        return done(null, docs);
      });
    });
  },
  count: function(name, criteria, done) {
    if (!done) {
      done = criteria;
      criteria = {};
    }
    return this.collection(name, function(err, collection) {
      if (err) {
        return done(err);
      }
      return collection.count(criteria, done);
    });
  },
  update: function(name, criteria, document, opt, done) {
    var k, pureObject;
    if (!done) {
      done = opt;
      opt = {};
    }
    pureObject = true;
    for (k in document) {
      if (!__hasProp.call(document, k)) continue;
      if (!(k[0] === '$')) {
        continue;
      }
      pureObject = false;
      break;
    }
    if (pureObject) {
      document = {
        $set: document
      };
    }
    return this.collection(name, function(err, collection) {
      if (err) {
        return done(err);
      }
      return collection.update(criteria, document, opt, done);
    });
  },
  findAndModify: function(name, criteria, document, opt, done) {
    var k, pureObject;
    if (!done) {
      done = opt;
      opt = {};
    }
    pureObject = true;
    for (k in document) {
      if (!__hasProp.call(document, k)) continue;
      if (!(k[0] === '$')) {
        continue;
      }
      pureObject = false;
      break;
    }
    if (pureObject) {
      document = {
        $set: document
      };
    }
    return this.collection(name, function(err, collection) {
      if (err) {
        return done(err);
      }
      return collection.findAndModify(criteria, {}, document, opt, done);
    });
  },
  findAndRemove: function(name, query, sort, done) {
    return this.collection(name, function(err, collection) {
      if (err) {
        return done(err);
      }
      return collection.findAndRemove(query, sort || {}, function(err, result) {
        if (err) {
          return done(err);
        }
        return done(null, result);
      });
    });
  },
  insert: function(name, value, done) {
    return this.collection(name, function(err, collection) {
      if (err) {
        return done(err);
      }
      return collection.insert(value, {
        safe: true
      }, function(err, result) {
        if (err) {
          return done(err);
        }
        return done(null, result[0]);
      });
    });
  },
  drain: function(restart) {
    if (_database) {
      _database.close();
    }
    return _database = null;
  }
};

_getConnectionUrl = function(dbName, user, pwd, port, addresses) {
  var address, i, urls, _i, _j, _len, _len1;
  if (process.env['NODE_ENV'] === 'development') {
    urls = '';
    for (i = _i = 0, _len = addresses.length; _i < _len; i = ++_i) {
      address = addresses[i];
      urls += "" + address + ":" + port;
      if (i + 1 !== addresses.length) {
        urls += ',';
      }
    }
    console.log("mongodb://" + urls + "/" + dbName);
    return "mongodb://" + urls + "/" + dbName;
  }
  urls = '';
  for (i = _j = 0, _len1 = addresses.length; _j < _len1; i = ++_j) {
    address = addresses[i];
    urls += "" + user + ":" + pwd + "@" + address + ":" + port;
    if (i + 1 !== addresses.length) {
      urls += ',';
    }
  }
  console.log("mongodb://" + urls + "/" + dbName);
  return "mongodb://" + urls + "/" + dbName;
};

_getOption = function(poolSize) {
  return {
    db: _getDbConfig(),
    server: _getServerConfig(poolSize),
    replSet: _getReplSetConfig(poolSize)
  };
};

_getDbConfig = function() {
  return {
    w: 1,
    native_parser: false,
    readPreference: ReadPreference.SECONDARY_PREFERRED
  };
};

_getServerConfig = function(poolSize) {
  if (poolSize == null) {
    poolSize = 50;
  }
  return {
    readPreference: ReadPreference.SECONDARY_PREFERRED,
    poolSize: poolSize,
    auto_reconnect: true,
    socketOptions: {
      connectTimeoutMS: 5000,
      keepAlive: 1
    }
  };
};

_getReplSetConfig = function(poolSize) {
  if (poolSize == null) {
    poolSize = 50;
  }
  return {
    ha: true,
    poolSize: poolSize,
    haInterval: 1000,
    reconnectWait: 5000,
    retries: 500,
    // rs_name: replicaset,
    readPreference: ReadPreference.SECONDARY_PREFERRED,
    socketOptions: {
      connectTimeoutMS: 5000,
      keepAlive: 1
    }
  };
};
