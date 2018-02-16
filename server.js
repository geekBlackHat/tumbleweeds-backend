﻿
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);

//var userRegistration = require('./routes/UserRegistrationRouteConfig.js');
//new userRegistration(app);

var dbuserRegistrationOperations = require("./server/Dao/userRegistrationDao.js");
app.get('/GetAccountInfo', dbuserRegistrationOperations.getAccountDetails);
app.get('/GetAllUsers', dbuserRegistrationOperations.getAllUsers);
app.get('/GetRegistrationInfo', dbuserRegistrationOperations.getUserRegistrationDetails);
app.post('/AddRegistrationInfo', dbuserRegistrationOperations.AddUserRegistrationDetails);
app.post('/GetRegistrationInfoById', dbuserRegistrationOperations.GetUserRegistrationDetailsById);
app.post('/GetUserRegistrationDetailsByPrimaryKeyId', dbuserRegistrationOperations.GetUserRegistrationDetailsByPrimaryKeyId);
app.post('/DeleteRegistrationInfo', dbuserRegistrationOperations.DeleteRegistrationInfoById);

var dbfoodMaster = require("./server/Dao/foodMasterDao.js");

app.get('/GetFoodMasterDetails', dbfoodMaster.GetFoodMasterDetails);
app.post('/AddFoodWithQuantity', dbfoodMaster.AddFoodWithQuantity);
app.post('/GetFoodCategoryByPrimaryKeyId', dbfoodMaster.GetFoodCategoryDetailsByPrimaryKeyId);
app.post('/DeleteFoodCategoryById', dbfoodMaster.DeleteFoodCategoryDetailsById);

var dbexerciseMaster = require("./server/Dao/exerciseMasterDao.js");




app.get('/GetExerciseDetails', dbexerciseMaster.GetExerciseDetails);
app.get('/GetExerciseDetailsSearch', dbexerciseMaster.GetExerciseDetailsSearch);

var rdbApi = require("./server/Dao/restdb.js");
app.post('/checkUser', rdbApi.AddUserRegistrationDetails);
app.post('/AddTables', rdbApi.AddTables); 
app.get('/GetAllTables', rdbApi.GetAllTables);
app.post('/DeleteTable', rdbApi.DeleteTable);

var menu = require("./server/Dao/menu.js")
app.post('/AddMenuCategory', menu.AddMenuCategory);
app.get('/GetAllCategory', menu.GetAllCategory);
app.post('/DeleteCategory', menu.DeleteCategory);
app.post('/AddMenuItems', menu.AddMenuItems);
app.get('/GetMenuItems', menu.GetMenuItems);

var customerApp = require('./server/Dao/customerSide.js');
app.post('/RegisterTable', customerApp.RegisterTable);
app.post('/startSession', customerApp.StartSession);
app.post('/CallWaiter', customerApp.CallWaiter);
app.post('/CalledWaiter', customerApp.CalledWaiter);
app.post('/PlaceMainOrder', customerApp.PlaceMainOrder); 
app.post('/PlaceSubOrder', customerApp.PlaceSubOrder); 
app.post('/EndSession', customerApp.EndSession);

var adminSide = require('./server/Dao/adminSide.js');
app.post('/getOrderDetails', adminSide.GetOrderedItemsByTableNo);
app.post('/SetOrderStatus', adminSide.SetOrderStatus);


//app.get('/GetExerciseDetailsSearch', rdbApi.GetExerciseDetailsSearch);

////////////////////////////////////////////
http.createServer(app).listen(app.get('port'), server_ip_address, function () {
    console.log('Express server listening on port ' + app.get('port') + "server_ip_address " + server_ip_address);
});
/**
 * On all requests add headers
 **/
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
};

app.configure(function () {
    app.use(allowCrossDomain);
});

