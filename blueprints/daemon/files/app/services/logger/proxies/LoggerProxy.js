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
    Pipes,
    Proxy,
    initialize, partOf, meta, method, nameBy
  } = Module.NS;
  const {
    LogMessage: { CHANGE, NONE, FATAL, ERROR, WARN, INFO, DEBUG }
  } = Pipes.NS;

  @initialize
  @partOf(Module)
  class LoggerProxy extends Proxy {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @method addLogEntry(data: object): void {
      const { logLevel, sender, time, message } = data;
      switch (logLevel) {
        case FATAL:
        case ERROR:
          console.error(sender, '->', message);
          break;
        case INFO:
          console.info(sender, '->', message);
          break;
        case DEBUG:
          console.log(sender, '->', message);
          break;
        case WARN:
          console.warn(sender, '->', message);
          break;
        default:
          console.log(sender, '->', message);
      }
    }
  }
}
