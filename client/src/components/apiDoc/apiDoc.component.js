(function () {
    'use strict';

    angular
        .module('iris.apiDoc')
        .component('irisApiDoc', {
            templateUrl: 'src/components/apiDoc/apiDoc.template.html',
            controller: [ApiDocController],
            controllerAs: 'vm'
        });

    ApiDocController.$inject = [];


    function ApiDocController() {
        var vm = this;

        ////////////////

        vm.$onInit = function () {

        };
        vm.$onChanges = function (changesObj) { };
        vm.$onDestroy = function () { };

    }
})();