'use strict';

var angular = require('angular');

module.exports = function($interval, $scope) {
    var self = this;
    var slides = [
        {
            type: 'image',
            src: 'https://s3-ap-northeast-1.amazonaws.com/b2b-test-video/cities/hk.jpg'
        },
        {
            type: 'video',
            src: 'https://s3-ap-northeast-1.amazonaws.com/b2b-test-video/videos/beach.mp4'
        },
        {
            type: 'image',
            src: 'https://s3-ap-northeast-1.amazonaws.com/b2b-test-video/cities/london.jpeg'
        },
        {
            type: 'video',
            src: 'https://s3-ap-northeast-1.amazonaws.com/b2b-test-video/videos/flow.mp4'
        },
        {
            type: 'image',
            src: 'https://s3-ap-northeast-1.amazonaws.com/b2b-test-video/cities/moscow.jpg'
        }
    ];

    $scope.slides = slides;

    var currentIndex = -1;
    var currentSlide = null;

    $scope.play = function() {
        self.goNext();

        // $interval(self.goNext, 3000);
    };

    self.goNext = function() {
        var count = slides.length;
        var index = currentIndex + 1;

        if (index >= count) {
            index = 0;
        }

        currentIndex = index;

        if (currentSlide) {
            angular.extend(currentSlide, {active: false});
        }

        currentSlide = slides[currentIndex];
        angular.extend(currentSlide, {active: true});
    };
};
