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

export default (Module) => {
  const {
    initializeMixin, meta, method,
  } = Module.NS;

  Module.defineMixin(__filename, (BaseClass) => {
    @initializeMixin
    class Mixin extends BaseClass {
      @meta static object = {};

      @method initializeFacade(): void {
        super.initializeFacade(... arguments)
        // TODO: Code on Facade initialization
        // this.addCommand(...)
        // this.addCase(...)
        // this.addSuite(...)
        // this.addSuite(...)
        // this.addAdapter(...)
        // this.addProxy(...)
        // this.addMediator(...)
        // if (!this.isBound(...)) {
        //   this.bind(...).to(...)
        // }
      }
    }
    return Mixin;
  });
}
