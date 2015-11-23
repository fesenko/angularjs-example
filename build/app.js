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
                $video.one('error', onError);
                $video.one('canplaythrough', onCanplay);
            }

            function onEnded() {
                $timeout(function() {
                    $animate.animate(element, {opacity: 1}, {opacity: 0})
                    .then(function() {
                        removeEventListeners();
                        scope.canPlay = false;
                        $video.removeAttr('src');
                        $video[0].load();
                        $video = null;
                        scope.preload = false;
                        scope.ended();
                    });
                }, 0);
            }

            function onError(event) {
                console.info('Video error', new Date(), event.target.error, scope.src);
                onEnded();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2Nhcm91c2VsL2Nhcm91c2VsLmNvbnRyb2xsZXIuanMiLCJzcmMvY2Fyb3VzZWwvY2Fyb3VzZWwuZGlyZWN0aXZlLmpzIiwic3JjL2Nhcm91c2VsL2luZGV4LmpzIiwic3JjL2Nhcm91c2VsL3NjcmVlbnNhdmVyLmRpcmVjdGl2ZS5qcyIsInNyYy9zbGlkZXMvaW1hZ2Utc2xpZGUuZGlyZWN0aXZlLmpzIiwic3JjL3NsaWRlcy9pbmRleC5qcyIsInNyYy9zbGlkZXMvdmlkZW8tc2xpZGUuZGlyZWN0aXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5yZXF1aXJlKCdhbmd1bGFyLXVpLXJvdXRlcicpO1xucmVxdWlyZSgnYW5ndWxhci1hbmltYXRlJyk7XG5cbnJlcXVpcmUoJy4vY2Fyb3VzZWwnKTtcblxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ25nQW5pbWF0ZScsXG4gICAgJ2FwcC5jYXJvdXNlbCdcbl0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvY2Fyb3VzZWwnKTtcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnY2Fyb3VzZWwnLCB7XG4gICAgICAgICAgICB1cmw6ICcvY2Fyb3VzZWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Nhcm91c2VsQ3RybCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2Nhcm91c2VsL2luZGV4Lmh0bWwnXG4gICAgICAgIH0pO1xufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJHNjZURlbGVnYXRlUHJvdmlkZXIpIHtcbiAgICAkc2NlRGVsZWdhdGVQcm92aWRlci5yZXNvdXJjZVVybFdoaXRlbGlzdChbXG4gICAgICAgICdzZWxmJ1xuICAgIF0pO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICRzY29wZS5zbGlkZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdwaG90bycsXG4gICAgICAgICAgICB1cmw6ICdpbWcvaGsuanBnJyxcbiAgICAgICAgICAgIHRyYW5zaXRpb246ICdmYWRlT3V0JyxcbiAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogMVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAncGhvdG8nLFxuICAgICAgICAgICAgdXJsOiAnaW1nL2xvbmRvbi5qcGVnJyxcbiAgICAgICAgICAgIHRyYW5zaXRpb246ICdmYWRlT3V0JyxcbiAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogMVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAndmlkZW8nLFxuICAgICAgICAgICAgdXJsOiAnaW1nL2JlYWNoLm1wNCcsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnanVtcEN1dCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ3Bob3RvJyxcbiAgICAgICAgICAgIHVybDogJ2ltZy9tb3Njb3cuanBnJyxcbiAgICAgICAgICAgIHRyYW5zaXRpb246ICdqdW1wQ3V0J1xuICAgICAgICB9XG4gICAgXTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc2xpZGVzOiAnPT8nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnY2Fyb3VzZWwvY2Fyb3VzZWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRJbmRleCA9IC0xO1xuICAgICAgICAgICAgJHNjb3BlLm5leHRJbmRleCA9IC0xO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRTbGlkZSA9IG51bGw7XG4gICAgICAgICAgICAkc2NvcGUubmV4dFNsaWRlID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS5pc1BsYXlpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgJHNjb3BlLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgY291bnQgPSAkc2NvcGUuc2xpZGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRTbGlkZSA9ICRzY29wZS5zbGlkZXNbJHNjb3BlLmN1cnJlbnRJbmRleF07XG4gICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRTbGlkZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmV4dEluZGV4ID0gJHNjb3BlLmdldE5leHRJbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmV4dFNsaWRlID0gJHNjb3BlLnNsaWRlc1skc2NvcGUubmV4dEluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5leHRTbGlkZS5wcmVsb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudFNsaWRlLmxvb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRzY29wZS5pc1BsYXlpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmN1cnJlbnRTbGlkZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgJHNjb3BlLmN1cnJlbnRTbGlkZS5hY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuY3VycmVudFNsaWRlLmxvb3A7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5uZXh0U2xpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlICRzY29wZS5uZXh0U2xpZGUucHJlbG9hZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudFNsaWRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudEluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRTbGlkZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRJbmRleCA9IC0xO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmdldE5leHRJbmRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBjb3VudCA9ICRzY29wZS5zbGlkZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICRzY29wZS5jdXJyZW50SW5kZXggKyAxO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoISRzY29wZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuY3VycmVudFNsaWRlLmFjdGl2ZTtcblxuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50SW5kZXggPSAkc2NvcGUubmV4dEluZGV4O1xuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50U2xpZGUgPSAkc2NvcGUubmV4dFNsaWRlO1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRJbmRleCA9ICRzY29wZS5nZXROZXh0SW5kZXgoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dFNsaWRlID0gJHNjb3BlLnNsaWRlc1skc2NvcGUubmV4dEluZGV4XTtcblxuICAgICAgICAgICAgICAgICRzY29wZS5uZXh0U2xpZGUucHJlbG9hZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRTbGlkZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnZhciBjYXJvdXNlbCA9IHJlcXVpcmUoJy4vY2Fyb3VzZWwuZGlyZWN0aXZlJyk7XG52YXIgc2NyZWVuU2F2ZXIgPSByZXF1aXJlKCcuL3NjcmVlbnNhdmVyLmRpcmVjdGl2ZScpO1xudmFyIENhcm91c2VsQ3RybCA9IHJlcXVpcmUoJy4vY2Fyb3VzZWwuY29udHJvbGxlcicpO1xuXG5yZXF1aXJlKCcuLi9zbGlkZXMnKTtcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jYXJvdXNlbCcsIFsnYXBwLmNhcm91c2VsLnNsaWRlcyddKVxuICAgIC5kaXJlY3RpdmUoJ2Nhcm91c2VsJywgY2Fyb3VzZWwpXG4gICAgLmRpcmVjdGl2ZSgnc2NyZWVuc2F2ZXInLCBzY3JlZW5TYXZlcilcbiAgICAuY29udHJvbGxlcignQ2Fyb3VzZWxDdHJsJywgQ2Fyb3VzZWxDdHJsKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2Nhcm91c2VsL3NjcmVlbnNhdmVyLmh0bWwnXG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xudmFyIHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbnMgPSB7XG4gICAgZmFkZU91dDogJ2xpbmVhcicsXG4gICAganVtcEN1dDogJ3Vuc2V0J1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkdGltZW91dCwgJGFuaW1hdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc3JjOiAnPT8nLFxuICAgICAgICAgICAgbG9vcDogJz0/JyxcbiAgICAgICAgICAgIGVuZGVkOiAnJicsXG4gICAgICAgICAgICBsb2FkZWQ6ICcmJyxcbiAgICAgICAgICAgIGFjdGl2ZTogJz0/JyxcbiAgICAgICAgICAgIHByZWxvYWQ6ICc9PycsXG4gICAgICAgICAgICBkdXJhdGlvbjogJz0/JyxcbiAgICAgICAgICAgIHRyYW5zaXRpb246ICc9PycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246ICc9PydcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzbGlkZXMvaW1hZ2Utc2xpZGUuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgdmFyICRlbGVtID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgdmFyIGRlbGF5ID0gTnVtYmVyKHNjb3BlLmR1cmF0aW9uKSB8fCA0MDAwO1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb24gPSBzY29wZS50cmFuc2l0aW9uIHx8ICdqdW1wQ3V0JztcbiAgICAgICAgICAgIHZhciB0aW1pbmdGdW5jID0gdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uc1t0cmFuc2l0aW9uXTtcbiAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uRHVyYXRpb24gPSBzY29wZS50cmFuc2l0aW9uRHVyYXRpb24gfHwgMTtcbiAgICAgICAgICAgIHZhciB0aW1lciA9IG51bGw7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlVGltZXIoKSB7XG4gICAgICAgICAgICAgICAgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJGFuaW1hdGUuYW5pbWF0ZShlbGVtZW50LCB7b3BhY2l0eTogMX0sIHtvcGFjaXR5OiAwfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wcmVsb2FkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5lbmRlZCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlYWN0aXZhdGVUaW1lcigpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS4kd2F0Y2goJ2FjdGl2ZScsIGZ1bmN0aW9uKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgJyArIHRpbWluZ0Z1bmMgKyAnICcgKyB0cmFuc2l0aW9uRHVyYXRpb24gKyAncydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzY29wZS5sb29wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZVRpbWVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5sb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9sZFZhbCkge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZGVhY3RpdmF0ZVRpbWVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgncHJlbG9hZCcsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW0uY3NzKHt6SW5kZXg6IDF9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdsb29wJywgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBkZWFjdGl2YXRlVGltZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnZhciBpbWFnZVNsaWRlID0gcmVxdWlyZSgnLi9pbWFnZS1zbGlkZS5kaXJlY3RpdmUnKTtcbnZhciB2aWRlb1NsaWRlID0gcmVxdWlyZSgnLi92aWRlby1zbGlkZS5kaXJlY3RpdmUnKTtcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAuY2Fyb3VzZWwuc2xpZGVzJywgW10pXG4gIC5kaXJlY3RpdmUoJ2ltYWdlU2xpZGUnLCBpbWFnZVNsaWRlKVxuICAuZGlyZWN0aXZlKCd2aWRlb1NsaWRlJywgdmlkZW9TbGlkZSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xudmFyIHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbnMgPSB7XG4gICAgZmFkZU91dDogJ2xpbmVhcicsXG4gICAganVtcEN1dDogJ3Vuc2V0J1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkdGltZW91dCwgJGFuaW1hdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc3JjOiAnPT8nLFxuICAgICAgICAgICAgbG9vcDogJz0/JyxcbiAgICAgICAgICAgIGVuZGVkOiAnJicsXG4gICAgICAgICAgICBsb2FkZWQ6ICcmJyxcbiAgICAgICAgICAgIGFjdGl2ZTogJz0/JyxcbiAgICAgICAgICAgIHByZWxvYWQ6ICc9PycsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnPT8nLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAnPT8nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc2xpZGVzL3ZpZGVvLXNsaWRlLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciAkZWxlbSA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gc2NvcGUudHJhbnNpdGlvbiB8fCAnanVtcEN1dCc7XG4gICAgICAgICAgICB2YXIgdGltaW5nRnVuYyA9IHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbnNbdHJhbnNpdGlvbl07XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbkR1cmF0aW9uID0gc2NvcGUudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDE7XG4gICAgICAgICAgICB2YXIgJHZpZGVvO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgICAgICAgICAkdmlkZW8ub2ZmKCdlbmRlZCcpO1xuICAgICAgICAgICAgICAgICR2aWRlby5vZmYoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgJHZpZGVvLm9mZignY2FucGxheXRocm91Z2gnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICAgICAgJHZpZGVvLm9uZSgnZW5kZWQnLCBvbkVuZGVkKTtcbiAgICAgICAgICAgICAgICAkdmlkZW8ub25lKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgICAgICAgICAgICR2aWRlby5vbmUoJ2NhbnBsYXl0aHJvdWdoJywgb25DYW5wbGF5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25FbmRlZCgpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJGFuaW1hdGUuYW5pbWF0ZShlbGVtZW50LCB7b3BhY2l0eTogMX0sIHtvcGFjaXR5OiAwfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuUGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHZpZGVvLnJlbW92ZUF0dHIoJ3NyYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHZpZGVvWzBdLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR2aWRlbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wcmVsb2FkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5lbmRlZCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25FcnJvcihldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnVmlkZW8gZXJyb3InLCBuZXcgRGF0ZSgpLCBldmVudC50YXJnZXQuZXJyb3IsIHNjb3BlLnNyYyk7XG4gICAgICAgICAgICAgICAgb25FbmRlZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkNhbnBsYXkoKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuY2FuUGxheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBwcmVsb2FkVmlkZW8oKSB7XG4gICAgICAgICAgICAgICAgJGVsZW0uY3NzKHt6SW5kZXg6IDF9KTtcbiAgICAgICAgICAgICAgICAkdmlkZW8gPSAkZWxlbS5maW5kKCd2aWRlbycpO1xuICAgICAgICAgICAgICAgIGFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAgICAgJHZpZGVvLmF0dHIoJ3NyYycsIHNjb3BlLnNyYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnYWN0aXZlJywgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghc2NvcGUucHJlbG9hZCkge1xuICAgICAgICAgICAgICAgICAgICBwcmVsb2FkVmlkZW8oKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubG9vcCkge1xuICAgICAgICAgICAgICAgICAgICAkdmlkZW8uYXR0cignbG9vcCcsICcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkZWxlbS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5ICcgKyB0aW1pbmdGdW5jICsgJyAnICsgdHJhbnNpdGlvbkR1cmF0aW9uICsgJ3MnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdwcmVsb2FkJywgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBwcmVsb2FkVmlkZW8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS5jYW5QbGF5ICYmIHNjb3BlLmFjdGl2ZTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHZpZGVvWzBdLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubG9hZGVkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnbG9vcCcsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmICghJHZpZGVvKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICR2aWRlby5hdHRyKCdsb29wJywgJycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICR2aWRlby5yZW1vdmVBdHRyKCdsb29wJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiJdfQ==
