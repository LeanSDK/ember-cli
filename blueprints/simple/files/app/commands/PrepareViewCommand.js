// This file is part of <%= name %>.
//
// <%= name %> is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// <%= name %> is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with <%= name %>.  If not, see <https://www.gnu.org/licenses/>.

import type { NotificationInterface } from '../interfaces/NotificationInterface';
import type { ApplicationInterface } from '../interfaces/ApplicationInterface';

export default (Module) => {
  const {
    APPLICATION_MEDIATOR, SHELL, LOGGER_MODULE, SIGNALS_GENERATOR,
    Command,
    initialize, partOf, meta, method, nameBy
  } = Module.NS;

  @initialize
  @partOf(Module)
  class PrepareViewCommand extends Command {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @method execute<T = ?any>(note: NotificationInterface<T>): void {
      console.log('PrepareViewCommand execute()');
      const app: ApplicationInterface = note.getBody();

      this.facade.addMediator(LOGGER_MODULE, 'LoggerModuleMediator');
      this.facade.addMediator(SHELL, 'ShellJunctionMediator');
      this.facade.addMediator(APPLICATION_MEDIATOR, 'ApplicationMediator', app);

      this.facade.activateMediator(APPLICATION_MEDIATOR);
      this.facade.activateMediator(LOGGER_MODULE);
      this.facade.activateMediator(SHELL);

      if (!app.isLightweight) {
        this.facade.addMediator(SIGNALS_GENERATOR, 'SignalsMediator');
        this.facade.activateMediator(SIGNALS_GENERATOR);
        this.facade.addMediator('SimpleMediator');
        this.facade.activateMediator('SimpleMediator');
      }
    }
  }
}
