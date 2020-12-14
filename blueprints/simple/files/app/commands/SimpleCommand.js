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

import type { NotificationInterface } from '../interfaces/NotificationInterface';
import type { SimpleProxyInterface } from '../interfaces/SimpleProxyInterface';

export default (Module) => {
  const {
    SIMPLE_PROXY, MSG_TO_CONSOLE,
    Command,
    initialize, partOf, meta, method, property, nameBy, inject,
  } = Module.NS;

  @initialize
  @partOf(Module)
  class SimpleCommand extends Command {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @inject(`Factory<${SIMPLE_PROXY}>`)
    @property _simpleProxyFactory: () => SimpleProxyInterface;
    @property get _simpleProxy(): SimpleProxyInterface {
      return this._simpleProxyFactory()
    }

    @method execute<T = ?any>(note: NotificationInterface<T>): void {
      this._simpleProxy.setData(note.getBody())
      this.send(MSG_TO_CONSOLE, this._simpleProxy.getData());
    }
  }
}
