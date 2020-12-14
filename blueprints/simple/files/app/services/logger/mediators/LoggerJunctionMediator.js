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
import type { PipeMessageInterface } from '../../../interfaces/PipeMessageInterface';

export default (Module) => {
  const {
    LOG_MSG,
    Pipes,
    initialize, partOf, meta, property, method, nameBy
  } = Module.NS;

  const {
    JunctionMediator, LogFilterMessage, PipeAwareModule, PipeListener,
    Junction, TeeMerge, Filter
  } = Pipes.NS;

  const { STDIN } = PipeAwareModule;
  const { INPUT } = Junction;
  const { ACCEPT_INPUT_PIPE } = JunctionMediator;
  const { LOG_FILTER_NAME, filterLogByLevel } = LogFilterMessage;

  @initialize
  @partOf(Module)
  class LoggerJunctionMediator extends JunctionMediator {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @method listNotificationInterests(): string[] {
      return super.listNotificationInterests(... arguments);
    }

    @method handleNotification<T = ?any>(note: NotificationInterface<T>): ?Promise<void> {
      switch (note.getName()) {
        case (ACCEPT_INPUT_PIPE):
          const name = note.getType();
          if (name === STDIN) {
            const pipe = note.getBody();
            const tee = this._junction.retrievePipe(STDIN);
            tee.connectInput(pipe);
          } else {
            super.handleNotification(note);
          }
          break;
        default:
          super.handleNotification(note);
      }
    }

    @method async handlePipeMessage(msg: PipeMessageInterface): Promise<void> {
      this.send(LOG_MSG, msg);
    }

    @method onRegister(): void {
      super.onRegister();
      const teeMerge = TeeMerge.new();
      const filter = Filter.new(LOG_FILTER_NAME, null, filterLogByLevel);
      filter.connect(PipeListener.new(this, this.handlePipeMessage));
      teeMerge.connect(filter);
      this._junction.registerPipe(STDIN, INPUT, teeMerge);
    }

    constructor() {
      super(... arguments);
      this.setViewComponent(Junction.new());
    }
  }
}
