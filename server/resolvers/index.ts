import * as fromDynamoResolvers from './_dynamoResolver';

export default {
  Query: {
    // createTable: fromDynamoResolvers.createTable,
    updateRegion: fromDynamoResolvers.updateRegion,
    getRegion: fromDynamoResolvers.getRegion,
    getAllRegions: fromDynamoResolvers.getAllRegions,
    removeRegion: fromDynamoResolvers.removeRegion
  },
  Mutation: {
    insertRegion: fromDynamoResolvers.insertRegion
  }
}