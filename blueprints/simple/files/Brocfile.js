// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

const mergeTrees = require('broccoli-merge-trees');
const esTranspiler = require('broccoli-babel-transpiler');
const replacer = require('broccoli-string-replace');
const WatchedDir = require('broccoli-source').WatchedDir;

const appRoot = __dirname + '/app';

const devJS = replacer(new WatchedDir(appRoot), {
  files: [ '**/*.js' ],
  patterns: [{
    match: '__LeanES__',
    replacement: '@leansdk/leanes/lib/index.dev',
  }, {
    match: '__ConfigurableAddon__',
    replacement: '@leansdk/leanes-configurable-addon/lib/index.dev',
  }, {
    match: '__FsUtilsAddon__',
    replacement: '@leansdk/leanes-fs-utils-addon/lib/index.dev',
  },]
});
const dev = esTranspiler(devJS, {
  filterExtensions: ["js"],
  browserPolyfill: false,
  sourceMap: 'inline',
  exclude: "node_modules/**",
  presets: [
    ["@babel/preset-env", {targets: {node: '14.9'}, loose: true, useBuiltIns: false}]
  ],
  plugins: [
    "@babel/plugin-syntax-flow",
    ["flow-runtime", {
      "assert": true,
      "annotate": true
    }],
    "@babel/plugin-transform-flow-strip-types",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "babel-plugin-parameter-decorator",
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-transform-runtime",
  ],
});

const prodJS = replacer(appRoot, {
  files: [ '**/*.js' ],
  patterns: [{
    match: '__LeanES__',
    replacement: '@leansdk/leanes',
  }, {
    match: '__ConfigurableAddon__',
    replacement: '@leansdk/leanes-configurable-addon',
  }, {
    match: '__FsUtilsAddon__',
    replacement: '@leansdk/leanes-fs-utils-addon',
  },]
});
const prod = esTranspiler(prodJS, {
  filterExtensions: ["js"],
  browserPolyfill: false,
  exclude: "node_modules/**",
  presets: [
    ["@babel/preset-env", {targets: {node: '14.9'}, loose: true, useBuiltIns: false}]
  ],
  plugins: [
    "@babel/plugin-syntax-flow",
    ["flow-runtime", {
      "assert": false,
      "annotate": false
    }],
    "@babel/plugin-transform-flow-strip-types",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "babel-plugin-parameter-decorator",
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-transform-runtime",
  ],
});

module.exports = options => {
  if (options.env == 'production') {
    return mergeTrees([prod], { annotation: "Final output", overwrite: true });
  } else if (options.env == 'development') {
    return mergeTrees([dev], { annotation: "Final output", overwrite: true });
  }
};
