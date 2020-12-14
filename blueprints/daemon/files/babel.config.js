// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

module.exports = {
  babelrcRoots: [
    "node_modules/@leansdk/leanes",
    "node_modules/@leansdk/leanes-fs-utils-addon",
    "node_modules/@leansdk/leanes-configurable-addon",
    "node_modules/@leansdk/leanes-mapper-addon",
    "node_modules/@leansdk/leanes-mongo-addon",
    "node_modules/@leansdk/leanes-queryable-addon",
  ],
  exclude: [/node_modules\/(?![@leansdk\/leanes])/],
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
    "@babel/plugin-transform-runtime"
  ],
}
