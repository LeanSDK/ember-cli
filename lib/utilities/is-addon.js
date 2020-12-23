'use strict';

module.exports = function isAddon(keywords) {
  return Array.isArray(keywords) && keywords.indexOf('leanes-addon') >= 0;
};
