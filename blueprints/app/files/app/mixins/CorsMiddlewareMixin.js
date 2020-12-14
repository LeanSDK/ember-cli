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

import cors from '@koa/cors';

const {
  ORIGINS,
} = process.env;

export default (Module) => {
  const {
    initializeMixin, meta, property, method,
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    return @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @property static cors = null;

      @method async useCORS(... args) {
        const corsLambda = this.constructor.cors;
        if (corsLambda == null) {
          this.constructor.cors = (() => {
            const credentials = true;
            const allowMethods = 'GET, HEAD, PUT, POST, DELETE, OPTIONS, PATCH, COPY';
            const exposeHeaders = 'content-length, server';
            const maxAge = 1800;
            const origins = ORIGINS !== '*' && (ORIGINS != null ? ORIGINS.split : void 0)
              ? ORIGINS.split(', ')
              : ORIGINS;
            const origin = (origins == null) || origins === '*' ? void 0 : (ctx) => {
              return origins.find((_origin) => {
                return _origin === ctx.get('Origin');
              });
            };
            return cors({
              keepHeadersOnError: true,
              credentials,
              origin,
              maxAge,
              allowMethods,
              exposeHeaders
            });
          })();
        }
        await Promise.resolve(corsLambda(this.context, () => {
          return Promise.resolve();
        }));
        return args;
      }
    }
  });
}
