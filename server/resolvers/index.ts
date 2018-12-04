import * as fromDynamoResolvers from './_dynamoResolver';

export default {
  Query: {
    region: fromDynamoResolvers.getRegion,
    regions: fromDynamoResolvers.getAllRegions,
    updateRegion: fromDynamoResolvers.updateRegion,
    removeRegion: fromDynamoResolvers.removeRegion
  },
  Mutation: {
    insertRegion: fromDynamoResolvers.insertRegion
  }
}