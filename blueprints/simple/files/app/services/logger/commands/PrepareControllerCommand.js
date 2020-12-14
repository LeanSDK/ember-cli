// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

import type { NotificationInterface } from '../../../interfaces/NotificationInterface';

export default (Module) => {
  const {
    LOG_MSG,
    Command,
    initialize, partOf, meta, method, nameBy
  } = Module.NS;

  @initialize
  @partOf(Module)
  class PrepareControllerCommand extends Command {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @method execute<T = ?any>(note: NotificationInterface<T>): void {
      this.facade.addCommand(LOG_MSG, 'LogMessageCommand');
    }
  }
}
