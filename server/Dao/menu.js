var connectionProvider = require('../mySqlConnectionStringProvider.js');

exports.AddMenuCategory = function (req, res){
    var category = req.body.categoryName;
    
    console.log(category);

    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();

    if (category != "") {
        queryStatement = "select * from menu_categories where category_name= ?";
        if (connection) {
            connection.query(queryStatement, [category], function (err, result) {
                if (err) throw err;
                
                console.log("result----" + result.length);
                if (result.length === 0) {
                    queryStatement1 = "insert into Menu_categories set category_name = ?";
                    connection.query(queryStatement1, [category], function (err, result1) {
                        if (err) { throw err; }
                        console.log("Successfully loaded..");
                        res.send({ status: "Category Successfully Inserted" });
                        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                    });
                }
                else {
                    res.send({ status: "Category already exists" });
                    connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                }
            });
            
        }
    }
}

exports.GetAllCategory = function (req, res){
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM menu_categories";
    if (connection) {
        connection.query(queryStatement, function (err, rows, fields) {
            if (err) { res.send(500, { error: err }); }
            console.log("Successfully Loaded foods");
            res.send({ Categories: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.DeleteCategory = function (req, res){
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "Delete FROM menu_categories where idMenu_categories = ?";
    if (connection) {
        connection.query(queryStatement, [req.body.category_id], function (err, rows, fields) {
            if (err) { res.send(500, { error: err }); }
            console.log("Successfully Loaded foods");
            res.send({ status: "Successfully deleted" });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}


//menu items
exports.AddMenuItems = function (req, res) {
    var itemName = req.body.itemName;
    var menuCategory = req.body.menuCategory;
    var priceHalf = req.body.priceHalf;
    var priceFull = req.body.priceFull;
    var priceQuantity = req.body.priceQuantity;
    
    console.log(itemName + " " + menuCategory + " " + priceHalf + " " +priceFull + " " + priceQuantity);
    
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    
    if (menuCategory != "") {
        queryStatement = "select * from menu_items where name= ? and category = ?";
        if (connection) {
            connection.query(queryStatement, [itemName, menuCategory], function (err, result) {
                if (err) throw err;
                
                console.log("result----" + result.length);
                if (result.length === 0) {
                    queryStatement1 = "insert into menu_items set name = ?, category = ?, price_half=?, price_full=?, price_quantity=?, available=1";
                    connection.query(queryStatement1, [itemName, menuCategory, priceHalf, priceFull, priceQuantity], function (err, result1) {
                        if (err) { throw err; }
                        console.log("Successfully loaded..");
                        res.send({ status: "Category Successfully Inserted" });
                        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                    });
                }
                else {
                    res.send({ status: "Category already exists" });
                    connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                }
            });
            
        }
    }
} 


exports.GetMenuItems = function (req, res) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM menu_items";
    if (connection) {
        connection.query(queryStatement, function (err, rows, fields) {
            if (err) { res.send(500, { error: err }); }
            console.log("Successfully Loaded menu_items");
            res.send({ menu_items: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}