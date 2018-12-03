import { notifies } from './_notificationResolver';

const AWS = require('aws-sdk');
const uniqid = require('uniqid');

AWS.config.update({
    region: "us-east-1",
 //  endpoint: "https://dynamodb.us-east-1.amazonaws.com",
     endpoint: "http://localhost:8000",
    
    // httpOptions: {
    //     proxy: "http://entproxy.kdc.capitalone.com:8099"
    //   }
});

let TableName = "CmlcardAppertureApplication";
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

const _deconstructRecord = (record: any) => Object.assign({...record}, { Details: JSON.parse(record.Details)});

const timestamp = new Date().toISOString();

const testNotification = {
    "notificationEventCategory":"ICCEWEB",
    "notificationEventCode":"TESTEVNT",
    "notificationData":[
    {"key":"to","value":"Dream Builders"},
    {"key":"desc","value":"Test"},
    {"key":"system","value":"GraphQL POC"},
    {"key":"from","value":"Local"}
    ],
    
      "contacts" : [{
        "contactPoint" : "Chienyi.Hung@capitalone.com",
        "contactType" : "EMAIL"
      }]
    };

export const createTable = (root: any, tableName: any, context: any, info: any) => {
    return new Promise(function(resolve, reject){
        var params = {
            TableName : TableName,
            KeySchema: [
                { AttributeName: "AssociateUserId", KeyType: "HASH"},   //Partition key
                { AttributeName: "ApplicationId", KeyType: "RANGE"}  //Sort key
            ],
            AttributeDefinitions: [
                { AttributeName: "AssociateUserId", AttributeType: "S"},
                { AttributeName: "ApplicationId", AttributeType: "S"}
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        };
        dynamodb.createTable(params, function(err, data) {
            if (err){
                reject("Table creation failure");
            } else {
                resolve(data);
            }
        })
    }).then(function(value){
        return {response : "Table created successfully."}
    }).catch(function(reason){
        return {response : reason}
    });
}

export const insertApplication = (root: any, application: any, context: any, info: any) => {
    
    application = application.application
    // TODO need to generated uuid
    const associateUserId: string = application.associateUserId;
    const applicationId: string = uniqid.process();
    const details: string[] = application.details;
    const product: string = application.product;
    const customers: string = application.customers;
    const notify: string = application.notify;

    const detailsString = JSON.stringify(details);

    return new Promise(function(resolve, reject){
        var params = {
            TableName: TableName,
            Item: {
                "AssociateUserId": {S: associateUserId},
                "ApplicationId": {S: applicationId},
                "Details": {S: detailsString},
                "Product": {S: product},
                "Customers": {S: customers},
                "CreatedAt": {S: timestamp}
            }
        }
        dynamodb.putItem(params, function(err, data){
            if (err) {
                reject("Table insertion failure: " + err)
            } else {
                resolve(data);
            }
        });
    }).then(function(value){
        if(notify){            
            notifies(testNotification);
        }
        return { response: "Application created successfully, id: " + applicationId };
    }).catch(function(reason){
        return {response: reason};
    });
}

export const updateApplication = (root: any, application: any, context: any, info: any) => {
    return new Promise(function(resolve, reject){
        application = application.application;
        const associateUserId: string = application.associateUserId;
        const applicationId: string = application.applicationId;
        const details: string[] = application.details;
        const product: string = application.product;
        const customers: string = application.customers;

        var update_expression = "SET";
        var expression_attribute_values = {}

        if (typeof details != "undefined"){
            update_expression += " Details = :details,"
            expression_attribute_values[':details'] = {'S' : JSON.stringify(details)}
        }
        if (typeof product != "undefined"){
            update_expression += " Product = :product,"
            expression_attribute_values[':product'] = {'S' : product}
        }
        if (typeof customers != "undefined"){
            update_expression += " Customers = :customers,"
            expression_attribute_values[':customers'] = {'S' : customers}
        }

        update_expression += " ModifiedAt = :modifiedAt,"
        expression_attribute_values[':modifiedAt'] = {'S' : timestamp}

        if (update_expression[update_expression.length-1] == ','){
            update_expression = update_expression.slice(0, update_expression.length-1);
        }

        var params = {
            TableName: TableName,
            Key: {
                AssociateUserId: {S: associateUserId},
                ApplicationId: {S: applicationId}
            },
            UpdateExpression : update_expression,
            ExpressionAttributeValues : expression_attribute_values
        }

            dynamodb.updateItem(params, function(err, data){
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        }).then(function(value: any){
            return true;
        }).catch(function(reason){
            return false;
        });
}

export const removeApplication = (root: any, {associateUserId, applicationId}: any, context: any, info: any) => {
    return new Promise(function(resolve, reject){
        var params = {
            TableName: TableName,
            Key: {
                AssociateUserId: {S: associateUserId},
                ApplicationId: {S: applicationId}
            }
        }
        dynamodb.deleteItem(params, function(err, data){
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    }).then(function(value: any){
        return true;
    }).catch(function(reason){
        return false;
    });
}

export const getApplications = (root: any, {associateUserId}: any, context: any, info: any) => {
    return new Promise(function(resolve, reject){
        let params = {
            TableName: TableName,
            KeyConditionExpression: "AssociateUserId = :idNum",
            ExpressionAttributeValues: {":idNum": {"S": associateUserId}}
        }
        dynamodb.query(params, function(err, data){
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }).then(function(value: any){
        var return_val: string[] = [];
        for (var item of value.Items) {
            const record = _deconstructRecord(AWS.DynamoDB.Converter.unmarshall(item));
            return_val.push(record);
        }
        return return_val.reverse();
    }).catch(function(reason){
        return [{response: reason}];
    });
}

export const getApplication = (root: any, {associateUserId, applicationId}: any, context: any, info: any) => {
    return new Promise(function(resolve, reject){
        var params = {
            TableName: TableName,
            Key: {
                AssociateUserId: {S: associateUserId},
                ApplicationId: {S: applicationId}
            }
        }
        dynamodb.getItem(params, function(err, data){
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    }).then(function(value: any){
        const record = AWS.DynamoDB.Converter.unmarshall(value.Item)
        return _deconstructRecord(record);
    }).catch(function(reason){
        return {response: reason};
    });
}
