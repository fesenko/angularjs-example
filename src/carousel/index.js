'use strict';

var angular = require('angular');
var carousel = require('./carousel.directive');
var screenSaver = require('./screensaver.directive');
var CarouselCtrl = require('./carousel.controller');

require('../slides');

angular
    .module('app.carousel', ['app.carousel.slides'])
    .directive('carousel', carousel)
    .directive('screensaver', screenSaver)
    .controller('CarouselCtrl', CarouselCtrl);
