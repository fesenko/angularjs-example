'use strict';

var angular = require('angular');
require('angular-ui-router');
require('./carousel');

var app = angular.module('app', [
    'ui.router',
    'app.carousel'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('carousel', {
            url: '/',
            templateUrl: 'carousel/index.html'
        });
});

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://s3-ap-northeast-1.amazonaws.com/b2b-test-video/**'
    ]);
});
