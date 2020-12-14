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
  class CreateUsersMigration extends BaseMigration {
    @meta static object = {};
    @method static change() {
      const name = 'users'
      this.createCollection(name)
      this.addField(name, 'id', 'string')
      this.addField(name, 'type', 'string')
      this.addTimestamps(name)

      this.addField(name, 'email', 'string')
      this.addField(name, 'email_verified', 'boolean')
      this.addField(name, 'name', 'string')
      this.addField(name, 'nickname', 'string')
      this.addField(name, 'picture', 'string')
      this.addField(name, 'sub', 'string')
      this.addField(name, 'salt', 'string')
      this.addField(name, 'password_hash', 'string')
      this.addField(name, 'isAdmin', 'boolean')
      this.addField(name, 'isLocked', 'boolean')

      this.addIndex(name, ['id'], {type: 'hash', unique: true})
      this.addIndex(name, ['sub'], {type: 'hash', unique: true})
      this.addIndex(name, ['email'], {type: 'hash', unique: true})
      this.addIndex(name, ['nickname'], {type: 'hash', unique: true})
    }
  }
}
