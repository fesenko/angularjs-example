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
            duration: '=?',
            transition: '=?',
            transitionDuration: '=?'
        },
        templateUrl: 'slides/image-slide.html',
        link: function(scope, element, attrs) {
            var $elem = angular.element(element);
            var delay = Number(scope.duration) || 4000;
            var transition = scope.transition || 'jumpCut';
            var timingFunc = transitionTimingFunctions[transition];
            var transitionDuration = scope.transitionDuration || 1;
            var timer = null;

            function activateTimer() {
                timer = $timeout(function() {
                    $animate.animate(element, {opacity: 1}, {opacity: 0})
                    .then(function() {
                        scope.preload = false;
                        scope.ended();
                    });
                }, delay);
            }

            function deactivateTimer() {
                $timeout.cancel(timer);
            }

            scope.$watch('active', function(newVal, oldVal) {
                if (newVal) {
                    $elem.css({
                        zIndex: 2,
                        transition: 'opacity ' + timingFunc + ' ' + transitionDuration + 's'
                    });

                    if (!scope.loop) {
                        activateTimer();
                    }

                    scope.loaded();
                } else if (oldVal) {
                    $elem.css({
                        zIndex: 0,
                        opacity: 1
                    });
                    deactivateTimer();
                }
            });

            scope.$watch('preload', function(val) {
                if (val) {
                    $elem.css({zIndex: 1});
                }
            });

            scope.$watch('loop', function(val) {
                if (val) {
                    deactivateTimer();
                }
            });
        }
    };
};
