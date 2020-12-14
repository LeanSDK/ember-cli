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

export default (Module) => {
  const {
    BaseMigration,
    initialize, partOf, nameBy, meta, method
  } = Module.NS;

  @initialize
  @partOf(Module)
  class CreateSessionsMigration extends BaseMigration {
    @meta static object = {};
    @method static change() {
      const name = 'sessions'
      this.createCollection(name)
      this.addField(name, 'id', 'string')
      this.addField(name, 'type', 'string')
      this.addTimestamps(name)

      this.addField(name, 'uid', 'string')
      this.addField(name, 'expires', 'date')

      this.addIndex(name, ['id'], {type: 'hash', unique: true})
      this.addIndex(name, ['uid'], {type: 'hash'})
    }
  }
}
