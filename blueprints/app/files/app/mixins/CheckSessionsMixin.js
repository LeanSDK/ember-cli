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

export default (Module) => {
  const {
    SESSIONS, USERS,
    initializeMixin, meta, property, method, inject,
    Utils: { statuses }
  } = Module.NS;

  const UNAUTHORIZED = statuses('unauthorized');

  Module.defineMixin(__filename, (BaseClass) => {
    return @initializeMixin
    class Mixin< D = RecordInterface > extends BaseClass {
      @meta static object = {};

      @inject(`Factory<${SESSIONS}>`)
      @property __sessionsFactory: () => CollectionInterface<D>;
      @property get __sessions(): CollectionInterface<D> {
        return this.__sessionsFactory()
      }

      @inject(`Factory<${USERS}>`)
      @property __usersFactory: () => CollectionInterface<D>;
      @property get __users(): CollectionInterface<D> {
        return this.__usersFactory()
      }

      @property session: RecordInterface = null;
      @property get currentUser(): Promise<RecordInterface> {
        return this.__users.find(this.session.uid)
      }

      @method async checkSession(... args) {
        const sessionCookie = this.configs != null && this.configs.sessionCookie != null
          ? this.configs.sessionCookie
          : 'sid';
        const sessionId = this.context.cookies.get(sessionCookie);
        if (sessionId == null) this.context.throw(UNAUTHORIZED);
        const session = await (await this.__sessions.findBy({
          "@doc.id": sessionId
        })).first();
        if (session == null) this.context.throw(UNAUTHORIZED);
        this.context.session = session;
        this.session = session;
        if (!(await this.currentUser).emailVerified) this.context.throw(UNAUTHORIZED, 'Unverified');
        return args;
      }
    }
  });
}
