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
    STARTUP,
    Facade,
    initialize, partOf, meta, property, method, nameBy
  } = Module.NS;

  @initialize
  @partOf(Module)
  class ApplicationFacade extends Facade {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property _isInitialized: boolean = false;

    @method startup(app) {
      if (!this._isInitialized) {
        this._isInitialized = true;
        this.send(STARTUP, app);
      }
    }

    @method initializeFacade(): void {
      super.initializeFacade(... arguments)
      this.rebind('ApplicationModule').toConstructor(this.Module);
      this.addCommand(STARTUP, 'StartupCommand');
    }
  }
}
