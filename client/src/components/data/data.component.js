(function () {
    'use strict';

    angular
        .module('iris.data')
        .component('irisData', {
            templateUrl: 'src/components/data/data.template.html',
            controller: ['apiService', '$q', '$http', '$window', DataController],
            controllerAs: 'vm'
        });

    DataController.$inject = ['apiService', '$q', '$http', '$window'];


    function DataController(apiService, $q, $http, $window) {
        var vm = this;

        vm.includeReports = false;
        vm.dataFormat = 'JSON';

        vm.query = {
            order: '-requestId',
            limit: 10,
            page: 1
        };

        vm.test = function () {
        };

        vm.getIncidents = function () {
            var deferred = $q.defer();
            vm.dataPromise = deferred.promise;
            apiService.getAllIncidents().then(function (response) {
                deferred.resolve();
                vm.incidents = response.data;
                console.log(response.data);
            }, function (error) {
                deferred.reject();
            })
        };

        vm.download = function () {
            $window.location.href = '/data/incidents?format=' + vm.dataFormat.toLowerCase();
            // $http.get('http://localhost:8083/data/incidents').
            //     then(function (response) {
            //         console.log('in data download response');
            // }, function (error) {
            //     console.log('in data download error');
            // });
        };

        ////////////////

        vm.$onInit = function () {
            vm.getIncidents();
        };
        vm.$onChanges = function (changesObj) { };
        vm.$onDestroy = function () { };

    }
})();