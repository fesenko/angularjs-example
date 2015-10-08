'use strict';

var angular = require('angular');
var transitionTimingFunctions = {
    fadeOut: 'linear',
    jumpCut: 'unset'
};

module.exports = function($timeout, $animate) {
    return {
        restrict: 'E',
        scope: {
            src: '=?',
            ended: '&',
            active: '=?',
            preload: '=?',
            transition: '=?',
            transitionDuration: '=?'
        },
        templateUrl: 'slides/video-slide.html',
        link: function(scope, element, attrs) {
            var $elem = angular.element(element);
            var transition = scope.transition || 'jumpCut';
            var timingFunc = transitionTimingFunctions[transition];
            var transitionDuration = scope.transitionDuration || 1;
            var $video;

            function removeEventListeners() {
                $video.one('ended');
                $video.one('error');
                $video.one('canplaythrough');
            }

            function addEventListeners() {
                $video.one('ended', onEnded);
                $video.one('error', onEnded);
                $video.one('canplaythrough', onCanplay);
            }

            function onEnded() {
                $timeout(function() {
                    $animate.animate(element, {opacity: 1}, {opacity: 0})
                    .then(function() {
                        removeEventListeners();
                        scope.canPlay = false;
                        $video = null;
                        scope.ended();
                    });
                }, 0);
            }

            function onCanplay() {
                scope.canPlay = true;
            }

            scope.$watch('active', function(active) {
                if (active) {
                    $elem.css({
                        zIndex: 2,
                        visibility: 'visible',
                        transition: 'opacity ' + timingFunc + ' ' + transitionDuration + 's'
                    });
                } else {
                    $elem.css({
                        zIndex: 0,
                        opacity: 1,
                        visibility: 'hidden'
                    });
                }
            });

            scope.$watch('preload', function(preload) {
                if (preload) {
                    $elem.css({
                        zIndex: 1,
                        visibility: 'hidden'
                    });
                    $video = $elem.find('video');
                    addEventListeners();
                }
            });

            scope.$watch(function() {
                return scope.canPlay && scope.active;
            }, function(value) {
                if (value) {
                    $video[0].play();
                }
            });
        }
    };
};
