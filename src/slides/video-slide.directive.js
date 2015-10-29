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
            loop: '=?',
            ended: '&',
            loaded: '&',
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
                $video.off('ended');
                $video.off('error');
                $video.off('canplaythrough');
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
                        $video.removeAttr('src');
                        $video = null;
                        scope.preload = false;
                        scope.ended();
                    });
                }, 0);
            }

            function onCanplay() {
                scope.canPlay = true;
                scope.$digest();
            }

            function preloadVideo() {
                $elem.css({zIndex: 1});
                $video = $elem.find('video');
                addEventListeners();
                $video.attr('src', scope.src);
            }

            scope.$watch('active', function(val) {
                if (val !== true) {
                    $elem.css({
                        zIndex: 0,
                        opacity: 1
                    });
                    return;
                }

                if (!scope.preload) {
                    preloadVideo();
                }

                if (scope.loop) {
                    $video.attr('loop', '');
                }

                $elem.css({
                    zIndex: 2,
                    transition: 'opacity ' + timingFunc + ' ' + transitionDuration + 's'
                });
            });

            scope.$watch('preload', function(val) {
                if (val) {
                    preloadVideo();
                }
            });

            scope.$watch(function() {
                return scope.canPlay && scope.active;
            }, function(val) {
                if (val) {
                    $video[0].play();
                    scope.loaded();
                }
            });

            scope.$watch('loop', function(val) {
                if (!$video) {
                    return;
                }

                if (val) {
                    $video.attr('loop', '');
                } else {
                    $video.removeAttr('loop');
                }
            });
        }
    };
};
