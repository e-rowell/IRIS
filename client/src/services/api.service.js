(function () {
    'use strict';

    angular
        .module('iris.services')
        .service('apiService', ['$http', '$httpParamSerializer', ApiService]);

    ApiService.$inject = ['$http', '$httpParamSerializer'];

    function ApiService($http, $httpParamSerializer) {
        var apiUrl = 'http://iris-app.westus.cloudapp.azure.com';

        return {
            getAllIncidents: getAllIncidents,
            getApiData: getApiData
        };

        ////////////////

        // Query Parameters:
        //      keywords (space separated)
        //      limit
        //      offset
        //      format
        function getAllIncidents(filters) {
            var url = '/api/incidents';
            if (filters) {
                var queryParams = '?' + $httpParamSerializer(filters);
                url += queryParams;
            }

            return $http.get(apiUrl + url);
        }

        function getApiData() {
            return $http.get(apiUrl + '/api/api_data.json');
        }
    }

})();