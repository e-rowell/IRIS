(function () {
    'use strict';

    angular
        .module('iris', [
            /* App core modules */
            'iris.routing', 'iris.services',

            /* App modules */
            'iris.nav', 'iris.data', 'iris.apiDoc',

            /* External modules */
            'ngMaterial', 'ngAnimate', 'ngMessages', 'ngMdIcons', 'hj.gsapifyRouter', 'anim-in-out',
            'md.data.table'
        ])
        .config(function Config($mdThemingProvider, ngMdIconServiceProvider, $locationProvider, $httpProvider) {
            $mdThemingProvider
                .theme('default')
                .primaryPalette('blue-grey', {
                    'default': '800'
                })
                .accentPalette('teal');

            ngMdIconServiceProvider.addShapes({
                'database'     : '<path fill="#616161" d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />',
                'documentation': '<path fill="#616161" d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />',
                'download'     : '<path fill="#000000" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />'
            });

            $locationProvider.html5Mode(true);//.hashPrefix('');
        });

})();