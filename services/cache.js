const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache =  function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  //JSON Stringify make sure its a string or a number
  return this;
  //allows the function to be chainable
}

mongoose.Query.prototype.exec = async function () {
  if(!this.useCache) {
    return exec.apply(this, arguments);
  }
  // console.log('im about to run a query');
  // console.log(this.getQuery());
  // console.log(this.mongooseCollection.name);

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));
  // console.log(key);

  // See if we have a value for key in redis
  const cacheValue = await client.hget(this.hashKey, key);
  //If we do, return that.
  if (cacheValue) {
    // console.log(cacheValue);
    // console.log(this);
    // const doc = new this.model(JSON.parse(cacheValue));
    //this only handles one object but we also need to handle arrays

    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
        ? doc.map(d => new this.model(d))
        : new this.model(doc);

    // return doc;


  }
  //Otherwsie, issue the query and store in the results
  // return exec.apply(this, arguments);

  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  // console.log(result.validate);
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
