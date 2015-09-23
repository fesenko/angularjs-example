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
        templateUrl: '/slides/image-slide.html',
        link: function(scope, element, attrs, carouselCtrl) {
            var $elem = angular.element(element);
            var activeClassName = 'active';

            scope.$watch('active', function(active) {
                if (active) {
                    $elem.addClass(activeClassName);

                    $timeout(carouselCtrl.goNext, 3000);
                } else {
                    $elem.removeClass(activeClassName);
                }
            });
        }
    };
};
