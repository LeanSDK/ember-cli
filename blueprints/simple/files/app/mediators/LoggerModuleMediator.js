// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

import Logger from '../services/logger';
const { LoggerApplication } = Logger.NS;

import type { NotificationInterface } from '../interfaces/NotificationInterface';
import type { PipeAwareInterface } from '../interfaces/PipeAwareInterface';

export default (Module) => {
  const {
    LIGHTWEIGHT,
    Pipes,
    Mediator, Application,
    initialize, partOf, meta, property, method, nameBy
  } = Module.NS;

  const {
    Pipe,
    PipeAwareModule: {
      STDIN, STDOUT, STDLOG, STDSHELL
    },
  } = Pipes.NS;

  const { CONNECT_MODULE_TO_LOGGER, CONNECT_SHELL_TO_LOGGER } = Application;

  @initialize
  @partOf(Module)
  class LoggerModuleMediator extends Mediator {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property get logger(): PipeAwareInterface {
      return this.getViewComponent();
    }

    @method async onRemove(): Promise<void> {
      await super.onRemove();
      await this.logger.finish();
    }

    @method listNotificationInterests(): string[] {
      return [ CONNECT_MODULE_TO_LOGGER, CONNECT_SHELL_TO_LOGGER ];
    }

    @method handleNotification<T = ?any>(note: NotificationInterface<T>): ?Promise<void> {
      switch (note.getName()) {
        // Connect any Module's STDLOG to the logger's STDIN
        case (CONNECT_MODULE_TO_LOGGER):
          const module = note.getBody();
          const pipe = Pipe.new();
          module.acceptOutputPipe(STDLOG, pipe);
          this.logger.acceptInputPipe(STDIN, pipe);
          break;
        // Bidirectionally connect shell and logger on STDLOG/STDSHELL
        case (CONNECT_SHELL_TO_LOGGER):
          // The junction was passed from ShellJunctionMediator
          const junction = note.getBody();
          // Connect the shell's STDLOG to the logger's STDIN
          const shellToLog = junction.retrievePipe(STDLOG);
          this.logger.acceptInputPipe(STDIN, shellToLog);
          // Connect the logger's STDSHELL to the shell's STDIN
          const logToShell = Pipe.new();
          const shellIn = junction.retrievePipe(STDIN);
          shellIn.connectInput(logToShell);
          this.logger.acceptOutputPipe(STDSHELL, logToShell);
          break;
      }
    }

    constructor() {
      super(... arguments);
      this.setViewComponent(LoggerApplication.new(LIGHTWEIGHT));
      this.logger.start();
    }
  }
}
