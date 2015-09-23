'use strict';

var angular = require('angular');
var imageSlide = require('./image-slide.directive');
var videoSlide = require('./video-slide.directive');

angular
  .module('app.carousel.slides', [])
  .directive('imageSlide', imageSlide)
  .directive('videoSlide', videoSlide);
