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

import { CronJob } from 'cron';

export default (Module) => {
  const {
    CLEAR_CONSOLE,
    Mediator,
    initialize, partOf, meta, nameBy, method, property,
  } = Module.NS;

  @initialize
  @partOf(Module)
  class SignalsMediator extends Mediator {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property _job = null;

    @method onRegister(): void  {
      super.onRegister();
      this._job = new CronJob('*/7 * * * * *', async () => {
        const result = await this.run(CLEAR_CONSOLE);
        // console.log(`Result from script: "${result}"`);
      }, null, true, 'America/Los_Angeles');
      this._job.start();
    }

    @method async onRemove(): Promise<void> {
      await super.onRemove();
      this._job.stop();
    }
  }
}
