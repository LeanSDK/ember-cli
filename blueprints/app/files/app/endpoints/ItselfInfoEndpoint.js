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
    SwaggerEndpoint,
    initialize, partOf, nameBy, meta,
    Utils: { joi }
  } = Module.NS;

  @initialize
  @partOf(Module)
  class ItselfInfoEndpoint extends SwaggerEndpoint {
    @nameBy static __filename = __filename;
    @meta static object = {};

    constructor() {
      super(...arguments);
      this.response(joi.object({
          info: joi.object({
            name: joi.string(),
            description: joi.string(),
            license: joi.string(),
            version: joi.string(),
            keywords: joi.array().items(joi.string()),
          })
        }), 'Information')
        .summary('Service info')
        .description('Info about this service')
    }
  }
}
