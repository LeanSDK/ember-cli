// This file is part of <%= addonName %>.
//
// <%= addonName %> is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// <%= addonName %> is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with <%= addonName %>.  If not, see <https://www.gnu.org/licenses/>.

import someDecorator from './decorators/someDecorator';

import someUtil from './utils/someUtil';

import SomeMixin from './mixins/SomeMixin';

import FacadeMixin from './mixins/FacadeMixin';

import NestedModulePlugin from './NestedModulePlugin';

export type { SomeNewT } from './types/SomeNewT';

export type { SomeInterface } from './interfaces/SomeInterface';

export { NestedModulePlugin };

export default (Module) => {
  const {
    initializeMixin, meta, constant, decorator, extend
  } = Module.NS;

  return ['<%= addonNamespace %>', (BaseClass) => {
    @extend('FacadeMixin', 'Facade')

    @FacadeMixin

    @SomeMixin

    @someUtil

    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @constant SOME_CONSTANT = 'SOME_CONSTANT';

      @decorator someDecorator = someDecorator;
    }
    return Mixin;
  }]
}
