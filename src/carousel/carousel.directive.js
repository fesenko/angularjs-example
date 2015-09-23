'use strict';

var angular = require('angular');
var CarouselCtrl = require('./carousel.controller');

module.exports = function($interval) {
    return {
        restrict: 'E',
        controller: CarouselCtrl,
        templateUrl: '/carousel/carousel.html'
    };
};
