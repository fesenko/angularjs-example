'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        scope: {
            slides: '=?'
        },
        templateUrl: 'carousel/carousel.html',
        controller: function($scope, $timeout) {
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
                currentSlide.active = true;

                if (count > 1) {
                    nextIndex = getNextIndex();
                    nextSlide = $scope.slides[nextIndex];
                } else {
                    currentSlide.loop = true;
                }

                $scope.isPlaying = true;
            };

            $scope.stop = function() {
                $scope.isPlaying = false;

                if (currentSlide) {
                    delete currentSlide.active;
                    delete currentSlide.loop;
                }

                currentSlide = null;
                currentIndex = -1;
                nextSlide = null;
                nextIndex = -1;
            };

            $scope.preloadNextSlide = function () {
                if (nextSlide) {
                    $timeout(function() {
                        nextSlide.preload = true;
                    }, 500);
                }

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

                delete currentSlide.active;

                currentIndex = nextIndex;
                currentSlide = nextSlide;

                nextIndex = getNextIndex();
                nextSlide = $scope.slides[nextIndex];

                currentSlide.active = true;
            };
        }
    };
};
