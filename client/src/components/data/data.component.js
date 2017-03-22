(function () {
    'use strict';

    angular
        .module('iris.data')
        .component('irisData', {
            templateUrl: 'src/components/data/data.template.html',
            controller: ['apiService', '$q', DataController],
            controllerAs: 'vm'
        });

    DataController.$inject = ['apiService', '$q'];


    function DataController(apiService, $q) {
        var vm = this;

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
        }

        ////////////////

        vm.$onInit = function () {
            vm.getIncidents();
        };
        vm.$onChanges = function (changesObj) { };
        vm.$onDestroy = function () { };

    }
})();