const AWS = require('aws-sdk');
const uniqid = require('uniqid');

AWS.config.update({
    region: "us-east-2",
     //  endpoint: "https://dynamodb.us-east-2.amazonaws.com",
     endpoint: "http://localhost:8000",
});

const TableName = "Region";
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

const timestamp = new Date().toISOString();

interface Media {
    Map: string;
    Shield: string;  
}
interface Region {
    Name: string;
    RegionId: string;
    Rulers: string;
    Capital: string;
    Media: Media
}

const _deconstructRecord = (record: Region) => Object.assign({...record});


export const insertRegion = (root: any, region: any, context: any, info: any) => {
    
    const Region = region.Region;
    const name: string = Region.Name;
    const regionId: string = uniqid.process();
    const rulers: string = Region.Rulers;
    const capital: string = Region.Capital;
    const map: string = Region.Media.Map;
    const shield: string = Region.Media.Shield;

    return new Promise(function(resolve, reject){
        var params = {
            TableName: TableName,
            Item: {
                "Name": {S: name},
                "RegionId": {S: regionId},
                "Rulers": {S: rulers},
                "Capital": {S: capital},
                "Media": {
                  M: {
                    "Map": {S: map},
                    "Shield": {S: shield}    
                  }
                }
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
        return { response: "Region created successfully, id: " + regionId };
    }).catch(function(reason){
        return {response: reason};
    });
}

export const updateRegion = (root: any, Region: Region, context: any, info: any) => {
    return new Promise(function(resolve, reject){

      const name: string = Region.Name;
      const regionId: string = Region.RegionId;
      const rulers: string = Region.Rulers;
      const capital: string = Region.Capital;
      const media: Media = Region.Media;
      // const map: string = Region.Media.Map;
      // const shield: string = Region.Media.Shield;

        var update_expression = "SET";
        var expression_attribute_values = {}

        if (typeof rulers != "undefined"){
            update_expression += " Rulers = :rulers,"
            expression_attribute_values[':rulers'] = {'S' : rulers}
        }
        if (typeof capital != "undefined"){
            update_expression += " Capital = :capital,"
            expression_attribute_values[':capital'] = {'S' : capital}
        }
        if (typeof media != "undefined"){
          update_expression += " Media = :media,"
          expression_attribute_values[':media'] = {'M' : media}
        }
        // if (typeof map != "undefined"){
        //   update_expression += " Map = :map,"
        //   expression_attribute_values[':map'] = {'S' : map}
        // }
        // if (typeof shield != "undefined"){
        //   update_expression += " Shield = :shield,"
        //   expression_attribute_values[':shield'] = {'S' : shield}
        // }

        update_expression += " ModifiedAt = :modifiedAt,"
        expression_attribute_values[':modifiedAt'] = {'S' : timestamp}

        if (update_expression[update_expression.length-1] == ','){
            update_expression = update_expression.slice(0, update_expression.length-1);
        }

        var params = {
            TableName: TableName,
            Key: {
                RegionId: {S: regionId}
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

export const removeRegion = (root: any, {RegionId}, context: any, info: any) => {
    return new Promise(function(resolve, reject){
        var params = {
            TableName: TableName,
            Key: {
                RegionId: {S: RegionId}
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

// export const getRegions = (root: any, {associateUserId}: any, context: any, info: any) => {
//     return new Promise(function(resolve, reject){
//         let params = {
//             TableName: TableName,
//             KeyConditionExpression: "AssociateUserId = :idNum",
//             ExpressionAttributeValues: {":idNum": {"S": associateUserId}}
//         }
//         dynamodb.query(params, function(err, data){
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         });
//     }).then(function(value: any){
//         var return_val: string[] = [];
//         for (var item of value.Items) {
//             const record = _deconstructRecord(AWS.DynamoDB.Converter.unmarshall(item));
//             return_val.push(record);
//         }
//         return return_val.reverse();
//     }).catch(function(reason){
//         return [{response: reason}];
//     });
// }

export const getAllRegions = (root: any, {}, context: any, info: any) => {
    return new Promise(function(resolve, reject){
        let params = {
            TableName: TableName,
            // KeyConditionExpression: "AssociateUserId = :idNum",
            // ExpressionAttributeValues: {":idNum": {"S": RegionId}}
        }
        dynamodb.scan(params, function(err, data){
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

export const getRegion = (root: any, {RegionId}: any, context: any, info: any) => {
    return new Promise(function(resolve, reject){
        var params = {
            TableName: TableName,
            Key: {
                RegionId: {S: RegionId}
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
