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

import LeanES from '__LeanES__';
import FsUtilsAddon from '__FsUtilsAddon__';
import ConfigurableAddon from '__ConfigurableAddon__';

const { initialize, meta, nameBy, resolver, constant, plugin, loadFiles } = LeanES.NS;

@initialize
@loadFiles
@plugin(ConfigurableAddon)
@plugin(FsUtilsAddon)
@resolver(require, name => require(name))
class <%= namespace %> extends LeanES {
  @nameBy static  __filename = '<%= namespace %>';
  @meta static object = {};
  @constant ROOT = __dirname;
  @constant START_CONSOLE = 'START_CONSOLE';
  @constant MSG_FROM_CONSOLE = 'MSG_FROM_CONSOLE';
  @constant MSG_TO_CONSOLE = 'MSG_TO_CONSOLE';
  @constant CLEAR_CONSOLE = 'CLEAR_CONSOLE';
  @constant SIMPLE_PROXY = 'SimpleProxy';
  @constant SIMPLE_ADAPTER = 'SimpleAdapter';
  @constant SIGNALS_GENERATOR = 'SignalsGenerator';
};

export default <%= namespace %>;
