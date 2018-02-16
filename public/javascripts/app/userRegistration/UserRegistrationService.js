app.service("userRegistrationService", function ($http) {
    this.GetRegistrationDetails = function () { 
    return $http({
            method: "GET",
            url: ("/GetRegistrationInfo")
        })
    }
})