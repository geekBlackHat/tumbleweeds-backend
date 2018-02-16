angular.module("userRegistrationModel")
.controller("userRegistrationController", function ($scope, userRegistrationService) {
    $scope.getRegistraionInfo = function () {
        var oResultOfGetRegistrationInfo = userRegistrationService.GetRegistrationDetails();
        oResultOfGetRegistrationInfo.then(function (pl) { 
            alert(pl);
        },
        function (errorpl) {
            $scope.error = "failed to loading Info. " + errorpl;
        });
    }
});
