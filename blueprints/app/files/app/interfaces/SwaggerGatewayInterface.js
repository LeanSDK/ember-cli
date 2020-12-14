// This file is part of leanes-swagger-addon.
//
// leanes-swagger-addon is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// leanes-swagger-addon is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with leanes-swagger-addon.  If not, see <https://www.gnu.org/licenses/>.

import type { JoiT } from '../types/JoiT';
import type { SwaggerEndpointStruct } from './SwaggerEndpointStruct';

export interface SwaggerGatewayInterface<
  Endpoint = SwaggerEndpointStruct
> {
  getEndpointByName(asName: string): ?Class<*>;

  getEndpointName(asResourse: string, asAction: string): string;

  getStandardActionEndpoint(asResourse: string, asAction: string): Class<*>;

  getEndpoint(asResourse: string, asAction: string): Class<*>;

  swaggerDefinitionFor(asResourse: string, asAction: string, opts: ?object): Endpoint;

  getSchema(asRecordName: string): JoiT;
}
