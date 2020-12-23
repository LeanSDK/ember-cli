'use strict';

const Command = require('../models/command');

module.exports = Command.extend({
  isRoot: true,
  name: 'leanes',

  anonymousOptions: ['<command (Default: help)>'],
});
