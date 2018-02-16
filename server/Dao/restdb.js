var connectionProvider = require('../mySqlConnectionStringProvider.js');

exports.AddUserRegistrationDetails = function (RegistrationDetails, OnSuccessCallback) {
    //var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    console.log("Id :" + RegistrationDetails.body.table_no);
    //var queryStatement = "";
    //if (RegistrationDetails.body.UserRegistrationId != "") {
    //    queryStatement = "UPDATE userregistration SET Name=?, Email=?, Password=?, Phone=?, UserId=?, Country=?,Gender=?, Dob=?, Height=?, CurrentWt=?, GoalWt=?, ActivityLevel=?, DietGoal=?, TipsCategoryId=? WHERE UserRegistrationId=?";
    //}
    //else {
    //    queryStatement = "INSERT INTO userregistration SET?";
    //}
    //var Registrations = {
    //    UserRegistrationId: RegistrationDetails.body.UserRegistrationId,
    //    Name: RegistrationDetails.body.Name,
    //    Email: RegistrationDetails.body.Email,
    //    Password: RegistrationDetails.body.Password,
    //    Phone: RegistrationDetails.body.Phone,
    //    UserId: RegistrationDetails.body.UserId,
    //    Country: RegistrationDetails.body.Country,
    //    Gender: RegistrationDetails.body.Gender,
    //    Dob: RegistrationDetails.body.Dob,
    //    Height: RegistrationDetails.body.Height,
    //    CurrentWt: RegistrationDetails.body.CurrentWt,
    //    GoalWt: RegistrationDetails.body.GoalWt,
    //    ActivityLevel: RegistrationDetails.body.ActivityLevel,
    //    DietGoal: RegistrationDetails.body.DietGoal,
    //    TipsCategoryId: RegistrationDetails.body.TipsCategoryId
    //}
    //if (connection) {
    //    if (RegistrationDetails.body.UserRegistrationId != "") {
    //        connection.query(queryStatement, [Registrations.Name,
    //    Registrations.Email,
    //    Registrations.Password,
    //    Registrations.Phone,
    //    Registrations.UserId,
    //    Registrations.Country,
    //    Registrations.Gender,
    //    Registrations.Dob,
    //    Registrations.Height,
    //    Registrations.CurrentWt,
    //    Registrations.GoalWt,
    //    Registrations.ActivityLevel,
    //    Registrations.DietGoal,
    //    Registrations.TipsCategoryId, Registrations.UserRegistrationId], function (err, result) {
    //            console.log("Registrations :-" + JSON.stringify(Registrations));
    //            if (err) { throw err; }
    //            console.log("Successfully Updated");
    //            OnSuccessCallback.send({ status: "Successfully Updated" });
    //        });
    //    }
    //    else {
    //        delete Registrations["UserRegistrationId"];
    //        connection.query(queryStatement, Registrations, function (err, result) {
    //            console.log("Registrations :-" + JSON.stringify(Registrations));
    //            if (err) { throw err; }
    //            console.log("Successfully Inserted");
    //            OnSuccessCallback.send({ status: "Successfully Inserted" });
    //        });
    //    }
        
        //connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    //}
}

exports.AddTables = function (TableDetails, OnSuccessCallback) {
    console.log("TableDetails :");
    var abc = TableDetails.body.table_no;
    console.log("abc==== " + abc);
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    console.log("check----->>>"+ TableDetails.body.table_no);
    if (TableDetails.body.table_no != "") {
        
        queryStatement = "select * from tables where TableNo= ?";
        if (connection) {
            connection.query(queryStatement, [TableDetails.body.table_no], function (err, result) {
                if (err) throw err;

                console.log("result----" + result.length);
                if (result.length === 0) {
                    queryStatement1 = "insert into tables set TableNo = ?";
                    connection.query(queryStatement1, [TableDetails.body.table_no], function (err, result1) {
                        if (err) { throw err; }
                        console.log("Successfully loaded..");
                        OnSuccessCallback.send({ status: "Successfully Inserted into Tables" });
                        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                    });
                }
                else {
                    OnSuccessCallback.send({ status: "Table No already exists" });
                    connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                }
            });           
        }        
    }    
}

exports.GetAllTables = function (req, response) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM tables";
    if (connection) {
        connection.query(queryStatement, function (err, rows, fields) {
            if (err) { response.send(500, { error: err }); }
            console.log("Successfully Loaded foods");
            response.send({ Tables: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.DeleteTable = function (TableDetails, response) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "Delete FROM tables where idTables = ?";
    if (connection) {
        connection.query(queryStatement, [TableDetails.body.table_id], function (err, rows, fields) {
            if (err) { response.send(500, { error: err }); }
            console.log("Successfully Loaded foods");
            response.send({ status: "Successfully deleted" });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}








