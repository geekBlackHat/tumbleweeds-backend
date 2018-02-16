function UserRegistrationRouteConfig(app){
    this.app = app;
    this.routeTable = [];
    this.init();
}


UserRegistrationRouteConfig.prototype.init = function() {
    var self = this;
    this.addRoutes();
    this.processRoutes();
}
//UserRegistrationRouteConfig.prototype.processRoutes = function () {
//    var self = this;
//    self.routeTable.forEach(function (route){
//        if (route.requestType == 'get') {
//            self.app.get(route.requestUrl, route.callbackFunction);
//        }
//        else if (route.requestType == 'post') { }
//        else if (route.requestType == 'delete') { }
//    })
//}
//UserRegistrationRouteConfig.prototype.addRoutes = function () {
//    var self = this;
//    self.routeTable.push({
//        requestType: 'get',
//        requestUrl: '/GetRegistrationInfo',
//        callbackFunction: function (request, response) {
//            var GetRegistrationInfoDao = require('../server/Dao/userRegistrationDao.js');
//            GetRegistrationInfoDao.userRegistrationDao.getUserRegistrationDetails(
//                function (UserRegistrations) {
//                    console.log(UserRegistrations);
//                    response.json({ UserRegistraionDetails: UserRegistrations });
//                });
//        }
//    });
//}
//module.exports = UserRegistrationRouteConfig;