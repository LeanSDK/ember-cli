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

import crypto from 'crypto';

const {
  HASH_DIGEST, ITERATIONS, AUTO_LOCKING, SECRET,
} = process.env;

export default (Module) => {
  const {
    Record,
    TimestampsRecordMixin,
    initialize, partOf, meta, nameBy, mixin, attribute, property, method, chains,
    Utils: { uuid, makeHash }
  } = Module.NS;

  @initialize
  @chains([
    'create'
  ], function () {
    this.beforeHook('fillNonRequired', {
      only: ['create']
    });
    this.beforeHook('hashPassword', {
      only: ['create']
    });
  })
  @partOf(Module)
  @mixin(TimestampsRecordMixin)
  class UserRecord extends Record {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property password: ?string = null;

    @attribute({ type: 'string' }) email;
    @attribute({ type: 'boolean' }) emailVerified;
    @attribute({ type: 'string' }) name;
    @attribute({ type: 'string' }) nickname;
    @attribute({ type: 'string' }) picture;
    @attribute({ type: 'string' }) sub;
    @attribute({ type: 'string' }) salt;
    @attribute({ type: 'string' }) passwordHash;
    @attribute({ type: 'boolean' }) isAdmin;
    @attribute({ type: 'boolean' }) isLocked;

    @method fillNonRequired(... args) {
      this.emailVerified = this.emailVerified != null ? this.emailVerified : false;
      this.name = this.name || this.email;
      this.nickname = this.nickname || this.email.split('@')[0];
      this.picture = this.picture || '';
      this.sub = this.sub || crypto.randomBytes(16).toString('hex');
      this.salt = makeHash('sha256', `${SECRET}|${uuid.v4()}`);
      this.isAdmin = this.isAdmin != null ? this.isAdmin : false;
      this.isLocked = this.isAdmin ? false : AUTO_LOCKING == 'yes';
      return args;
    }

    @method hashPassword(... args) {
      this.passwordHash = crypto.pbkdf2Sync(this.password, this.salt, Number(ITERATIONS), 64, HASH_DIGEST).toString('hex');
      return args;
    }

    @method verifyPassword(password): boolean {
      return this.passwordHash == crypto.pbkdf2Sync(password, this.salt, Number(ITERATIONS), 64, HASH_DIGEST).toString('hex');
    }
  }
}
