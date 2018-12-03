import * as fromDynamoResolvers from './_dynamoResolver';
import * as fromNotificationResolvers from './_notificationResolver';
import * as fromSsoResolvers from './_ssoResolver';

export default {
  Query: {
    getAccessToken: fromSsoResolvers.getAccessToken,
    authenticate: fromSsoResolvers.authenticate,
    createTable: fromDynamoResolvers.createTable,
    updateApplication: fromDynamoResolvers.updateApplication,
    getApplication: fromDynamoResolvers.getApplication,
    sendNotification: fromNotificationResolvers.sendNotification,
    getApplications: fromDynamoResolvers.getApplications,
    removeApplication: fromDynamoResolvers.removeApplication
  },
  Mutation: {
    insertApplication: fromDynamoResolvers.insertApplication
  }
}