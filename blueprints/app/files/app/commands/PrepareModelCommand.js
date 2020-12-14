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
    APPLICATION_PROXY, CONFIGURATION,
    MIGRATIONS_ADAPTER, USERS_ADAPTER, SESSIONS_ADAPTER,
    MIGRATIONS, USERS, SESSIONS, APPLICATION_ROUTER,
    SWAGGER_ROUTER, SWAGGER_GATEWAY,
    Command,
    initialize, partOf, meta, method, nameBy
  } = Module.NS;

  @initialize
  @partOf(Module)
  class PrepareModelCommand extends Command {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @method execute<T = ?any>(note: NotificationInterface<T>): void {
      const app: ApplicationInterface = note.getBody();
      this.facade.addProxy(APPLICATION_PROXY, 'ApplicationProxy', app.initialState);
      this.facade.addProxy(CONFIGURATION, 'MainConfiguration', this.Module.NS.ROOT);
      this.facade.addAdapter(MIGRATIONS_ADAPTER, 'MongoAdapter');
      this.facade.addAdapter(USERS_ADAPTER, 'MongoAdapter');
      this.facade.addAdapter(SESSIONS_ADAPTER, 'MongoAdapter');
      this.facade.addProxy(MIGRATIONS, 'MigrationsCollection', {
        delegate: 'BaseMigration',
        adapter: MIGRATIONS_ADAPTER
      });
      this.facade.addProxy(USERS, 'MainCollection', {
        delegate: 'UserRecord',
        adapter: USERS_ADAPTER
      });
      this.facade.addProxy(SESSIONS, 'MainCollection', {
        delegate: 'SessionRecord',
        adapter: SESSIONS_ADAPTER
      });
      this.facade.addProxy(APPLICATION_ROUTER, 'ApplicationRouter');
    }
  }
}
