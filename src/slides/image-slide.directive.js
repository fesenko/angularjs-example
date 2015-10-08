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

            scope.$watch('active', function(active) {
                var timer;

                if (active) {
                    $elem.css({
                        zIndex: 2,
                        visibility: 'visible',
                        transition: 'opacity ' + timingFunc + ' ' + transitionDuration + 's'
                    });

                    timer = $timeout(function() {
                        $animate.animate(element, {opacity: 1}, {opacity: 0})
                        .then(function() {
                            scope.ended();
                        });
                    }, delay);
                } else {
                    $elem.css({
                        zIndex: 0,
                        opacity: 1,
                        visibility: 'hidden'
                    });
                    $timeout.cancel(timer);
                }
            });

            scope.$watch('preload', function(preload) {
                if (preload) {
                    $elem.css({
                        zIndex: 1,
                        visibility: 'hidden'
                    });
                }
            });
        }
    };
};
