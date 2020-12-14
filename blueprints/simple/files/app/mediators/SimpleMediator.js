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

import readline from 'readline';

export default (Module) => {
  const {
    START_CONSOLE, MSG_FROM_CONSOLE, MSG_TO_CONSOLE,
    Mediator,
    initialize, partOf, meta, property, method, nameBy
  } = Module.NS;

  @initialize
  @partOf(Module)
  class SimpleMediator extends Mediator {
    @nameBy static __filename = __filename;
    @meta static object = {};

    @method listNotificationInterests(): string[] {
      const interests = super.listNotificationInterests(... arguments);
      interests.push(START_CONSOLE);
      interests.push(MSG_TO_CONSOLE);
      return interests;
    }

    @method handleNotification<T = ?any>(note: NotificationInterface<T>): ?Promise<void> {
      switch (note.getName()) {
        case (START_CONSOLE):
          this.stdinStart();
          break;
        case (MSG_TO_CONSOLE):
          this.stdinComplete(note.getBody());
          break;
        default:
          super.handleNotification(note);
      }
    }

    @method onRegister() {
      super.onRegister();
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '... waiting new text ...\n'
      });
      this.rl.setMaxListeners(Number.MAX_SAFE_INTEGER);
    }

    @method async onRemove(): Promise<void> {
      await super.onRemove();
      this.rl.close()
    }

    @method stdinStart() {
      console.log('Start: ');
      this.rl.prompt();
      this.rl.on('line', (input) => {
        console.log(`Received: ${input}`);
        this.send(MSG_FROM_CONSOLE, input);
      });
    }

    @method stdinComplete(body) {
      console.log('Complete: ', body);
      this.rl.prompt();
    }
  }
}
