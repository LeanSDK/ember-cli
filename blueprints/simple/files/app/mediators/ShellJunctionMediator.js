// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

import type { NotificationInterface } from '../interfaces/NotificationInterface';
import type { PipeMessageInterface } from '../interfaces/PipeMessageInterface';

export default (Module) => {
  const {
    Pipes,
    Application,
    LoggingJunctionMixin,
    initialize, partOf, meta, property, method, nameBy, mixin
  } = Module.NS;

  const {
    Junction, PipeAwareModule, LogMessage, Pipe, TeeSplit, TeeMerge,
    JunctionMediator,
  } = Pipes.NS;

  const { CONNECT_MODULE_TO_SHELL, CONNECT_SHELL_TO_LOGGER } = Application;
  const { INPUT, OUTPUT } = Junction;
  const { STDIN, STDOUT, STDLOG, STDSHELL } = PipeAwareModule;
  const { SEND_TO_LOG, LEVELS, DEBUG } = LogMessage;

  @initialize
  @partOf(Module)
  @mixin(LoggingJunctionMixin)
  class ShellJunctionMediator extends JunctionMediator {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @method listNotificationInterests(): string[] {
      const interests = super.listNotificationInterests(... arguments);
      interests.push(CONNECT_MODULE_TO_SHELL);
      return interests;
    }

    @method async handleNotification<T = ?any>(note: NotificationInterface<T>): Promise<void> {
      switch (note.getName()) {
        case (CONNECT_MODULE_TO_SHELL):
          this.send(
            SEND_TO_LOG, 'Connecting new module instance to Shell.', LEVELS[DEBUG]
          );
          // Connect a module's STDSHELL to the shell's STDIN
          const module = note.getBody();
          const moduleToShell = Pipe.new();
          module.acceptOutputPipe(STDSHELL, moduleToShell);
          const shellIn = this._junction.retrievePipe(STDIN);
          shellIn.connectInput(moduleToShell);
          // Connect the shell's STDOUT to the module's STDIN
          const shellToModule = Pipe.new();
          module.acceptInputPipe(STDIN, shellToModule);
          const shellOut = this._junction.retrievePipe(STDOUT);
          shellOut.connect(shellToModule);
          break;
        default:
          await super.handleNotification(note);
      }
    }

    @method async handlePipeMessage(msg: PipeMessageInterface): Promise<void> {
      return;
    }

    @method onRegister() {
      super.onRegister();
      // The STDOUT pipe from the shell to all modules
      this._junction.registerPipe(STDOUT, OUTPUT, TeeSplit.new());
      // The STDIN pipe to the shell from all modules
      this._junction.registerPipe(STDIN, INPUT, TeeMerge.new());
      this._junction.addPipeListener(STDIN, this, this.handlePipeMessage);
      // The STDLOG pipe from the shell to the logger
      this._junction.registerPipe(STDLOG, OUTPUT, Pipe.new());
      this.send(CONNECT_SHELL_TO_LOGGER, this._junction);
    }

    constructor() {
      super(... arguments);
      this.setViewComponent(Junction.new());
    }
  }
}
