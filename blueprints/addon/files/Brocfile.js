// This file is part of <%= addonName %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

const mergeTrees = require('broccoli-merge-trees');
const Rollup = require("broccoli-rollup");
const babel = require("rollup-plugin-babel");
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const globals = require('rollup-plugin-node-globals');
const { terser } = require('rollup-plugin-terser');

const appRoot = __dirname + '/addon';

const extensions = [".ts", ".js"];

const dev = new Rollup(appRoot, {
  inputFiles: ["**/*.js"],
  annotation: "<%= addonName %>",
  rollup: {
    input: __dirname + "/addon/index.js",
    external: [
      'crypto',
      'net',
      'dns',
      'stream',
      'buffer',
      'events',
      'querystring',
      'url'
    ],
    plugins: [
      json({
        extensions,
        include: 'node_modules/**',
        preferConst: true,
        indent: '  ',
        compact: true,
        namedExports: true
      }),
      nodeResolve({
        extensions,
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: 'node_modules/**',
        preferBuiltins: false
      }),
      babel({
        extensions,
        sourceMap: true,
        runtimeHelpers: true,
        exclude: "node_modules/**",
        presets: [
          "@babel/preset-env"
        ],
        plugins: [
          "@babel/plugin-syntax-flow",
          ["flow-runtime", {
            "assert": true,
            "annotate": true
          }],
          "@babel/plugin-transform-flow-strip-types",
          ["@babel/plugin-proposal-decorators", { "legacy": true }],
          ["@babel/plugin-proposal-class-properties", { "loose": true }],
          "@babel/plugin-transform-runtime",
        ],
      }),
      globals({
        sourceMap: false,
        process: false,
        buffer: false,
        dirname: true,
        filename: true,
        global: false,
        baseDir: process.cwd() + "/addon/"
      }),
    ],
    output: {
      name: "<%= addonName %>",
      dir: __dirname + '/lib',
      entryFileNames: 'index.dev.js',
      format: "cjs",
      sourcemap: true,
    },
  }
});

const prod = new Rollup(appRoot, {
  inputFiles: ["**/*.js"],
  annotation: "<%= addonName %>",
  rollup: {
    input: __dirname + "/addon/index.js",
    external: [
      'crypto',
      'net',
      'dns',
      'stream',
      'buffer',
      'events',
      'querystring',
      'url'
    ],
    plugins: [
      json({
        extensions,
        include: 'node_modules/**',
        preferConst: true,
        indent: '  ',
        compact: true,
        namedExports: true
      }),
      nodeResolve({
        extensions,
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: 'node_modules/**',
        preferBuiltins: false
      }),
      babel({
        extensions,
        sourceMap: false,
        runtimeHelpers: true,
        exclude: "node_modules/**",
        presets: [
          "@babel/preset-env"
        ],
        plugins: [
          "@babel/plugin-syntax-flow",
          "@babel/plugin-transform-flow-strip-types",
          ["@babel/plugin-proposal-decorators", { "legacy": true }],
          ["@babel/plugin-proposal-class-properties", { "loose": true }],
          "@babel/plugin-transform-runtime",
        ],
      }),
      globals({
        sourceMap: false,
        process: false,
        buffer: false,
        dirname: true,
        filename: true,
        global: false,
        baseDir: process.cwd() + "/addon/"
      }),
    ],
    output: {
      name: "<%= addonName %>",
      dir: __dirname + '/lib',
      entryFileNames: 'index.min.js',
      format: "cjs",
      sourcemap: false,
        plugins: [
          terser()
        ]
    },
  }
});

module.exports = options => {
  if (options.env == 'production') {
    return mergeTrees([prod], { annotation: "Final output" });
  } else if (options.env == 'development') {
    return mergeTrees([dev], { annotation: "Final output" });
  }
};
