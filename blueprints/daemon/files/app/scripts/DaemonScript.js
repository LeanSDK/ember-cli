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

import type { CollectionInterface } from '../interfaces/CollectionInterface';
import type { RecordInterface } from '../interfaces/RecordInterface';

const slice = [].slice;

export default (Module) => {
  const {
    REQUEST_RESULTS, MIGRATIONS,
    Script,
    ConfigurableMixin,
    initialize, partOf, meta, method, property, nameBy, inject, mixin,
    Utils: { request }
  } = Module.NS;

  @initialize
  @partOf(Module)
  @mixin(ConfigurableMixin)
  class DaemonScript< D = RecordInterface > extends Script {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @inject(`Factory<${REQUEST_RESULTS}>`)
    @property _resultsFactory: () => CollectionInterface<D>;
    @property get _results(): CollectionInterface<D> {
      return this._resultsFactory()
    }

    @inject(`Factory<${MIGRATIONS}>`)
    @property _migrationsFactory: () => CollectionInterface<D>;
    @property get _migrations(): CollectionInterface<D> {
      return this._migrationsFactory();
    }

    @method async checkSchemaVersion(): boolean {
      const migrationNames = this.ApplicationModule.NS.MIGRATION_NAMES;
      const [ lastMigration ] = slice.call(migrationNames, -1);
      if (lastMigration == null)
        return true;
      return await this._migrations.includes(lastMigration);
    }

    @method async body(data: ?any): Promise<?any> {
      if (! await this.checkSchemaVersion()) return;
      const result = await request("GET", this.configs.url);
      await this._results.create({
        body: result.body,
        headers: result.headers,
        status: result.status,
        message: result.message,
      });
      return 'compleated';
    }
  }
}
