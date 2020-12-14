// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

import type { DriverInterface } from '../interfaces/DriverInterface';

const {
  DB_PROTO, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS,
} = process.env;

export default (Module) => {
  const {
    Adapter,
    MongoAdapterMixin,
    QueryableMongoAdapterMixin,
    initialize, partOf, meta, property, nameBy, mixin,
  } = Module.NS;

  @initialize
  @partOf(Module)
  @mixin(QueryableMongoAdapterMixin)
  @mixin(MongoAdapterMixin)
  class MongoAdapter extends Adapter implements DriverInterface {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property get dbProto(): string {
      return DB_PROTO;
    };

    @property get host(): string {
      return DB_HOST;
    };

    @property get port(): string {
      return DB_PORT;
    };

    @property get dbName(): string {
      return DB_NAME;
    };

    @property get username(): ?string {
      return DB_USER;
    };

    @property get password(): ?string {
      return DB_PASS;
    };
  }
}
