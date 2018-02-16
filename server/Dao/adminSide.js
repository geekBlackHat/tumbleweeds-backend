var connectionProvider = require('../mySqlConnectionStringProvider.js');

exports.GetOrderedItemsByTableNo = function (req, res) {
    console.log("1"+ req.body.orderId);
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    console.log("2");
    var queryStatement = "SELECT * FROM order_detail where id = ?";
    if (connection) {
        connection.query(queryStatement,[req.body.orderId], function (err, rows) {
            if (err) { res.send(500, { error: err }); }
            console.log("Successfully loaded Main Order"+ rows);
            var queryStatement1 = "SELECT * FROM order_detail where mainOrderId = ?";
            connection.query(queryStatement1, [req.body.orderId], function (err, rowsSubOrder) {
                if (err) { res.send(500, { error: err }); }
                console.log("Successfully loaded Sub Order" + rowsSubOrder);                
                var data = {
                    main_order: rows,
                    sub_orders: rowsSubOrder
                }
                res.send(data);
                connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
            });
        });       
    }
}

exports.SetOrderStatus = function (req, res) {
    console.log("setting status for order id : " + req.body.order_id + "to" + req.body.status);
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "update order_detail set order_status = ? where id = ?";
    if (connection) {
        connection.query(queryStatement, [req.body.status, req.body.order_id], function (err, rows) {
            if (err) { res.send(500, { error: err }); }
            console.log("Successfully Updated");
            res.send({status: "Successfully updated"});
        });
    }
}