'use strict';

const EventEmitter = require('events').EventEmitter;
const path = require('path');

class MockServerWatcher extends EventEmitter {
  then() {
    let promise = Promise.resolve({
      directory: path.resolve(__dirname, '../fixtures/express-server'),
    });
    return promise.then.apply(promise, arguments);
  }
}

module.exports = MockServerWatcher;
