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
    SwaggerEndpoint,
    CrudEndpointMixin,
    initialize, partOf, meta, nameBy, mixin,
    Utils: { joi }
  } = Module.NS;

  @initialize
  @partOf(Module)
  @mixin(CrudEndpointMixin)
  class UsersSignupEndpoint extends SwaggerEndpoint {
    @nameBy static __filename = __filename;
    @meta static object = {};

    constructor() {
      super(...arguments);
      this.pathParam('v', this.versionSchema)
        .body(joi.object({
          email: joi.string().min(2).optional(),
          password: joi.string().min(4).required(),
        }).required(), 'Credentials')
        .response(null)
        .summary('Signup new user')
        .description('Create a new user.');
    }
  }
}
