'use strict';

const fs = require('fs-extra');
const path = require('path');
const walkSync = require('walk-sync');
const chalk = require('chalk');
const stringUtil = require('ember-cli-string-utils');
const uniq = require('ember-cli-lodash-subset').uniq;
const SilentError = require('silent-error');
const sortPackageJson = require('sort-package-json');

const date = new Date();

const normalizeEntityName = require('ember-cli-normalize-entity-name');
const stringifyAndNormalize = require('../../lib/utilities/stringify-and-normalize');
const FileInfo = require('../../lib/models/file-info');

const replacers = {
  'package.json'(content) {
    return this.updatePackageJson(content);
  },
};

// const ADDITIONAL_DEV_DEPENDENCIES = require('./additional-dev-dependencies.json').devDependencies;

const description = 'The default blueprint for leanes-cli addons.';
module.exports = {
  description,
  appBlueprintName: 'app',

  filesToRemove: [
    // 'tests/dummy/app/styles/.gitkeep',
    // 'tests/dummy/app/templates/.gitkeep',
    // 'tests/dummy/app/views/.gitkeep',
    // 'tests/dummy/public/.gitkeep',
    // 'Brocfile.js',
  ],

  updatePackageJson(content) {
    let contents = JSON.parse(content);

    contents.name = stringUtil.dasherize(this.options.entity.name);
    contents.description = this.description;
    delete contents.private;
    contents.scripts = contents.scripts || {};
    contents.keywords = contents.keywords || [];
    contents.dependencies = contents.dependencies || {};
    contents.devDependencies = contents.devDependencies || {};

    if (contents.keywords.indexOf('leanes-addon') === -1) {
      contents.keywords.push('leanes-addon');
    }

    // Object.assign(contents.devDependencies, ADDITIONAL_DEV_DEPENDENCIES);

    // add `leanes-compatibility` script in addons
    contents.scripts['test:leanes-compatibility'] = 'leanes try:each';

    contents['leanes-addon'] = contents['leanes-addon'] || {};
    contents['leanes-addon'].configPath = 'tests/dummy/config';

    return stringifyAndNormalize(sortPackageJson(contents));
  },

  buildFileInfo(intoDir, templateVariables, file) {
    let mappedPath = this.mapFile(file, templateVariables);
    let options = {
      action: 'write',
      outputBasePath: path.normalize(intoDir),
      outputPath: path.join(intoDir, mappedPath),
      displayPath: path.normalize(mappedPath),
      inputPath: this.srcPath(file),
      templateVariables,
      ui: this.ui,
    };

    if (file in replacers) {
      options.replacer = replacers[file].bind(this);
    }

    return new FileInfo(options);
  },

  beforeInstall() {
    const version = require('../../package.json').version;
    const prependEmoji = require('../../lib/utilities/prepend-emoji');

    this.ui.writeLine(chalk.blue(`LeanES CLI v${version}`));
    this.ui.writeLine('');
    this.ui.writeLine(prependEmoji('✨', `Creating a new LeanES addon in ${chalk.yellow(process.cwd())}:`));
  },

  afterInstall() {
    let packagePath = path.join(this.path, 'files', 'package.json');
    let bowerPath = path.join(this.path, 'files', 'bower.json');

    [packagePath, bowerPath].forEach((filePath) => {
      fs.removeSync(filePath);
    });
  },

  locals(options) {
    let entity = { name: 'dummy' };
    let rawName = entity.name;
    let name = stringUtil.dasherize(rawName);
    let namespace = stringUtil.classify(rawName);

    let addonEntity = options.entity;
    let addonRawName = addonEntity.name;
    let addonName = stringUtil.dasherize(addonRawName);
    let addonNamespace = stringUtil.classify(addonRawName);

    let hasOptions = options.welcome || options.yarn;
    let blueprintOptions = '';
    if (hasOptions) {
      let indent = `\n            `;
      let outdent = `\n          `;

      blueprintOptions =
        indent +
        [options.welcome && '"--welcome"', options.yarn && '"--yarn"'].filter(Boolean).join(',\n            ') +
        outdent;
    }

    return {
      name,
      modulePrefix: name,
      namespace,
      addonName,
      addonNamespace,
      year: date.getFullYear(),
      yarn: options.yarn,
      welcome: options.welcome,
      blueprint: 'addon',
      blueprintOptions,
      lang: options.lang,
    };
  },

  files() {
    let appFiles = this.lookupBlueprint(this.appBlueprintName).files();
    let addonFilesPath = this.filesPath(this.options);
    let addonFiles = walkSync(addonFilesPath);

    return uniq(appFiles.concat(addonFiles));
  },

  mapFile() {
    let result = this._super.mapFile.apply(this, arguments);
    return this.fileMapper(result);
  },

  fileMap: {
    '^app/.gitkeep': 'app/.gitkeep',
    '^app.*': 'tests/dummy/:path',
    '^config.*': 'tests/dummy/:path',
    '^public.*': 'tests/dummy/:path',

    '^addon-config/environment.js': 'config/environment.js',
    '^addon-config/ember-try.js': 'config/ember-try.js',

    '^npmignore': '.npmignore',
  },

  fileMapper(path) {
    for (let pattern in this.fileMap) {
      if (new RegExp(pattern).test(path)) {
        return this.fileMap[pattern].replace(':path', path);
      }
    }

    return path;
  },

  normalizeEntityName(entityName) {
    entityName = normalizeEntityName(entityName);

    if (this.project.isLeanesCLIProject() && !this.project.isLeanesCLIAddon()) {
      throw new SilentError('Generating an addon in an existing leanes-cli project is not supported.');
    }

    return entityName;
  },

  srcPath(file) {
    let path = `${this.path}/files/${file}`;
    let superPath = `${this.lookupBlueprint(this.appBlueprintName).path}/files/${file}`;
    return fs.existsSync(path) ? path : superPath;
  },
};
