## Generate and Update Introspection Schema for GraphQL

1. Start up the local graphQL server with `npm start` (because the next step is currently only configured for local server.)
2. `npm run gen:dbschema` which adds/updates `build/schemas.json` file
   * for more details: [graphql-cli](https://github.com/graphql-cli/graphql-cli)
3. After that file is in place, execute `npm run gen:dbschemamodule` to add/update `../common/models/gql_schemas.d.ts` file. This will be the **source of truth** for both server and client
   * for more details: [gql2ts](https://github.com/avantcredit/gql2ts)
   * plugin author [blog post](https://medium.com/@brettjurgens/graphql-typescript-strongly-typed-api-responses-f8aea1e81b93)
4. Open `../common/models/gql_schemas.d.ts` to edit. Add `export default DemoApp` to export the module.
