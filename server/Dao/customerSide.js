var connectionProvider = require('../mySqlConnectionStringProvider.js');

exports.RegisterTable = function (req, res) {
    var tableNo = req.body.table_no;
    console.log("Checking status for table no" + tableNo);
    
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    queryStatement = "select * from tables where TableNo = ?";
    if (connection) {
        connection.query(queryStatement, [tableNo], function (err, result) {
            if (err)
                throw err;
            if (result.length != 0) {
                console.log("Fetching table status " + result[0].Status);
                if (result[0].Status == 0) // Free for occupancy
                {
                    res.send({ status: 0 });
                }
                else if (result[0].Status == 1) // Occupied but not ordered
                {
                    res.send({ status: 1, table_details: result })
                }
                else if (result[0].Status == 2) // Occupied and ordered
                {
                    //Fetch all the placed order
                    var queryStatement = "SELECT * FROM order_detail where id = ?";
                    if (connection) {
                        connection.query(queryStatement, [result[0].MainOrderId], function (err, rows) {
                            if (err) { res.send(500, { error: err }); }
                            console.log("Successfully loaded Main Order" + rows);
                            var queryStatement1 = "SELECT * FROM order_detail where mainOrderId = ?";
                            connection.query(queryStatement1, [result[0].MainOrderId], function (err, rowsSubOrder) {
                                if (err) { res.send(500, { error: err }); }
                                console.log("Successfully loaded Sub Order" + rowsSubOrder);
                                res.send({ status: 2, table_details: result, table_order : { main_order: rows, sub_orders: rowsSubOrder } });
                                connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                            });
                        });
                    }
                }
            }
            else {
                res.send({ status: 3 });
                //connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
            }
            
        });
    }
}

exports.StartSession = function (req, res) {
    var tableNo = req.body.table_no;
    var customerName = req.body.cust_name;
    var customerMob = req.body.cust_phone;
    var timestamp = new Date();
    
    console.log(tableNo+" "+ customerName+" "+customerMob);
    
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    
    if (tableNo != "" && customerName != "" && customerMob != "") {
        queryStatement = "select * from tables where TableNo= ?";
        if (connection) {
            connection.query(queryStatement, [tableNo], function (err, result) {
                if (err) throw err;
                
                console.log("result----" + result.length);
                if (result.length != 0) {
                    queryStatement1 = "update tables set Status = 1, CustName = ?, CustMob = ?, TimeStamp = ? where TableNo = ?";
                    connection.query(queryStatement1, [customerName, customerMob, timestamp, tableNo], function (err, result1) {
                        if (err) { throw err; }
                        console.log("Successfully loaded..");
                        res.send({ status: "Inserted in tables" });
                        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                    });
                }
                else {
                    res.send({ status: "Table doesn't exists" });
                    connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                }
            });
            
        }
    }
}

exports.EndSession = function (req, res) {
    console.log("Ending session for table no : " + req.body.table_no);
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "update tables set Status = 0, CallForWaiter = 0, CustName = null, CustMob = null, TimeStamp = null, MainOrderId = null where TableNo = ?";
    if (connection) {
        connection.query(queryStatement, [req.body.table_no], function (err, rows) {
            if (err) { res.send(500, { error: err }); }
            console.log("Successfully ended session");         
            res.send({ status: "Logged out!" });
        });
    }
}

exports.CallWaiter = function (req, res) {
    var tableNo = req.body.table_no;   
    
    console.log(tableNo);
    
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    
    if (tableNo != "" ) {
        queryStatement = "select * from tables where TableNo= ?";
        if (connection) {
            connection.query(queryStatement, [tableNo], function (err, result) {
                if (err) throw err;
                
                console.log("result----" + result.length);
                if (result.length != 0) {
                    queryStatement1 = "update tables set CallForWaiter = 1 where TableNo = ?";
                    connection.query(queryStatement1, [tableNo], function (err, result1) {
                        if (err) { throw err; }
                        console.log("Successfully loaded..");
                        res.send({ status: "Inserted in tables" });
                        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                    });
                }
                else {
                    res.send({ status: "Table doesn't exists" });
                    connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                }
            });
            
        }
    }
}

exports.CalledWaiter = function (req, res) {
    var tableNo = req.body.table_no;
    
    console.log(tableNo);
    
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    
    if (tableNo != "") {
        queryStatement = "select * from tables where TableNo= ?";
        if (connection) {
            connection.query(queryStatement, [tableNo], function (err, result) {
                if (err) throw err;
                
                console.log("result----" + result.length);
                if (result.length != 0) {
                    queryStatement1 = "update tables set CallForWaiter = 0 where TableNo = ?";
                    connection.query(queryStatement1, [tableNo], function (err, result1) {
                        if (err) { throw err; }
                        console.log("Successfully loaded..");
                        res.send({ status: "Inserted in tables" });
                        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                    });
                }
                else {
                    res.send({ status: "Table doesn't exists" });
                    connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                }
            });
            
        }
    }
}

exports.PlaceMainOrder = function (req, res) {
    console.log(req.body);
    var timestamp = new Date();    
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    queryStatement = "insert into order_detail set table_no=?, datetime=?, order_item=?, cust_name=?, cust_phone=?, total_bill=?, main_order=?";
    if (connection) {
        connection.query(queryStatement, [req.body.table_no, timestamp, JSON.stringify(req.body.orders), req.body.cust_name, req.body.cust_Mob, req.body.totalPrice, req.body.mainOrder  ] , function (err, result) {
            if (err)
                throw err;
            console.log(result.insertId);
            console.log("Successfully added");
            queryStatement1 = "update tables set Status = 2, MainOrderId = ? where TableNo = ?";
            connection.query(queryStatement1, [result.insertId, req.body.table_no], function (err, result1) {
                if (err) { throw err; }
                console.log("Successfully loaded..");
                //res.send({ status: "Inserted in tables" });
                connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
            });
            res.send({ status: "Order placed!", orderId: result.insertId});
            //connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
        });
    }
}

exports.PlaceSubOrder = function (req, res) {
    console.log(req.body);
    var timestamp = new Date();
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    queryStatement = "insert into order_detail set table_no=?, datetime=?, order_item=?, cust_name=?, cust_phone=?, total_bill=?, main_order=?, mainOrderId=?";
    if (connection) {
        connection.query(queryStatement, [req.body.table_no, timestamp, JSON.stringify(req.body.orders), req.body.cust_name, req.body.cust_Mob, req.body.totalPrice, req.body.mainOrder, req.body.mainOrderId] , function (err, result) {
            if (err)
                throw err;
            console.log(result.insertId);
            queryStatement1 = "update tables set Status = 2 where TableNo = ?";
            connection.query(queryStatement1, [req.body.table_no], function (err, result1) {
                if (err) { throw err; }
                console.log("Successfully loaded..");
                //res.send({ status: "Inserted in tables" });
                connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
            });
            console.log("Successfully added");
            res.send({ status: "Order placed!", orderId: result.insertId });
            //connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
        });
    }
}

