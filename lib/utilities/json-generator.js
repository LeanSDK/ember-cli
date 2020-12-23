'use strict';

const lookupCommand = require('../cli/lookup-command');
const stringUtils = require('ember-cli-string-utils');
const RootCommand = require('./root-command');
const versionUtils = require('./version-utils');
const leanesCLIVersion = versionUtils.leanesCLIVersion;

class JsonGenerator {
  constructor(options) {
    options = options || {};

    this.ui = options.ui;
    this.project = options.project;
    this.commands = options.commands;
    this.tasks = options.tasks;
  }

  generate(commandOptions) {
    const rootCommand = new RootCommand({
      ui: this.ui,
      project: this.project,
      commands: this.commands,
      tasks: this.tasks,
    });

    const json = rootCommand.getJson(commandOptions);
    json.version = leanesCLIVersion();
    json.commands = [];
    json.addons = [];

    Object.keys(this.commands).forEach(function (commandName) {
      this._addCommandHelpToJson(commandName, commandOptions, json);
    }, this);

    if (this.project.eachAddonCommand) {
      this.project.eachAddonCommand((addonName, commands) => {
        this.commands = commands;

        const addonJson = { name: addonName };
        addonJson.commands = [];
        json.addons.push(addonJson);

        Object.keys(this.commands).forEach(function (commandName) {
          this._addCommandHelpToJson(commandName, commandOptions, addonJson);
        }, this);
      });
    }

    return json;
  }

  _addCommandHelpToJson(commandName, options, json) {
    const command = this._lookupCommand(commandName);
    if (!command.skipHelp && !command.unknown) {
      json.commands.push(command.getJson(options));
    }
  }

  _lookupCommand(commandName) {
    const Command = this.commands[stringUtils.classify(commandName)] || lookupCommand(this.commands, commandName);

    return new Command({
      ui: this.ui,
      project: this.project,
      commands: this.commands,
      tasks: this.tasks,
    });
  }
}

module.exports = JsonGenerator;
