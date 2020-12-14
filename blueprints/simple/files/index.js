// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

const path = process.env.ENV === 'development' ? "./dev" : "./prod"
const Module = require(path).default

const initialState = {}
const app = Module.NS.MainApplication.new(initialState)
app.start()
const { ERROR, DEBUG, LEVELS, SEND_TO_LOG } = Module.NS.Pipes.NS.LogMessage
app.setLogLevelMethod(DEBUG)

app.send(
  SEND_TO_LOG, 'Hello world', LEVELS[DEBUG]
)
app.send(Module.NS.START_CONSOLE)
