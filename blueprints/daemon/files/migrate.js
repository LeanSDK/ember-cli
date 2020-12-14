// This file is part of <%= name %>.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for
// the specific language governing rights and limitations under the License.

const program = require('commander')
const path = process.env.ENV === 'development' ? "./dev" : "./prod"
const Module = require(path).default

async function startup(Module, app) {
  const migrationsCollection = app.facade.getProxy(Module.NS.MIGRATIONS)
  const voDB = await migrationsCollection.adapter.db
  const qualifiedName = migrationsCollection.collectionFullName()
  if ((await voDB.listCollections({name: qualifiedName}).toArray()).length === 0) {
    const collection = await voDB.createCollection(qualifiedName)
    await collection.ensureIndex({id: 1}, {unique: true})
  }
}

async function migrate({until}) {
  app = Module.NS.MainApplication.new(Module.NS.LIGHTWEIGHT)
  app.start()
  await startup(Module, app)
  await app.migrate({until})
  await app.finish()
}

const command = program
  .option('--until <until>', 'migration name which used as last')
command.unknownOption = () => {}
command.description('Migrate schema of LeanES app')
command.action(migrate)
program.parse(process.argv)
