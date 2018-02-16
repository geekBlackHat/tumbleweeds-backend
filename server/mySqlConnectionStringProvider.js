var mysql = require('mysql');
var mysqlConnectionString = require('./mySqlConnectionString.js');
var mysqlConnectionStringProvider = {
    getMysqlConnection: function ()
    {
     var connection = mysql.createConnection(mysqlConnectionString.mySqlConnectionString.connection.dev);
        connection.connect(function (err) {
            if (err) { throw err; }
            console.log("Connected Successfully...");
        });
        return connection;   
    },
    closeMysqlConnection: function (currentConnection) {
        if (currentConnection) {
            currentConnection.end(function (err) {
                if (err) { throw err; }
                console.log("Connection closed Successfully...");
            });
        }
    }
}
module.exports.mysqlConnectionStringProvider = mysqlConnectionStringProvider;
