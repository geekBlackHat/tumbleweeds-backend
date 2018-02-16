var connectionProvider = require('../mySqlConnectionStringProvider.js');

exports.GetExerciseDetails = function (request, response) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM exercisemaster";
    if (connection) {
        connection.query(queryStatement, function (err, rows, fields) {
            if (err) { response.send(500, { error: err }); }
            console.log("Successfully Loaded foods");
            response.send({ ExerciseList: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.GetExerciseDetailsSearch = function (FoodWithQuantityDetails, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM exercisemaster WHERE name LIKE '%?%'";
    
    if (connection) {
        connection.query(queryStatement, [FoodCategoryInfo.body.FoodCategoryId], function (err, rows, fields) {
            if (err) { throw err; }
            console.log("Successfully loaded..");
            OnSuccessCallback.send({ ExerciseList: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}