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

import type { SimpleAdapterInterface } from '../interfaces/SimpleAdapterInterface';

export default (Module) => {
  const {
    SIMPLE_ADAPTER,
    Proxy,
    initialize, partOf, meta, nameBy, property, method, inject,
  } = Module.NS;

  @initialize
  @partOf(Module)
  class SimpleProxy extends Proxy {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @inject(`Factory<${SIMPLE_ADAPTER}>`)
    @property _adapterFactory: () => SimpleAdapterInterface;
    @property get _simpleAdapter(): SimpleAdapterInterface {
      return this._adapterFactory()
    }

    @method setData(data: ?any): void {
      this._simpleAdapter.set(data);
    }

    @method getData(): ?any {
      return this._simpleAdapter.get();
    }
  }
}
