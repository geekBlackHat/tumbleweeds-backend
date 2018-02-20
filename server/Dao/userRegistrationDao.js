var connectionProvider = require('../mySqlConnectionStringProvider.js');
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server
});

var BitGoJS = require('bitgo/src/index.js');

var useProduction = false;
//var bitgo = new BitGoJS.BitGo(useProduction);
var bitgo = new BitGoJS.BitGo({accessToken:'v2x3e51728cf22bcedddfa88ef928befa98af58631b27289b91786e9262bcfb0f8a'});



exports.AddUserRegistrationDetails = function (RegistrationDetails, OnSuccessCallback) {
    var connection = connectionProvider.mysqlConnectionStringProvider.getMysqlConnection();
    console.log("ConnectionEstablished");
    var queryStatement = "";
    /*if (RegistrationDetails.body.UserId != "") {
        console.log("in block");
        queryStatement = "UPDATE users SET Name=?, FirstName=?, LastName=?, Email=?, Password=?, MobileNumber=? WHERE UserId=?";
    }
    else {*/
        queryStatement = "INSERT INTO users SET  FirstName=?, LastName=?, Email=?, Password=?, MobileNumber=?";
    //}   
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
                                        response.send({ status:result.status, transactions : rows });
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