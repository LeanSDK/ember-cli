// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

type infoResult = {
  name: string,
  description: string,
  license: string,
  version: string,
  keywords: string[]
}

export default (Module) => {
  const {
    NON_RENDERABLE,
    Resource,
    CorsMiddlewareMixin, ConfigurableMixin,
    initialize, partOf, nameBy, meta, action, chains, mixin,
  } = Module.NS;

  @initialize
  @chains([
    'info', 'cors'
  ], function () {
    this.initialHook('useCORS', {
      only: ['cors']
    });
  })
  @partOf(Module)
  @mixin(CorsMiddlewareMixin)
  @mixin(ConfigurableMixin)
  class ItselfResource extends Resource {
    @nameBy static __filename = __filename;
    @meta static object = {};

    @action async cors(): Promise<typeof NON_RENDERABLE> {
      return NON_RENDERABLE
    }

    @action async info(): Promise<infoResult> {
      const {
        name,
        description,
        license,
        version,
        keywords,
      } = this.configs
      return {
        name,
        description,
        license,
        version,
        keywords,
      }
    }
  }
}
