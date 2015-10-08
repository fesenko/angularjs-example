'use strict';

var angular = require('angular');
require('angular-ui-router');
require('angular-animate');

require('./carousel');

var app = angular.module('app', [
    'ui.router',
    'ngAnimate',
    'app.carousel'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/carousel');

    $stateProvider
        .state('carousel', {
            url: '/carousel',
            controller: 'CarouselCtrl',
            templateUrl: 'carousel/index.html'
        });
});

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self'
    ]);
});
