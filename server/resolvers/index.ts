import * as fromDynamoResolvers from './_dynamoResolver';

export default {
  Query: {
    getRegion: fromDynamoResolvers.getRegion,
    getAllRegions: fromDynamoResolvers.getAllRegions,
    updateRegion: fromDynamoResolvers.updateRegion,
    removeRegion: fromDynamoResolvers.removeRegion
  },
  Mutation: {
    insertRegion: fromDynamoResolvers.insertRegion
  }
}