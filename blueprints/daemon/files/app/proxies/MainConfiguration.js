// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

export default (Module) => {
  const {
    Configuration,
    initialize, partOf, meta, property, nameBy, mixin
  } = Module.NS;

const {
  FETCH_URL,
} = process.env;

  @initialize
  @partOf(Module)
  class MainConfiguration extends Configuration {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property get url(): string {
      return FETCH_URL;
    }

    @property get manifestPath(): string {
      return '../package.json';
    }

    @property get configPath(): string {
      return `../configs/${this.environment}`;
    }
  }
}
