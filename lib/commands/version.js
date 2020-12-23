'use strict';

const Command = require('../models/command');
const leanesCLIVersion = require('../utilities/version-utils').leanesCLIVersion;

module.exports = Command.extend({
  name: 'version',
  description: 'outputs leanes-cli version',
  aliases: ['v', '--version', '-v'],
  works: 'everywhere',

  availableOptions: [{ name: 'verbose', type: Boolean, default: false }],

  run(options) {
    this.printVersion('leanes-cli', leanesCLIVersion());

    let versions = process.versions;
    versions['os'] = `${process.platform} ${process.arch}`;

    let alwaysPrint = ['node', 'os'];

    for (let module in versions) {
      if (options.verbose || alwaysPrint.indexOf(module) > -1) {
        this.printVersion(module, versions[module]);
      }
    }
  },

  printVersion(module, version) {
    this.ui.writeLine(`${module}: ${version}`);
  },
});
