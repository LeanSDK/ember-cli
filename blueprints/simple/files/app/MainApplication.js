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
    APPLICATION_PROXY,
    Pipes,
    Application,
    initialize, partOf, meta, property, method, nameBy,
    Utils: { _ }
  } = Module.NS;

  const {
    LogMessage: { DEBUG },
    LogFilterMessage: { SET_LOG_LEVEL }
  } = Pipes.NS;

  @initialize
  @partOf(Module)
  class MainApplication extends Application {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property initialState: object = null;

    @method setLogLevelMethod(level: number): void {
      this.send(SET_LOG_LEVEL, level);
    }

    @method sendEvent(name, body, type = 'Event') {
      this.send(name, body, type);
    }

    @method setState(state): void {
      const appProxy = this.facade.getProxy(APPLICATION_PROXY);
      appProxy.setState(state);
    }

    @method getState(): object {
      const appProxy = this.facade.getProxy(APPLICATION_PROXY);
      return appProxy.getData();
    }

    constructor(data: ?(Symbol | object)) {
      const { ApplicationFacade } = Module.NS;
      const symbol = _.isSymbol(data)
        ? data
        : null;
      super(Module.name, ApplicationFacade, symbol);
      this.dispatch = this.sendEvent.bind(this);
      if (!_.isSymbol(data) && _.isObject(data)) {
        this.initialState = data;
      }
    }
  }
}
