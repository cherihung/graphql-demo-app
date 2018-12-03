import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';

import * as fromResolvers from './resolvers';
import { Server } from './server';

// Import GraphQL schemas
const typeDefs = importSchema('./schemas/index.graphql');

// Import Resolvers
const resolvers = fromResolvers.default

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

let serverInst: Server = new Server();
serverInst.start(schema);