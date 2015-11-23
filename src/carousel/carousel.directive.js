'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        scope: {
            slides: '=?'
        },
        templateUrl: 'carousel/carousel.html',
        controller: function($scope) {
            $scope.currentIndex = -1;
            $scope.nextIndex = -1;
            $scope.currentSlide = null;
            $scope.nextSlide = null;
            $scope.isPlaying = false;

            $scope.play = function() {
                var count = $scope.slides.length;

                if (count === 0) {
                    return;
                }

                $scope.currentIndex = 0;
                $scope.currentSlide = $scope.slides[$scope.currentIndex];
                $scope.currentSlide.active = true;

                if (count > 1) {
                    $scope.nextIndex = $scope.getNextIndex();
                    $scope.nextSlide = $scope.slides[$scope.nextIndex];
                    $scope.nextSlide.preload = true;
                } else {
                    $scope.currentSlide.loop = true;
                }

                $scope.isPlaying = true;
            };

            $scope.stop = function() {
                $scope.isPlaying = false;

                if ($scope.currentSlide) {
                    delete $scope.currentSlide.active;
                    delete $scope.currentSlide.loop;
                }

                if ($scope.nextSlide) {
                    delete $scope.nextSlide.preload;
                }

                $scope.currentSlide = null;
                $scope.currentIndex = -1;
                $scope.nextSlide = null;
                $scope.nextIndex = -1;
            };

            $scope.getNextIndex = function() {
                var count = $scope.slides.length;
                var index = $scope.currentIndex + 1;

                if (index >= count) {
                    index = 0;
                }

                return index;
            }

            $scope.goNext = function() {
                if (!$scope.isPlaying) {
                    return;
                }

                delete $scope.currentSlide.active;

                $scope.currentIndex = $scope.nextIndex;
                $scope.currentSlide = $scope.nextSlide;

                $scope.nextIndex = $scope.getNextIndex();
                $scope.nextSlide = $scope.slides[$scope.nextIndex];

                $scope.nextSlide.preload = true;
                $scope.currentSlide.active = true;
            };
        }
    };
};
