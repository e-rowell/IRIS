(function () {
    'use strict';

    angular.module('iris.routing', ['ui.router', 'hj.gsapifyRouter'])
        .config(function ($stateProvider, gsapifyRouterProvider) {

            gsapifyRouterProvider.defaults = {
                enter: "fadeDelayed",
                leave: "fadeDelayed"
            };

            gsapifyRouterProvider.initialTransitionEnabled = true; // defaults to false

            $stateProvider
                .state('/', {
                    template: '<div ui-view class="gsapify-router"></div>',
                    url: '',
                    abstract: true
                })
                .state('data', {
                    url: '/data',
                    parent: '/',
                    template: '<iris-data></iris-data>'
                });
                // .state('apiDoc', {
                //     url: '/api-doc',
                //     parent: '/',
                //     template: '<iris-api-doc></iris-api-doc>'
                // });
                // .state('new-training-request', {
                //     url: '/requests/new',
                //     template: '<ctr-training-request></ctr-training-request>',
                //     params: {
                //         // reviewStatus should be set to
                //         requestInfo: { reviewStatus: Constants.REVIEW_STATUS.EMPLOYEE },
                //         employeeType: Constants.EMPLOYEE_TYPE.EMPLOYEE,
                //         editable: true
                //     }
                // })
                // .state('view-employee-request', {
                //     url: '/requests/:requestId',
                //     template: '<ctr-training-request></ctr-training-request>',
                //     params: {
                //         requestId: null,
                //         requestInfo: null,
                //         employeeType: null,
                //         editable: false
                //     }
                // })

                // .state('resubmit-training-request', {
                //     url: '/requests/resubmit-request/:requestId',
                //     template: '<ctr-training-request></ctr-training-request>',
                //     params: {
                //         requestInfo: { reviewStatus: Constants.REVIEW_STATUS.EMPLOYEE },
                //         employeeType: Constants.EMPLOYEE_TYPE.EMPLOYEE,
                //         editable: true,
                //         resubmission: true
                //     }
                // })
                //
                //
                // .state('supervisor', {
                //     url: '/supervisor',
                //     template: '<ctr-supervisor></ctr-supervisor>'
                // })
                //
                //
                // .state('supervisor-view-employee-request', {
                //     url: '/supervisor/:requestId',
                //     template: '<ctr-training-request></ctr-training-request>',
                //     params: {
                //         requestInfo: { reviewStatus: Constants.REVIEW_STATUS.SUPERVISOR },
                //         employeeType: Constants.EMPLOYEE_TYPE.SUPERVISOR,
                //         editable: true
                //     }
                // })
                //
                //
                // .state('chair', {
                //     url: '/chair',
                //     template: '<ctr-chair></ctr-chair>'
                // })
                //
                // .state('chair-view-employee-request', {
                //     url: '/chair/request/:requestId',
                //     template: '<ctr-training-request></ctr-training-request>',
                //     params: {
                //         requestInfo: null,
                //         employeeType: Constants.EMPLOYEE_TYPE.CHAIR,
                //         editable: null
                //     }
                // })
                //
                //
                // .state('committee', {
                //     url: '/committee',
                //     template: '<ctr-committee></ctr-committee>'
                // })
                // .state('committee-view-employee-request', {
                //     url: '/committee/request/:requestId',
                //     template: '<ctr-training-request></ctr-training-request>',
                //     params: {
                //         requestInfo: null,
                //         employeeType: Constants.EMPLOYEE_TYPE.COMMITTEE,
                //         editable: null
                //     }
                // })
                //
                //
                // .state('users', {
                //     url: '/users',
                //     template: '<ctr-user-management></ctr-user-management>'
                // })
                // .state('unauthorized', {
                //     url: '/unauthorized',
                //     templateUrl: 'src/templates/unauthorized.template.html'
                // })
                // .state('loading', {
                //     url: '/loading',
                //     templateUrl: 'src/templates/loading.template.html'
                // });
        });
})();