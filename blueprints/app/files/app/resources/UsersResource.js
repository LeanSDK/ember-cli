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

import jwt from 'jsonwebtoken';

const {
  TOKEN_ALGORITHM, KEYID, ISSUER, REGISTRATION_IS_ALLOWED,
  PUBLIC_KEY, PRIVATE_KEY,
} = process.env;

export default (Module) => {
  const {
    SESSIONS, NON_RENDERABLE,
    Resource,
    ConfigurableMixin, BodyParseMixin,
    CheckSchemaVersionResourceMixin,
    CheckApiVersionResourceMixin,
    CheckSessionsMixin,
    QueryableResourceMixin,
    initialize, partOf, meta, property, nameBy, mixin, inject, chains, action, method,
    Utils: { _, statuses }
  } = Module.NS;

  const OK = statuses('OK');
  const CREATED = statuses('created');
  const NO_CONTENT = statuses('no content');
  const UNAUTHORIZED = statuses('unauthorized');
  const FORBIDDEN = statuses('forbidden');

  @initialize
  @chains([
    'list', 'detail', 'create', 'update', 'signup', 'signout', 'authorize'
  ], function () {
    this.initialHook('checkApiVersion');
    this.initialHook('checkSchemaVersion');
    this.initialHook('parseBody', {
      only: ['create', 'update', 'signup', 'authorize']
    });
    this.initialHook('checkSession', {
      only: ['signout']
    });
  })
  @partOf(Module)
  @mixin(QueryableResourceMixin)
  @mixin(CheckSessionsMixin)
  @mixin(CheckSchemaVersionResourceMixin)
  @mixin(CheckApiVersionResourceMixin)
  @mixin(BodyParseMixin)
  @mixin(ConfigurableMixin)
  class UsersResource< D = RecordInterface > extends Resource {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property get entityName(): string {
      return 'user';
    }

    @inject(`Factory<${SESSIONS}>`)
    @property _sessionsFactory: () => CollectionInterface<D>;
    @property get _sessions(): CollectionInterface<D> {
      return this._sessionsFactory()
    }

    @action async signup(): Promise<typeof NON_RENDERABLE> {
      if(REGISTRATION_IS_ALLOWED == 'yes'){
        const payload = _.pick(this.context.request.body, ['email', 'password']);
        const newUser = await this.collection.build(payload);
        newUser.password = payload.password;
        this.context.status = CREATED;
        return NON_RENDERABLE;
      } else {
        this.context.throw(FORBIDDEN);
      }
    }

    @action async create(): Promise<object> {
      if (this.collection != null) {
        const newUser = await this.collection.build(this.recordBody);
        newUser.password = this.recordBody.password;
        return await newUser.save();
      } else {
        return {};
      }
    }

    @action async signout(): Promise<void> {
      const {
        sessionCookie,
        cookieDomain
      } = this.configs;
      if (this.session != null && this.session.uid != null)
        await this.session.destroy();
      const [domain, oldDomain] = /(.*localhost.*)|(.*127\.0\.0\.1.*)/.test(this.context.get('origin') || this.context.get('X-Forwarded-For'))
        ? [this.context.hostname, null]
        : new RegExp(".*#{cookieDomain}.*").test(this.context.get('origin') || this.context.get('X-Forwarded-For'))
          ? [cookieDomain, "api.#{cookieDomain}"]
          : [null, null];
      if (domain != null) {
        this.context.cookies.set(sessionCookie, '', {
          httpOnly: true,
          maxAge: 1000,
          domain: domain,
        })
        this.context.cookies.set(`${sessionCookie}ExpiredAt`, '', {
          maxAge: 1000,
          domain: domain,
        })
      }
      if (oldDomain != null) {
        this.context.cookies.set(sessionCookie, '', {
          httpOnly: true,
          maxAge: 1000,
          domain: oldDomain,
        })
        this.context.cookies.set(`${sessionCookie}ExpiredAt`, '', {
          maxAge: 1000,
          domain: oldDomain,
        })
      }
      this.context.cookies.set(sessionCookie, '', {
        httpOnly: true,
        maxAge: 1000,
      })
      this.context.cookies.set(`${sessionCookie}ExpiredAt`, '', {maxAge: 1000})
      this.context.status = NO_CONTENT;
    }

    @action async authorize() {
      const {
        email, password,
      } = this.context.request.body;
      const user = await (await this.collection.findBy({"@doc.email": email})).first();
      if (user == null) {
        this.context.throw(UNAUTHORIZED, 'Credentials are incorrect')
      } else {
        if (!user.verifyPassword(password)) this.context.throw(UNAUTHORIZED, 'Credentials are incorrect');
        if (!user.emailVerified) this.context.throw(FORBIDDEN, 'Unverified');
        if (user.isLocked) this.context.throw(FORBIDDEN, 'Locked');

        const data = {
          appState: null,
          authenticator: 'authenticator:self-hosted',
          expiresIn: 3600000,
          idToken: null,
          idTokenPayload: null,
          profile: {
            email: user.email,
            email_verified: user.emailVerified,
            name: user.name,
            nickname: user.nickname,
            picture: user.picture,
            sub: user.sub,
            updated_at: user.updatedAt.toISOString()
          },
          refreshToken: null,
          scope: 'openid email profile',
          state: ''
        };

        const permissions = user.permissions || [];
        const requestedScopes = this.context.request.body.scope || this.context.query.scope || '';
        const filteredScopes = requestedScopes.split(' ').filter((x) =>
          x.includes(':')
        );

        const allScopes = filteredScopes.concat(permissions);

        // user broadcast publish
        allScopes.push(`api.read:%2Fapi/amq.topic/user_broad.${user.sub}.*`);
        allScopes.push(`api.write:%2Fapi/amq.topic/user_broad.${user.sub}.*`);
        // user publish request
        allScopes.push(`api.read:%2Fapi/amq.topic/user_req.${user.sub}.*`);
        allScopes.push(`api.write:%2Fapi/amq.topic/user_req.${user.sub}.*`);
        // user subscribe on respose
        allScopes.push(`api.read:%2Fapi/amq.topic/user_res.${user.sub}.*`);
        allScopes.push(`api.write:%2Fapi/amq.topic/user_res.${user.sub}.*`);
        // user subscribe on any
        allScopes.push(`api.read:%2Fapi/amq.topic/user_sub.${user.sub}.*`);
        allScopes.push(`api.write:%2Fapi/amq.topic/user_sub.${user.sub}.*`);
        // user res queues
        allScopes.push(`api.read:%2Fapi/user_res.${user.sub}.*`);
        allScopes.push(`api.write:%2Fapi/user_res.${user.sub}.*`);
        allScopes.push(`api.configure:%2Fapi/user_res.${user.sub}.*`);
        // user broadcast queues
        allScopes.push(`api.read:%2Fapi/user_broad.${user.sub}.*`);
        allScopes.push(`api.write:%2Fapi/user_broad.${user.sub}.*`);
        allScopes.push(`api.configure:%2Fapi/user_broad.${user.sub}.*`);
        // user subscription queues
        allScopes.push(`api.read:%2Fapi/user_sub.${user.sub}.*`);
        allScopes.push(`api.write:%2Fapi/user_sub.${user.sub}.*`);
        allScopes.push(`api.configure:%2Fapi/user_sub.${user.sub}.*`);

        data.scope = allScopes.join(' ');

        const adminScopes = [];
        if (user.isAdmin) {
          // broadcast publish
          adminScopes.push(`api.read:%2Fapi/amq.topic/admin_broad.${user.sub}.*`);
          adminScopes.push(`api.write:%2Fapi/amq.topic/admin_broad.${user.sub}.*`);
          // publish request
          adminScopes.push(`api.read:%2Fapi/amq.topic/admin_req.${user.sub}.*`);
          adminScopes.push(`api.write:%2Fapi/amq.topic/admin_req.${user.sub}.*`);
          // subscribe on respose
          adminScopes.push(`api.read:%2Fapi/amq.topic/admin_res.${user.sub}.*`);
          adminScopes.push(`api.write:%2Fapi/amq.topic/admin_res.${user.sub}.*`);
          // subscribe on any
          adminScopes.push(`api.read:%2Fapi/amq.topic/admin_sub.*.*`);
          adminScopes.push(`api.write:%2Fapi/amq.topic/admin_sub.*.*`);
          // res queues
          adminScopes.push(`api.read:%2Fapi/admin_res.${user.sub}.*`);
          adminScopes.push(`api.write:%2Fapi/admin_res.${user.sub}.*`);
          adminScopes.push(`api.configure:%2Fapi/admin_res.${user.sub}.*`);
          // broadcast queues
          adminScopes.push(`api.read:%2Fapi/admin_broad.${user.sub}.*`);
          adminScopes.push(`api.write:%2Fapi/admin_broad.${user.sub}.*`);
          adminScopes.push(`api.configure:%2Fapi/admin_broad.${user.sub}.*`);
          // subscription queues
          adminScopes.push(`api.read:%2Fapi/admin_sub.*.*`);
          adminScopes.push(`api.write:%2Fapi/admin_sub.*.*`);
          adminScopes.push(`api.configure:%2Fapi/admin_sub.*.*`);
        }

        if (data.scope == null) data.scope = '';

        data.scope += ' ' + adminScopes.join(' ');

        const token = jwt.sign(data, { key: PRIVATE_KEY }, {
          algorithm: TOKEN_ALGORITHM,
          keyid: KEYID,
          audience: ['api'],
          subject: user.sub,
          issuer: ISSUER,
          expiresIn: 7200
        });
        data.access_token = token;

        const newSession = {
          uid: user.id,
          expires: new Date(Date.now() + data.expiresIn)
        };
        this.session = await this._sessions.create(newSession);
        const {
          sessionCookie,
          sessionCookieTTL,
          cookieDomain,
        } = this.configs;
        const domain = /(.*localhost.*)|(.*127\.0\.0\.1.*)/.test(this.context.get('origin') || this.context.get('X-Forwarded-For'))
          ? this.context.hostname
          : new RegExp(".*#{cookieDomain}.*").test(this.context.get('origin') || this.context.get('X-Forwarded-For'))
            ? cookieDomain
            : null;
        this.context.cookies.set(sessionCookie, this.session.id, {
          httpOnly: true,
          maxAge: Number(sessionCookieTTL) * 1000,
          domain,
        })
        const cookieExpiredAt = Date.now() + Number(sessionCookieTTL) * 1000
        this.context.cookies.set(`${sessionCookie}ExpiredAt`, cookieExpiredAt, {
          maxAge: Number(sessionCookieTTL) * 1000,
          domain,
        });
        this.context.status = OK;
        return data;
      }
    }
  }
}
