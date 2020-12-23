'use strict';

const cleanBaseUrl = require('clean-base-url');
const deprecate = require('./deprecate');

module.exports = function isLiveReloadRequest(url, liveReloadPrefix) {
  let regex = /\/livereload$/gi;
  if (url === `${cleanBaseUrl(liveReloadPrefix)}livereload`) {
    return true;
  } else if (regex.test(url)) {
    return true;
  }
  return false;
};
