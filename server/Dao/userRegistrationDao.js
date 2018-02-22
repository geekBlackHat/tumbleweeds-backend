var connectionProvider = require('../mySqlConnectionStringProvider.js');
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server
});

var BitGoJS = require('bitgo/src/index.js');

var useProduction = false;
//var bitgo = new BitGoJS.BitGo(useProduction);
var bitgo = new BitGoJS.BitGo({accessToken:'v2x7f28f92bee33837003bc69c2961081546102cf0e4af65c027cc5c1aafcb0a7dc'});


exports.AddUserRegistrationDetails = function (RegistrationDetails, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    console.log("ConnectionEstablished");
    var queryStatement = "";
    if (connection) {
        queryStatement = "SELECT * FROM users WHERE Email=?";
        connection.query(queryStatement, RegistrationDetails.body.Email, function (err, rows, fields) {
            if (err) { 
                OnSuccessCallback.send({res : err});
            }
            console.log("Successfully loaded..");
            if(rows == ""){

                queryStatement = "INSERT INTO users SET  FirstName=?, LastName=?, Email=?, Password=?, MobileNumber=?";
                var Registrations = {
                    UserId: RegistrationDetails.body.UserId,
                    FirstName: RegistrationDetails.body.FirstName,
                    LastName: RegistrationDetails.body.LastName,
                    Email: RegistrationDetails.body.Email,
                    Password: RegistrationDetails.body.Password,
                    MobileNumber: RegistrationDetails.body.MobileNumber
                }
                console.log(Registrations);
                if (connection) {
                    if(RegistrationDetails.body.Email != "") {
                    connection.query(queryStatement, [
                    Registrations.FirstName,
                    Registrations.LastName,
                    Registrations.Email,
                    Registrations.Password,
                    Registrations.MobileNumber], function (err, result) {
                            console.log("User Registrations :-" + JSON.stringify(Registrations));
                            if (err) { OnSuccessCallback.send({res : err}); }
                            console.log("Successfully Added A USer");
                            console.log("result.insertId", result.insertId);

                            var registeredUserId = result.insertId;
                            var id = '2NFTXvrnS2VqPByCtx7QU3M5msM93Xkv8pC';

                            bitgo.session({}, function callback(err, session) {
                                if (err) {
                                    // handle error
                                    OnSuccessCallback.send({res : err});
                                }
                                //console.dir(session);
                                bitgo.wallets().get({ "id": id }, function callback(err, wallet) {
                                  if (err) {
                                    //throw err;
                                    OnSuccessCallback.send({res : err});
                                  }
                                  else
                                  {
                                    wallet.createAddress({ "chain": 0 }, function callback(err, address) {
                                        console.log(address);
                                        //OnSuccessCallback.send({res : address});
                                        queryStatement = "insert into btcaddress set userid=?, address=?, chain=?,addIndex=?,path=?,redeemScript=?,wallet=? "
                                        // registeredUserId address.address address.chain address.index address.path address.redeemScript address.wallet
                                        if (connection) {
                                            connection.query(queryStatement, [
                                            registeredUserId,
                                            address.address,
                                            address.chain,
                                            address.index,
                                            address.path,
                                            address.redeemScript,
                                            address.wallet], function (err, result) {
                                                    if (err) { OnSuccessCallback.send({res : err}); }
                                                    OnSuccessCallback.send({ status: "Successfully Created" });
                                                    connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);

                                            })
                                        }
                                      });
                                  }       
                                });
                            });
                            //OnSuccessCallback.send({ status: "Successfully Updated" });
                        });
                    } 
                        
                }

            }
            else
            {
                OnSuccessCallback.send({ status: "User Already Created" });
            }


        });
    }

}

exports.GetUserRegistrationDetailsById = function (UserRegistrationInfo, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM users WHERE Email=? AND Password=?";
   
    if (connection) {
        connection.query(queryStatement, [UserRegistrationInfo.body.Email, UserRegistrationInfo.body.Password], function (err, rows, fields) {
            if (err) { OnSuccessCallback.send({res : err}); }
            console.log("Successfully loaded..");
            OnSuccessCallback.send({ Registrations: rows });
        });
        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
    }
}

exports.sendBTC = function (request, response) {
    var walletId = '2NFTXvrnS2VqPByCtx7QU3M5msM93Xkv8pC';
    var destinationAddress = request.body.destinationAddress; //SW15
    var amountSatoshis = parseFloat(request.body.amountSatoshis) * 1e8; // send 0.1 bitcoins
    var walletPassphrase = 'bitgo#94457869'; // replace with wallet passphrase
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();

    bitgo.session({}, function callback(err, session) {
        if (err) {
            // handle error
            response.send({res : err});
        }       
        else {
            bitgo.wallets().get({id: walletId}, function(err, wallet) {
          if (err) { 
            console.log("Error getting wallet!"); 
            console.dir(err); 
            response.send({res : err}); 
          }
          else{
            console.log("Balance is: " + (wallet.balance() / 1e8).toFixed(4));

                  wallet.sendCoins({ address: destinationAddress, amount: amountSatoshis, walletPassphrase: walletPassphrase }, function(err, result) {
                    if (err) { 
                        console.log("Error sending coins!"); 
                        console.dir(err); 
                        response.send({res : err}); 
                    }
                    else
                    {
                        console.dir(result);
                        var travelInfo = JSON.stringify(result.travelInfos);
                        var dobj = new Date();
                        var ts = dobj.getTime();
                        var queryStatement = "insert into btcsent set userId=?,amtSatoshis=?,destAddress=?,remarks=?,status=?,txId=?,hash=?,instant=?,fee=?,feeRate=?,travelInfos=?,timestamp=?"
                        if (connection) {
                            connection.query(queryStatement, [
                                request.body.userId,
                                amountSatoshis,
                                destinationAddress,
                                request.body.remarks,
                                result.status,
                                result.tx,
                                result.hash,
                                result.instant,
                                result.fee,
                                result.feeRate,
                                travelInfo,
                                ts], function (err, rows, fields) {
                                if (err) { response.send({res : err});  }
                                console.log("Successfully inserted tx into db..");

                                queryStatement = "select * from btcsent where userId = ?";
                                if (connection) {
                                    connection.query(queryStatement, [request.body.userId], function (err, rows, fields) {
                                        if (err) { response.send({res : err});  }
                                        response.send({ currentTransaction : result, transactions : rows });
                                        connectionProvider.mysqlConnectionStringProvider.closeMysqlConnection(connection);
                                    });
                                }

                                //OnSuccessCallback.send({ Registrations: rows });
                            });
                            
                        }
                    }           
                  });
              }
              
            });
        }
        
    });
}

exports.GetProfileData = function (request, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    var queryStatement = "SELECT * FROM users WHERE id=?";
    connection.query(queryStatement, parseInt(request.body.userid), (err, results, fields) => {
        if (err) { 
            OnSuccessCallback.send({res : err}); 
        }
        console.log("Successfully loaded..");
        var btcsentqueryStatement = "SELECT * FROM btcsent WHERE userId=?";
        connection.query(btcsentqueryStatement, parseInt(request.body.userid), (err, txtn, fields) => {
            if(err){
                OnSuccessCallback.send({res:err});
            }
            console.log("Bind Txtn");
            var btcaddressqueryStatement = "SELECT * FROM btcaddress WHERE userId=?";
            connection.query(btcaddressqueryStatement, parseInt(request.body.userid), (err, address, fields) => {
            if(err){
                OnSuccessCallback.send({res:err});
            }
              console.log("Bind Txtn");
              OnSuccessCallback.send({BTCTransactionHistory:txtn,userinfo:results,btcaddress:address});
            });
        });
        
    });
}

// Buy orders
var buyOrders = [];

// Sell orders
var sellOrders = [];

var tradingHistory = [];

exports.sellBTC = function (request, response) {
    var dto = new Date();
    var ts = dto.getTime();
    request.body['time'] = ts;
    sellOrders.push(request.body);
    console.log(request.body);
    console.log(sellOrders);
    sortSell();
    console.log(sellOrders);
    matchTrade();
    var io = request.app.get('socketio');
    var tickerData = {
        "buyOrders" : buyOrders,
        "sellOrders" : sellOrders,
        "tradingHistory" : tradingHistory
    }
    io.emit('ticker', tickerData);
    app.set('ticker-data', tickerData);
    response.send({"queue":sellOrders});

}

exports.buyBTC = function (request, response){
    var dto = new Date();
    var ts = dto.getTime();
    request.body['time'] = ts;
    buyOrders.push(request.body);
    console.log(request.body);
    console.log(buyOrders);
    sortBuy();
    console.log(buyOrders);
    matchTrade();
    var io = request.app.get('socketio');
    var tickerData = {
        "buyOrders" : buyOrders,
        "sellOrders" : sellOrders,
        "tradingHistory" : tradingHistory
    }
    io.emit('ticker', tickerData);
    app.set('ticker-data', tickerData);
    response.send({"queue":buyOrders});
}

var matchTrade = function(){
    if(buyOrders.length == 0 || sellOrders.length == 0)
    {
        return;
    }

    if(parseFloat(buyOrders[0].price) == parseFloat(sellOrders[0].price)){
        if(parseFloat(buyOrders[0].amount) == parseFloat(sellOrders[0].amount)){
            //  both orders are complete   
            completeTransaction(buyOrders[0], 'buy'); 
            completeTransaction(sellOrders[0], 'sell');
            tradingHistory.push(sellOrders[0]);   
            buyOrders.shift();
            sellOrders.shift();

        }
        else if (parseFloat(buyOrders[0].amount) > parseFloat(sellOrders[0].amount)){
            //sell order is complete
            completeTransaction(sellOrders[0], 'sell');
            var currentbuytx = Object.assign({},buyOrders[0]);
            currentbuytx.amount = sellOrders[0].amount;
            completeTransaction(currentbuytx, 'buy');
            sellOrders.shift();
            tradingHistory.push(currentbuytx);
            buyOrders[0].amount = parseFloat(buyOrders[0].amount) - parseFloat(currentbuytx.amount);
            matchTrade();
        }
        else{
            //buy order is complete
            completeTransaction(buyOrders[0], 'buy');
            var currentselltx = Object.assign({},sellOrders[0]);
            currentselltx.amount = buyOrders[0].amount;
            completeTransaction(currentselltx, 'sell');
            buyOrders.shift();
            tradingHistory.push(currentselltx);
            sellOrders[0].amount = parseFloat(sellOrders[0].amount) - parseFloat(currentselltx.amount);
            matchTrade();

        }
    }
    else{
        console.log("No matching orders");
    }
}

var completeTransaction = function(data, txType){    
    if(txType == 'buy'){
        console.log('completed buy',data);
    }
    else if(txType == 'sell'){
        console.log('completed sell',data);
    }
}

var sortBuy = function() {
    var bidComparator = function(a,b) {
        var ret = b.price-a.price;
        if(ret==0) {
            ret = a.time-b.time;
        }
        return ret;
    }
    buyOrders.sort(bidComparator);
}

var sortSell = function() {
    var askComparator = function(a,b) {
        var ret = a.price-b.price;
        if(ret==0) {
            ret = a.time-b.time;
        }
        return ret;
    }

    sellOrders.sort(askComparator);
}



/////////////////////OLD CODE //////////////////

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