'use strict';

var angular = require('angular');

module.exports = function($timeout) {
    return {
        restrict: 'E',
        require: '^carousel',
        scope: {
            src: '=?',
            active: '=?'
        },
        templateUrl: '/slides/video-slide.html',
        link: function(scope, element, attrs, carouselCtrl) {
            var activeClassName = 'active';
            var $elem = angular.element(element);
            var $video = $elem.find('video');
            var video = $video[0];
            var canPlay = false;

            $video.on('canplaythrough', function() {
                canPlay = true;
                video.pause();
            });

            $video.on('ended', function() {
                video.currentTime = 0;
                $timeout(function() {
                    carouselCtrl.goNext();
                }, 0);
            });

            scope.$watch(function() {
                return canPlay && scope.active;
            }, function(value) {
                if (value) {
                    video.play();
                }
            });

            scope.$watch('active', function(active) {
                if (active) {
                    $elem.addClass(activeClassName);
                } else {
                    $elem.removeClass(activeClassName);
                }
            });
        }
    };
};
