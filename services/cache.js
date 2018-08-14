const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  // console.log('im about to run a query');
  // console.log(this.getQuery());
  // console.log(this.mongooseCollection.name);
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));
  // console.log(key);

  // See if we have a value for key in redis
  const cacheValue = await client.get(key);
  //If we do, return that.
  if (cacheValue) {
    console.log(cacheValue);
  }
  //Otherwsie, issue the query and store in the results
  // return exec.apply(this, arguments);

  const result = await exec.apply(this, arguments);
  console.log(result);
};
