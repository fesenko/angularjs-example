'use strict';

var angular = require('angular');
var carousel = require('./carousel.directive');

require('../slides');

angular
    .module('app.carousel', ['app.carousel.slides'])
    .directive('carousel', carousel);
