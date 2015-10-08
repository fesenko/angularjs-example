(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var angular = require('angular');
require('angular-ui-router');
require('angular-animate');

require('./carousel');

var app = angular.module('app', [
    'ui.router',
    'ngAnimate',
    'app.carousel'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/carousel');

    $stateProvider
        .state('carousel', {
            url: '/carousel',
            controller: 'CarouselCtrl',
            templateUrl: 'carousel/index.html'
        });
});

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self'
    ]);
});

},{"./carousel":4,"angular":"angular","angular-animate":"angular-animate","angular-ui-router":"angular-ui-router"}],2:[function(require,module,exports){
'use strict';

var angular = require('angular');

module.exports = function($scope) {
    $scope.slides = [
        {
            type: 'photo',
            url: 'img/hk.jpg',
            transition: 'fadeOut',
            transitionDuration: 1
        },
        {
            type: 'photo',
            url: 'img/london.jpeg',
            transition: 'fadeOut',
            transitionDuration: 1
        },
        {
            type: 'video',
            url: 'img/beach.mp4',
            transition: 'jumpCut'
        },
        {
            type: 'photo',
            url: 'img/moscow.jpg',
            transition: 'jumpCut'
        }
    ];
};


},{"angular":"angular"}],3:[function(require,module,exports){
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

},{"angular":"angular"}],4:[function(require,module,exports){
'use strict';

var angular = require('angular');
var carousel = require('./carousel.directive');
var screenSaver = require('./screensaver.directive');
var CarouselCtrl = require('./carousel.controller');

require('../slides');

angular
    .module('app.carousel', ['app.carousel.slides'])
    .directive('carousel', carousel)
    .directive('screensaver', screenSaver)
    .controller('CarouselCtrl', CarouselCtrl);

},{"../slides":7,"./carousel.controller":2,"./carousel.directive":3,"./screensaver.directive":5,"angular":"angular"}],5:[function(require,module,exports){
'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        templateUrl: 'carousel/screensaver.html'
    };
};

},{}],6:[function(require,module,exports){
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

},{"angular":"angular"}],7:[function(require,module,exports){
'use strict';

var angular = require('angular');
var imageSlide = require('./image-slide.directive');
var videoSlide = require('./video-slide.directive');

angular
  .module('app.carousel.slides', [])
  .directive('imageSlide', imageSlide)
  .directive('videoSlide', videoSlide);

},{"./image-slide.directive":6,"./video-slide.directive":8,"angular":"angular"}],8:[function(require,module,exports){
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

},{"angular":"angular"}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2Nhcm91c2VsL2Nhcm91c2VsLmNvbnRyb2xsZXIuanMiLCJzcmMvY2Fyb3VzZWwvY2Fyb3VzZWwuZGlyZWN0aXZlLmpzIiwic3JjL2Nhcm91c2VsL2luZGV4LmpzIiwic3JjL2Nhcm91c2VsL3NjcmVlbnNhdmVyLmRpcmVjdGl2ZS5qcyIsInNyYy9zbGlkZXMvaW1hZ2Utc2xpZGUuZGlyZWN0aXZlLmpzIiwic3JjL3NsaWRlcy9pbmRleC5qcyIsInNyYy9zbGlkZXMvdmlkZW8tc2xpZGUuZGlyZWN0aXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xucmVxdWlyZSgnYW5ndWxhci11aS1yb3V0ZXInKTtcbnJlcXVpcmUoJ2FuZ3VsYXItYW5pbWF0ZScpO1xuXG5yZXF1aXJlKCcuL2Nhcm91c2VsJyk7XG5cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICduZ0FuaW1hdGUnLFxuICAgICdhcHAuY2Fyb3VzZWwnXG5dKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2Nhcm91c2VsJyk7XG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2Nhcm91c2VsJywge1xuICAgICAgICAgICAgdXJsOiAnL2Nhcm91c2VsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXJvdXNlbEN0cmwnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjYXJvdXNlbC9pbmRleC5odG1sJ1xuICAgICAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzY2VEZWxlZ2F0ZVByb3ZpZGVyKSB7XG4gICAgJHNjZURlbGVnYXRlUHJvdmlkZXIucmVzb3VyY2VVcmxXaGl0ZWxpc3QoW1xuICAgICAgICAnc2VsZidcbiAgICBdKTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAkc2NvcGUuc2xpZGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAncGhvdG8nLFxuICAgICAgICAgICAgdXJsOiAnaW1nL2hrLmpwZycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnZmFkZU91dCcsXG4gICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IDFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ3Bob3RvJyxcbiAgICAgICAgICAgIHVybDogJ2ltZy9sb25kb24uanBlZycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnZmFkZU91dCcsXG4gICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IDFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ3ZpZGVvJyxcbiAgICAgICAgICAgIHVybDogJ2ltZy9iZWFjaC5tcDQnLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2p1bXBDdXQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdwaG90bycsXG4gICAgICAgICAgICB1cmw6ICdpbWcvbW9zY293LmpwZycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnanVtcEN1dCdcbiAgICAgICAgfVxuICAgIF07XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBzbGlkZXM6ICc9PydcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjYXJvdXNlbC9jYXJvdXNlbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gLTE7XG4gICAgICAgICAgICB2YXIgY3VycmVudFNsaWRlID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBuZXh0SW5kZXggPSAtMTtcbiAgICAgICAgICAgIHZhciBuZXh0U2xpZGUgPSBudWxsO1xuXG4gICAgICAgICAgICAkc2NvcGUuaXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICRzY29wZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gJHNjb3BlLnNsaWRlcy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgY3VycmVudFNsaWRlID0gJHNjb3BlLnNsaWRlc1tjdXJyZW50SW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgbmV4dEluZGV4ID0gZ2V0TmV4dEluZGV4KCk7XG4gICAgICAgICAgICAgICAgbmV4dFNsaWRlID0gJHNjb3BlLnNsaWRlc1tuZXh0SW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgYW5ndWxhci5leHRlbmQoY3VycmVudFNsaWRlLCB7YWN0aXZlOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5leHRlbmQobmV4dFNsaWRlLCB7cHJlbG9hZDogdHJ1ZX0pO1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmlzUGxheWluZyA9IHRydWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkc2NvcGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChjdXJyZW50U2xpZGUsIHthY3RpdmU6IGZhbHNlfSk7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5leHRlbmQobmV4dFNsaWRlLCB7cHJlbG9hZDogZmFsc2V9KTtcbiAgICAgICAgICAgICAgICBjdXJyZW50U2xpZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgIG5leHRTbGlkZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgbmV4dEluZGV4ID0gLTE7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXROZXh0SW5kZXgoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gJHNjb3BlLnNsaWRlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSBjb3VudCkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkc2NvcGUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChjdXJyZW50U2xpZGUsIHthY3RpdmU6IGZhbHNlfSk7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5leHRlbmQobmV4dFNsaWRlLCB7cHJlbG9hZDogZmFsc2V9KTtcblxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IG5leHRJbmRleDtcbiAgICAgICAgICAgICAgICBjdXJyZW50U2xpZGUgPSBuZXh0U2xpZGU7XG5cbiAgICAgICAgICAgICAgICBuZXh0SW5kZXggPSBnZXROZXh0SW5kZXgoKTtcbiAgICAgICAgICAgICAgICBuZXh0U2xpZGUgPSAkc2NvcGUuc2xpZGVzW25leHRJbmRleF07XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChuZXh0U2xpZGUsIHtwcmVsb2FkOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5leHRlbmQoY3VycmVudFNsaWRlLCB7YWN0aXZlOiB0cnVlfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xudmFyIGNhcm91c2VsID0gcmVxdWlyZSgnLi9jYXJvdXNlbC5kaXJlY3RpdmUnKTtcbnZhciBzY3JlZW5TYXZlciA9IHJlcXVpcmUoJy4vc2NyZWVuc2F2ZXIuZGlyZWN0aXZlJyk7XG52YXIgQ2Fyb3VzZWxDdHJsID0gcmVxdWlyZSgnLi9jYXJvdXNlbC5jb250cm9sbGVyJyk7XG5cbnJlcXVpcmUoJy4uL3NsaWRlcycpO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNhcm91c2VsJywgWydhcHAuY2Fyb3VzZWwuc2xpZGVzJ10pXG4gICAgLmRpcmVjdGl2ZSgnY2Fyb3VzZWwnLCBjYXJvdXNlbClcbiAgICAuZGlyZWN0aXZlKCdzY3JlZW5zYXZlcicsIHNjcmVlblNhdmVyKVxuICAgIC5jb250cm9sbGVyKCdDYXJvdXNlbEN0cmwnLCBDYXJvdXNlbEN0cmwpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY2Fyb3VzZWwvc2NyZWVuc2F2ZXIuaHRtbCdcbiAgICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG52YXIgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9ucyA9IHtcbiAgICBmYWRlT3V0OiAnbGluZWFyJyxcbiAgICBqdW1wQ3V0OiAndW5zZXQnXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCR0aW1lb3V0LCAkYW5pbWF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBzcmM6ICc9PycsXG4gICAgICAgICAgICBlbmRlZDogJyYnLFxuICAgICAgICAgICAgYWN0aXZlOiAnPT8nLFxuICAgICAgICAgICAgcHJlbG9hZDogJz0/JyxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAnPT8nLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogJz0/JyxcbiAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogJz0/J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NsaWRlcy9pbWFnZS1zbGlkZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgJGVsZW0gPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBOdW1iZXIoc2NvcGUuZHVyYXRpb24pIHx8IDQwMDA7XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbiA9IHNjb3BlLnRyYW5zaXRpb24gfHwgJ2p1bXBDdXQnO1xuICAgICAgICAgICAgdmFyIHRpbWluZ0Z1bmMgPSB0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb25zW3RyYW5zaXRpb25dO1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbiA9IHNjb3BlLnRyYW5zaXRpb25EdXJhdGlvbiB8fCAxO1xuXG4gICAgICAgICAgICBzY29wZS4kd2F0Y2goJ2FjdGl2ZScsIGZ1bmN0aW9uKGFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lcjtcblxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICd2aXNpYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5ICcgKyB0aW1pbmdGdW5jICsgJyAnICsgdHJhbnNpdGlvbkR1cmF0aW9uICsgJ3MnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkYW5pbWF0ZS5hbmltYXRlKGVsZW1lbnQsIHtvcGFjaXR5OiAxfSwge29wYWNpdHk6IDB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuZW5kZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdwcmVsb2FkJywgZnVuY3Rpb24ocHJlbG9hZCkge1xuICAgICAgICAgICAgICAgIGlmIChwcmVsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnZhciBpbWFnZVNsaWRlID0gcmVxdWlyZSgnLi9pbWFnZS1zbGlkZS5kaXJlY3RpdmUnKTtcbnZhciB2aWRlb1NsaWRlID0gcmVxdWlyZSgnLi92aWRlby1zbGlkZS5kaXJlY3RpdmUnKTtcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAuY2Fyb3VzZWwuc2xpZGVzJywgW10pXG4gIC5kaXJlY3RpdmUoJ2ltYWdlU2xpZGUnLCBpbWFnZVNsaWRlKVxuICAuZGlyZWN0aXZlKCd2aWRlb1NsaWRlJywgdmlkZW9TbGlkZSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xudmFyIHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbnMgPSB7XG4gICAgZmFkZU91dDogJ2xpbmVhcicsXG4gICAganVtcEN1dDogJ3Vuc2V0J1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkdGltZW91dCwgJGFuaW1hdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc3JjOiAnPT8nLFxuICAgICAgICAgICAgZW5kZWQ6ICcmJyxcbiAgICAgICAgICAgIGFjdGl2ZTogJz0/JyxcbiAgICAgICAgICAgIHByZWxvYWQ6ICc9PycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnPT8nLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAnPT8nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc2xpZGVzL3ZpZGVvLXNsaWRlLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciAkZWxlbSA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gc2NvcGUudHJhbnNpdGlvbiB8fCAnanVtcEN1dCc7XG4gICAgICAgICAgICB2YXIgdGltaW5nRnVuYyA9IHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbnNbdHJhbnNpdGlvbl07XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gc2NvcGUudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDE7XG4gICAgICAgICAgICB2YXIgJHZpZGVvO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgICAgICAgICAkdmlkZW8ub25lKCdlbmRlZCcpO1xuICAgICAgICAgICAgICAgICR2aWRlby5vbmUoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgJHZpZGVvLm9uZSgnY2FucGxheXRocm91Z2gnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICAgICAgJHZpZGVvLm9uZSgnZW5kZWQnLCBvbkVuZGVkKTtcbiAgICAgICAgICAgICAgICAkdmlkZW8ub25lKCdlcnJvcicsIG9uRW5kZWQpO1xuICAgICAgICAgICAgICAgICR2aWRlby5vbmUoJ2NhbnBsYXl0aHJvdWdoJywgb25DYW5wbGF5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25FbmRlZCgpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJGFuaW1hdGUuYW5pbWF0ZShlbGVtZW50LCB7b3BhY2l0eTogMX0sIHtvcGFjaXR5OiAwfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuUGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHZpZGVvID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmVuZGVkKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkNhbnBsYXkoKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuY2FuUGxheSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnYWN0aXZlJywgZnVuY3Rpb24oYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ3Zpc2libGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgJyArIHRpbWluZ0Z1bmMgKyAnICcgKyB0cmFuc2l0aW9uRHVyYXRpb24gKyAncydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdwcmVsb2FkJywgZnVuY3Rpb24ocHJlbG9hZCkge1xuICAgICAgICAgICAgICAgIGlmIChwcmVsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJHZpZGVvID0gJGVsZW0uZmluZCgndmlkZW8nKTtcbiAgICAgICAgICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS5jYW5QbGF5ICYmIHNjb3BlLmFjdGl2ZTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICR2aWRlb1swXS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiJdfQ==
