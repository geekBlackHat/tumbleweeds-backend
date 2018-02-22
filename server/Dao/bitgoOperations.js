var BitGoJS = require('bitgo/src/index.js');

var useProduction = false;
//var bitgo = new BitGoJS.BitGo(useProduction);
//DMI IP v2x7f28f92bee33837003bc69c2961081546102cf0e4af65c027cc5c1aafcb0a7dc
//Home Add v2x3e51728cf22bcedddfa88ef928befa98af58631b27289b91786e9262bcfb0f8a
var bitgo = new BitGoJS.BitGo({accessToken:'v2x7f28f92bee33837003bc69c2961081546102cf0e4af65c027cc5c1aafcb0a7dc'});



exports.pingBitgo = function (request, response) {
	bitgo.ping({}, function(err, res) {
	  if (err) {
	    console.dir(err);
	    response.send({res : err});
	  } else {
	  	var resp = JSON.stringify(res, null, 4)
	    console.log(resp);
	    response.send({res : resp});
	  }
	});
}

exports.listWallets = function (request, response) {
	var wallets = bitgo.wallets();
	
	bitgo.session({}, function callback(err, session) {
		if (err) {
		    // handle error
		    response.send({res1 : err});
		}
		else{
		  	console.dir(session);
		  	wallets.list({}, function callback(err, data) {
				// handle error, do something with wallets
				for (var id in data.wallets) {
				  var wallet = data.wallets[id].wallet;
				  console.log(JSON.stringify(wallet, null, 4));
				}

				response.send({'Wallets' : data.wallets});
			});
		}
	});
}

exports.createNewAddress = function(request, response) {
	var id = '2NFTXvrnS2VqPByCtx7QU3M5msM93Xkv8pC';

	bitgo.session({}, function callback(err, session) {
		if (err) {
		    // handle error
		    response.send({res1 : err});
		}
	  	console.dir(session);
	 	bitgo.wallets().get({ "id": id }, function callback(err, wallet) {
		  if (err) {
		    //throw err;
		    response.send({res2 : err});
		  }
		  else
		  {
		  	wallet.createAddress({ "chain": 0 }, function callback(err, address) {
			    console.log(address);
			    response.send({res3 : address});
			  });
		  }		  
		});
	});
}

/*
{
"address": "2N1c1oDzTS2dJtBiZfTCPKXrrdSV8hahYS4",
"chain": 0,
"index": 1,
"path": "/0/1",
"redeemScript": "522102e97275d4c11d19088ce78719a30f9207d6f85099a0b552cda2c374961e4b8a8a2103a747c1b65e8f85f8fde2595f83b08fa04e7c270c8ac3b2a4af6b10a0fab7ea182103f7143b50139e45fcb0a21dc648cba80ef271ba5d1146b741384495316ce9803953ae",
"wallet": "2NFTXvrnS2VqPByCtx7QU3M5msM93Xkv8pC"
}
*/

exports.sendBitcoin = function(request, response) {
	var walletId = '2NFTXvrnS2VqPByCtx7QU3M5msM93Xkv8pC';
	var destinationAddress = '2MssDhdYbK4xvo1TRssnmQSzj8b3Mj2Cqub'; //SW15
	var amountSatoshis = 0.1 * 1e8; // send 0.1 bitcoins
	var walletPassphrase = 'bitgo#94457869'; // replace with wallet passphrase

	bitgo.session({}, function callback(err, session) {
		if (err) {
		    // handle error
		    response.send({res1 : err});
		}	  	
		else {
			bitgo.wallets().get({id: walletId}, function(err, wallet) {
		  if (err) { 
		  	console.log("Error getting wallet!"); 
		  	console.dir(err); 
		  	response.send({res2 : err}); 
		  }
		  else{
		  	console.log("Balance is: " + (wallet.balance() / 1e8).toFixed(4));

				  wallet.sendCoins({ address: destinationAddress, amount: amountSatoshis, walletPassphrase: walletPassphrase }, function(err, result) {
				    if (err) { 
				    	console.log("Error sending coins!"); 
				    	console.dir(err); 
				    	response.send({res3 : err}); 
				    }
				    else
				    {
				    	console.dir(result);
				    	response.send({res4 : result}); 
				    }		    
				  });
			  }
			  
			});
		}
		
	});
}

exports.AddressTransactionHistory = function(request, addresponse){
	var address = "2N3ijFxdaYv7KMhUTvW2LnkyLvHHjvL58hr";
	bitgo.session({}, function callback(err, session) {
		if (err) {
		    // handle error
		    addresponse.send({"err" : err});
		}
	  	console.dir(session);
		bitgo.blockchain().getAddressTransactions({address: address}, function(err, response) {
		  if (err) { console.log(err); 
		  	addresponse.send({
		  		"err" : err
		  	}); 
		  }
		  console.log(JSON.stringify(response, null, 4));
		  addresponse.send({response});
		});
	});
}