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

import type { ConfigurationInterface } from '../interfaces/ConfigurationInterface';
import type { CollectionInterface } from '../interfaces/CollectionInterface';
import type { RecordInterface } from '../interfaces/RecordInterface';

export default (Module) => {
  const {
    USERS, CONFIGURATION,
    BaseMigration,
    initialize, partOf, nameBy, meta, method, property, lazyInject,
  } = Module.NS;

  @initialize
  @partOf(Module)
  class GenerateAdminUserMigration< D = RecordInterface > extends BaseMigration {
    @meta static object = {};

    @lazyInject(`Factory<${CONFIGURATION}>`)
    @property _configurationFactory: () => ConfigurationInterface;

    @property get configs(): ConfigurationInterface {
      return this._configurationFactory();
    }

    @lazyInject(`Factory<${USERS}>`)
    @property _usersFactory: () => CollectionInterface<D>;
    @property get _users(): CollectionInterface<D> {
      return this._usersFactory()
    }

    @method static change() {
      this.reversible(async function ({ up, down }) {
        await up(async () => {
          const admin = await this._users.build({
            email: this.configs.adminEmail,
            emailVerified: true,
            name: "admin",
            nickname: "admin",
            isAdmin: true,
          })
          admin.password = this.configs.adminPassword
          await admin.save()
        });
        await down(async () => {
          const admin = await (await this._users.findBy({"@doc.nickname": "admin"})).first()
          await admin.destroy()
        });
      });
    }
  }
}
