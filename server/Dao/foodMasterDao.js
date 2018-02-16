var connectionProvider = require('../mySqlConnectionStringProvider.js');

exports.GetFoodMasterDetails = function (request, response) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM foodmaster";
    if (connection) {
        connection.query(queryStatement, function (err, rows, fields) {
            if (err) { response.send(500, { error: err }); }
            console.log("Successfully Loaded foods");
            response.send({ FoodList: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.AddFoodWithQuantity = function (FoodWithQuantityDetails, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    console.log("Id :" + FoodWithQuantityDetails.body.FoodMasterId);
    var queryStatement = "";
    //if (FoodWithQuantityDetails.body.FoodCategoryId != "") {
    //    queryStatement = "UPDATE foodmaster SET CategoryName=? WHERE FoodMasterId=?";
    //}
    //else {
    // }
    //var FoodCategories = {
    //    FoodCategoryId: FoodCategoryDetails.body.FoodCategoryId,
    //    CategoryName: FoodCategoryDetails.body.CategoryName
    //}
    //if (FoodCategoryDetails.body.FoodCategoryId != "") {
    //    connection.query(queryStatement, [FoodCategories.CategoryName, FoodCategories.FoodCategoryId], function (err, result) {
    //        console.log("FoodCategories :-" + JSON.stringify(FoodCategories));
    //        if (err) { throw err; }
    //        console.log("Successfully Updated");
    //        OnSuccessCallback.send({ status: "Successfully Updated" });
    //    });
    //}
    //else {
    //   delete FoodCategories["FoodCategoryId"];    
    //}
    queryStatement = "INSERT INTO foodtransaction SET?";
    
    if (connection) {       
        connection.query(queryStatement, FoodWithQuantityDetails, function (err, result) {
            console.log("FoodTransaction :-" + JSON.stringify(FoodCategories));
            if (err) { throw err; }
            console.log("Successfully Inserted");
            OnSuccessCallback.send({ status: "Successfully Inserted into foodTransaction" });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.GetFoodCategoryDetailsByPrimaryKeyId = function (FoodCategoryInfo, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM foodcategory WHERE FoodCategoryId=?";
    
    if (connection) {
        connection.query(queryStatement, [FoodCategoryInfo.body.FoodCategoryId], function (err, rows, fields) {
            if (err) { throw err; }
            console.log("Successfully loaded..");
            OnSuccessCallback.send({ FoodCategory: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.DeleteFoodCategoryDetailsById = function (FoodCategoryInfo, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "DELETE FROM foodcategory WHERE FoodCategoryId=?";
    
    if (connection) {
        connection.query(queryStatement, [FoodCategoryInfo.body.FoodCategoryId], function (err, rows, fields) {
            if (err) { throw err; }
            console.log("Successfully Returned..");
            OnSuccessCallback.send({ status: "Successfully Returned" });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}