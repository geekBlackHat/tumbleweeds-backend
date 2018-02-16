var connectionProvider = require('../mySqlConnectionStringProvider.js');
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server
});


exports.getAccountDetails = function (request, response) {
   
    api.connect().then(() => {
      /* begin custom code ------------------------------------ */
      const myAddress = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';

      console.log('getting account info for', myAddress);
      //var acInfoRes = api.getAccountInfo(myAddress)
      api.getAccountInfo(myAddress);
      //response.send({'data': api.getAccountInfo(myAddress)});
    }).then(info => {
      console.log(info);
      console.log('getAccountInfo done');

      /* end custom code -------------------------------------- */
    }).then(() => {
       api.disconnect();
    }).then(() => {
      console.log('done and disconnected.');
    }).catch(console.error);
}

exports.getAllUsers = function (request, response) {
   
        var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
        var queryStatement = "SELECT * FROM user";
        if (connection) {
            connection.query(queryStatement, function (err, rows, fields) {
                if (err) {response.send(500, { error: err }); }
            console.log("Successfully Loaded");
             response.send({ Registrations: rows });
            });
            connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
        }
}

exports.getUserRegistrationDetails = function (request, response) {
   
        var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
        var queryStatement = "SELECT * FROM userregistration";
        if (connection) {
            connection.query(queryStatement, function (err, rows, fields) {
                if (err) {response.send(500, { error: err }); }
            console.log("Successfully Loaded");
             response.send({ Registrations: rows });
            });
            connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
        }
}

exports.AddUserRegistrationDetails = function (RegistrationDetails, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    console.log("Id :" + RegistrationDetails.body.UserRegistrationId);
    var queryStatement = "";
    if (RegistrationDetails.body.UserRegistrationId != "") {
        queryStatement = "UPDATE userregistration SET Name=?, Email=?, Password=?, Phone=?, UserId=?, Country=?,Gender=?, Dob=?, Height=?, CurrentWt=?, GoalWt=?, ActivityLevel=?, DietGoal=?, TipsCategoryId=? WHERE UserRegistrationId=?";
    }
    else {
        queryStatement = "INSERT INTO userregistration SET?";
    }   
    var Registrations = {
        UserRegistrationId: RegistrationDetails.body.UserRegistrationId,
        Name: RegistrationDetails.body.Name,
        Email: RegistrationDetails.body.Email,
        Password: RegistrationDetails.body.Password,
        Phone: RegistrationDetails.body.Phone,
        UserId: RegistrationDetails.body.UserId,
        Country: RegistrationDetails.body.Country,
        Gender: RegistrationDetails.body.Gender,
        Dob: RegistrationDetails.body.Dob,
        Height: RegistrationDetails.body.Height,
        CurrentWt: RegistrationDetails.body.CurrentWt,
        GoalWt: RegistrationDetails.body.GoalWt,
        ActivityLevel: RegistrationDetails.body.ActivityLevel,
        DietGoal: RegistrationDetails.body.DietGoal,
        TipsCategoryId: RegistrationDetails.body.TipsCategoryId
    }
    if (connection) {
        if(RegistrationDetails.body.UserRegistrationId != "") {
        connection.query(queryStatement, [Registrations.Name,
        Registrations.Email,
        Registrations.Password,
        Registrations.Phone,
        Registrations.UserId,
        Registrations.Country,
        Registrations.Gender,
        Registrations.Dob,
        Registrations.Height,
        Registrations.CurrentWt,
        Registrations.GoalWt,
        Registrations.ActivityLevel,
        Registrations.DietGoal,
        Registrations.TipsCategoryId, Registrations.UserRegistrationId], function (err, result) {
                console.log("Registrations :-" + JSON.stringify(Registrations));
                if (err) { throw err; }
                console.log("Successfully Updated");
                OnSuccessCallback.send({ status: "Successfully Updated" });
            });
        }
        else {
            delete Registrations["UserRegistrationId"];
        connection.query(queryStatement, Registrations, function (err, result) {
                console.log("Registrations :-" + JSON.stringify(Registrations));
                if (err) { throw err; }
                console.log("Successfully Inserted");
                OnSuccessCallback.send({ status: "Successfully Inserted" });
            });
        }
       
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.GetUserRegistrationDetailsById = function (UserRegistrationInfo, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM userregistration WHERE Email=? AND Password=?";
   
    if (connection) {
        connection.query(queryStatement, [UserRegistrationInfo.body.Email, UserRegistrationInfo.body.Password], function (err, rows, fields) {
            if (err) { throw err; }
            console.log("Successfully loaded..");
            OnSuccessCallback.send({ Registrations: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.GetUserRegistrationDetailsByPrimaryKeyId = function (UserRegistrationInfo, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM userregistration WHERE UserRegistrationId=?";
    
    if (connection) {
        connection.query(queryStatement, [UserRegistrationInfo.body.UserRegistrationId], function (err, rows, fields) {
            if (err) { throw err; }
            console.log("Successfully loaded..");
            OnSuccessCallback.send({ Registrations: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.DeleteRegistrationInfoById = function (UserRegistrationInfo, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "DELETE FROM userregistration WHERE UserRegistrationId=?";
    
    if (connection) {
        connection.query(queryStatement, [UserRegistrationInfo.body.UserRegistrationId], function (err, rows, fields) {
            if (err) { throw err; }
            console.log("Successfully Deleted..");
            OnSuccessCallback.send({ status: "Successfully Deleted" });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}