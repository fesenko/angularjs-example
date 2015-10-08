'use strict';

var angular = require('angular');

module.exports = function() {
    return {
        restrict: 'E',
        scope: {
            slides: '=?'
        },
        templateUrl: 'carousel/carousel.html',
        controller: function($scope) {
            var currentIndex = -1;
            var currentSlide = null;
            var nextIndex = -1;
            var nextSlide = null;

            $scope.isPlaying = false;

            $scope.play = function() {
                var count = $scope.slides.length;

                if (count === 0) {
                    return;
                }

                currentIndex = 0;
                currentSlide = $scope.slides[currentIndex];

                nextIndex = getNextIndex();
                nextSlide = $scope.slides[nextIndex];

                angular.extend(currentSlide, {active: true});
                angular.extend(nextSlide, {preload: true});

                $scope.isPlaying = true;
            };

            $scope.stop = function() {
                $scope.isPlaying = false;
                angular.extend(currentSlide, {active: false});
                angular.extend(nextSlide, {preload: false});
                currentSlide = null;
                currentIndex = -1;
                nextSlide = null;
                nextIndex = -1;
            };

            function getNextIndex() {
                var count = $scope.slides.length;
                var index = currentIndex + 1;

                if (index >= count) {
                    index = 0;
                }

                return index;
            }

            $scope.goNext = function() {
                if (!$scope.isPlaying) {
                    return;
                }

                angular.extend(currentSlide, {active: false});
                angular.extend(nextSlide, {preload: false});

                currentIndex = nextIndex;
                currentSlide = nextSlide;

                nextIndex = getNextIndex();
                nextSlide = $scope.slides[nextIndex];

                angular.extend(nextSlide, {preload: true});
                angular.extend(currentSlide, {active: true});
            };
        }
    };
};
