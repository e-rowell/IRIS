(function () {
    'use strict';

    angular
        .module('iris.nav')
        .component('irisNav', {
            templateUrl: 'src/components/nav/nav.template.html',
            controller: ['$mdSidenav', '$location', '$window', 'apiService', NavController],
            controllerAs: 'vm'
        });

    NavController.$inject = ['$mdSidenav', '$location', '$window', 'apiService'];


    function NavController($mdSidenav, $location, $window, apiService) {
        var vm = this;

        vm.toggleList = function () {
            $mdSidenav('left').toggle();
        };

        vm.navToDocs = function () {
            //$location.url('/apidoc');
            $window.location.href = 'http://localhost:8083/apidoc';
        };

        vm.getData = function () {
            apiService.getApiData().then(function (response) {
                vm.apiData = { groups: {}};

                for (var i = 0; i < response.data.length; i++) {
                    if (!vm.apiData.groups[response.data[i].group]) {
                        vm.apiData.groups[response.data[i].group] = [];
                        vm.apiData.groups[response.data[i].group].title = response.data[i].group;
                    }
                    vm.apiData.groups[response.data[i].group].push(response.data[i]);
                }
            });
        };

        ////////////////

        vm.$onInit = function () {
            // vm.getData();
        };
        vm.$onChanges = function (changesObj) { };
        vm.$onDestroy = function () { };

    }
})();