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
/*jshint
  devel: true
  */

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

},{}],4:[function(require,module,exports){
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

},{"angular":"angular"}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2Nhcm91c2VsL2Nhcm91c2VsLmNvbnRyb2xsZXIuanMiLCJzcmMvY2Fyb3VzZWwvY2Fyb3VzZWwuZGlyZWN0aXZlLmpzIiwic3JjL2Nhcm91c2VsL2luZGV4LmpzIiwic3JjL2Nhcm91c2VsL3NjcmVlbnNhdmVyLmRpcmVjdGl2ZS5qcyIsInNyYy9zbGlkZXMvaW1hZ2Utc2xpZGUuZGlyZWN0aXZlLmpzIiwic3JjL3NsaWRlcy9pbmRleC5qcyIsInNyYy9zbGlkZXMvdmlkZW8tc2xpZGUuZGlyZWN0aXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xucmVxdWlyZSgnYW5ndWxhci11aS1yb3V0ZXInKTtcbnJlcXVpcmUoJ2FuZ3VsYXItYW5pbWF0ZScpO1xuXG5yZXF1aXJlKCcuL2Nhcm91c2VsJyk7XG5cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICduZ0FuaW1hdGUnLFxuICAgICdhcHAuY2Fyb3VzZWwnXG5dKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2Nhcm91c2VsJyk7XG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2Nhcm91c2VsJywge1xuICAgICAgICAgICAgdXJsOiAnL2Nhcm91c2VsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXJvdXNlbEN0cmwnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjYXJvdXNlbC9pbmRleC5odG1sJ1xuICAgICAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzY2VEZWxlZ2F0ZVByb3ZpZGVyKSB7XG4gICAgJHNjZURlbGVnYXRlUHJvdmlkZXIucmVzb3VyY2VVcmxXaGl0ZWxpc3QoW1xuICAgICAgICAnc2VsZidcbiAgICBdKTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAkc2NvcGUuc2xpZGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAncGhvdG8nLFxuICAgICAgICAgICAgdXJsOiAnaW1nL2hrLmpwZycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnZmFkZU91dCcsXG4gICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IDFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ3Bob3RvJyxcbiAgICAgICAgICAgIHVybDogJ2ltZy9sb25kb24uanBlZycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnZmFkZU91dCcsXG4gICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IDFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ3ZpZGVvJyxcbiAgICAgICAgICAgIHVybDogJ2ltZy9iZWFjaC5tcDQnLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2p1bXBDdXQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdwaG90bycsXG4gICAgICAgICAgICB1cmw6ICdpbWcvbW9zY293LmpwZycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnanVtcEN1dCdcbiAgICAgICAgfVxuICAgIF07XG59O1xuXG4iLCIvKmpzaGludFxuICBkZXZlbDogdHJ1ZVxuICAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHNsaWRlczogJz0/J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2Nhcm91c2VsL2Nhcm91c2VsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICR0aW1lb3V0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gLTE7XG4gICAgICAgICAgICB2YXIgY3VycmVudFNsaWRlID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBuZXh0SW5kZXggPSAtMTtcbiAgICAgICAgICAgIHZhciBuZXh0U2xpZGUgPSBudWxsO1xuXG4gICAgICAgICAgICAkc2NvcGUuaXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICRzY29wZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gJHNjb3BlLnNsaWRlcy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgY3VycmVudFNsaWRlID0gJHNjb3BlLnNsaWRlc1tjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTbGlkZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0SW5kZXggPSBnZXROZXh0SW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFNsaWRlID0gJHNjb3BlLnNsaWRlc1tuZXh0SW5kZXhdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTbGlkZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUuaXNQbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmlzUGxheWluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTbGlkZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgY3VycmVudFNsaWRlLmFjdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGN1cnJlbnRTbGlkZS5sb29wO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1cnJlbnRTbGlkZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY3VycmVudEluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgbmV4dFNsaWRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBuZXh0SW5kZXggPSAtMTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRzY29wZS5wcmVsb2FkTmV4dFNsaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0U2xpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2xpZGUucHJlbG9hZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXROZXh0SW5kZXgoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gJHNjb3BlLnNsaWRlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSBjb3VudCkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkc2NvcGUuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgY3VycmVudFNsaWRlLmFjdGl2ZTtcblxuICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IG5leHRJbmRleDtcbiAgICAgICAgICAgICAgICBjdXJyZW50U2xpZGUgPSBuZXh0U2xpZGU7XG5cbiAgICAgICAgICAgICAgICBuZXh0SW5kZXggPSBnZXROZXh0SW5kZXgoKTtcbiAgICAgICAgICAgICAgICBuZXh0U2xpZGUgPSAkc2NvcGUuc2xpZGVzW25leHRJbmRleF07XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50U2xpZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG52YXIgY2Fyb3VzZWwgPSByZXF1aXJlKCcuL2Nhcm91c2VsLmRpcmVjdGl2ZScpO1xudmFyIHNjcmVlblNhdmVyID0gcmVxdWlyZSgnLi9zY3JlZW5zYXZlci5kaXJlY3RpdmUnKTtcbnZhciBDYXJvdXNlbEN0cmwgPSByZXF1aXJlKCcuL2Nhcm91c2VsLmNvbnRyb2xsZXInKTtcblxucmVxdWlyZSgnLi4vc2xpZGVzJyk7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY2Fyb3VzZWwnLCBbJ2FwcC5jYXJvdXNlbC5zbGlkZXMnXSlcbiAgICAuZGlyZWN0aXZlKCdjYXJvdXNlbCcsIGNhcm91c2VsKVxuICAgIC5kaXJlY3RpdmUoJ3NjcmVlbnNhdmVyJywgc2NyZWVuU2F2ZXIpXG4gICAgLmNvbnRyb2xsZXIoJ0Nhcm91c2VsQ3RybCcsIENhcm91c2VsQ3RybCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdjYXJvdXNlbC9zY3JlZW5zYXZlci5odG1sJ1xuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnZhciB0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb25zID0ge1xuICAgIGZhZGVPdXQ6ICdsaW5lYXInLFxuICAgIGp1bXBDdXQ6ICd1bnNldCdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHRpbWVvdXQsICRhbmltYXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHNyYzogJz0/JyxcbiAgICAgICAgICAgIGxvb3A6ICc9PycsXG4gICAgICAgICAgICBlbmRlZDogJyYnLFxuICAgICAgICAgICAgbG9hZGVkOiAnJicsXG4gICAgICAgICAgICBhY3RpdmU6ICc9PycsXG4gICAgICAgICAgICBwcmVsb2FkOiAnPT8nLFxuICAgICAgICAgICAgZHVyYXRpb246ICc9PycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnPT8nLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAnPT8nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc2xpZGVzL2ltYWdlLXNsaWRlLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciAkZWxlbSA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIHZhciBkZWxheSA9IE51bWJlcihzY29wZS5kdXJhdGlvbikgfHwgNDAwMDtcbiAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gc2NvcGUudHJhbnNpdGlvbiB8fCAnanVtcEN1dCc7XG4gICAgICAgICAgICB2YXIgdGltaW5nRnVuYyA9IHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbnNbdHJhbnNpdGlvbl07XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gc2NvcGUudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDE7XG4gICAgICAgICAgICB2YXIgdGltZXIgPSBudWxsO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZVRpbWVyKCkge1xuICAgICAgICAgICAgICAgIHRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRhbmltYXRlLmFuaW1hdGUoZWxlbWVudCwge29wYWNpdHk6IDF9LCB7b3BhY2l0eTogMH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJlbG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuZW5kZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkZWFjdGl2YXRlVGltZXIoKSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdhY3RpdmUnLCBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5ICcgKyB0aW1pbmdGdW5jICsgJyAnICsgdHJhbnNpdGlvbkR1cmF0aW9uICsgJ3MnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2NvcGUubG9vcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGVUaW1lcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubG9hZGVkKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvbGRWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGRlYWN0aXZhdGVUaW1lcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzY29wZS4kd2F0Y2goJ3ByZWxvYWQnLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtLmNzcyh7ekluZGV4OiAxfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnbG9vcCcsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVhY3RpdmF0ZVRpbWVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG52YXIgaW1hZ2VTbGlkZSA9IHJlcXVpcmUoJy4vaW1hZ2Utc2xpZGUuZGlyZWN0aXZlJyk7XG52YXIgdmlkZW9TbGlkZSA9IHJlcXVpcmUoJy4vdmlkZW8tc2xpZGUuZGlyZWN0aXZlJyk7XG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwLmNhcm91c2VsLnNsaWRlcycsIFtdKVxuICAuZGlyZWN0aXZlKCdpbWFnZVNsaWRlJywgaW1hZ2VTbGlkZSlcbiAgLmRpcmVjdGl2ZSgndmlkZW9TbGlkZScsIHZpZGVvU2xpZGUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnZhciB0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb25zID0ge1xuICAgIGZhZGVPdXQ6ICdsaW5lYXInLFxuICAgIGp1bXBDdXQ6ICd1bnNldCdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHRpbWVvdXQsICRhbmltYXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHNyYzogJz0/JyxcbiAgICAgICAgICAgIGxvb3A6ICc9PycsXG4gICAgICAgICAgICBlbmRlZDogJyYnLFxuICAgICAgICAgICAgbG9hZGVkOiAnJicsXG4gICAgICAgICAgICBhY3RpdmU6ICc9PycsXG4gICAgICAgICAgICBwcmVsb2FkOiAnPT8nLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogJz0/JyxcbiAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogJz0/J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NsaWRlcy92aWRlby1zbGlkZS5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgJGVsZW0gPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbiA9IHNjb3BlLnRyYW5zaXRpb24gfHwgJ2p1bXBDdXQnO1xuICAgICAgICAgICAgdmFyIHRpbWluZ0Z1bmMgPSB0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb25zW3RyYW5zaXRpb25dO1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbiA9IHNjb3BlLnRyYW5zaXRpb25EdXJhdGlvbiB8fCAxO1xuICAgICAgICAgICAgdmFyICR2aWRlbztcblxuICAgICAgICAgICAgZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICAgICAgJHZpZGVvLm9mZignZW5kZWQnKTtcbiAgICAgICAgICAgICAgICAkdmlkZW8ub2ZmKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgICR2aWRlby5vZmYoJ2NhbnBsYXl0aHJvdWdoJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgICAgICAgICAgICR2aWRlby5vbmUoJ2VuZGVkJywgb25FbmRlZCk7XG4gICAgICAgICAgICAgICAgJHZpZGVvLm9uZSgnZXJyb3InLCBvbkVuZGVkKTtcbiAgICAgICAgICAgICAgICAkdmlkZW8ub25lKCdjYW5wbGF5dGhyb3VnaCcsIG9uQ2FucGxheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uRW5kZWQoKSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRhbmltYXRlLmFuaW1hdGUoZWxlbWVudCwge29wYWNpdHk6IDF9LCB7b3BhY2l0eTogMH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhblBsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR2aWRlby5yZW1vdmVBdHRyKCdzcmMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR2aWRlbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wcmVsb2FkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5lbmRlZCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25DYW5wbGF5KCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLmNhblBsYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gcHJlbG9hZFZpZGVvKCkge1xuICAgICAgICAgICAgICAgICRlbGVtLmNzcyh7ekluZGV4OiAxfSk7XG4gICAgICAgICAgICAgICAgJHZpZGVvID0gJGVsZW0uZmluZCgndmlkZW8nKTtcbiAgICAgICAgICAgICAgICBhZGRFdmVudExpc3RlbmVycygpO1xuICAgICAgICAgICAgICAgICR2aWRlby5hdHRyKCdzcmMnLCBzY29wZS5zcmMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS4kd2F0Y2goJ2FjdGl2ZScsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXNjb3BlLnByZWxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlbG9hZFZpZGVvKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLmxvb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgJHZpZGVvLmF0dHIoJ2xvb3AnLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGVsZW0uY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAnICsgdGltaW5nRnVuYyArICcgJyArIHRyYW5zaXRpb25EdXJhdGlvbiArICdzJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgncHJlbG9hZCcsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlbG9hZFZpZGVvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuY2FuUGxheSAmJiBzY29wZS5hY3RpdmU7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICR2aWRlb1swXS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmxvYWRlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzY29wZS4kd2F0Y2goJ2xvb3AnLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoISR2aWRlbykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAkdmlkZW8uYXR0cignbG9vcCcsICcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkdmlkZW8ucmVtb3ZlQXR0cignbG9vcCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iXX0=
