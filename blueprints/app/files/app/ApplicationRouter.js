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

import type { RouterInterface } from './interfaces/RouterInterface';

export default (Module) => {
  const {
    SWAGGER_ROUTER,
    Router,
    initialize, partOf, meta, method, property, nameBy, inject,
  } = Module.NS;

  @initialize
  @partOf(Module)
  class ApplicationRouter extends Router {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @inject(`Factory<${SWAGGER_ROUTER}>`)
    @property _swaggerFactory: () => RouterInterface;

    @method externals() {
      return [this._swaggerFactory()]
    }

    @method map() {
      this.get('/info', {to: 'itself#info', recordName: null})
      this.options('/*', {to: 'itself#cors', recordName: null})
      this.namespace('version', {module: '', prefix: ':v'}, function () {
        this.resource('users', {except: 'delete'}, function () {
          this.post('/signup', {to: 'users#signup', at: 'collection', template: 'users/signup', recordName: null})
          this.post('/authorize', {to: 'users#authorize', at: 'collection', template: 'users/authorize', recordName: null})
          this.get('/signout', {to: 'users#signout', at: 'collection', template: 'users/signout', recordName: null})
        });
      });
    }
  }
}
