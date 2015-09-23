(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var angular = require('angular');
require('angular-ui-router');
require('./carousel');

var app = angular.module('app', [
    'ui.router',
    'app.carousel'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('carousel', {
            url: '/',
            templateUrl: 'carousel/index.html'
        });
});

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://s3-ap-northeast-1.amazonaws.com/b2b-test-video/**'
    ]);
});

},{"./carousel":4,"angular":"angular","angular-ui-router":"angular-ui-router"}],2:[function(require,module,exports){
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

},{"angular":"angular"}],3:[function(require,module,exports){
'use strict';

var angular = require('angular');
var CarouselCtrl = require('./carousel.controller');

module.exports = function($interval) {
    return {
        restrict: 'E',
        controller: CarouselCtrl,
        templateUrl: '/carousel/carousel.html'
    };
};

},{"./carousel.controller":2,"angular":"angular"}],4:[function(require,module,exports){
'use strict';

var angular = require('angular');
var carousel = require('./carousel.directive');

require('../slides');

angular
    .module('app.carousel', ['app.carousel.slides'])
    .directive('carousel', carousel);

},{"../slides":6,"./carousel.directive":3,"angular":"angular"}],5:[function(require,module,exports){
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

},{"angular":"angular"}],6:[function(require,module,exports){
'use strict';

var angular = require('angular');
var imageSlide = require('./image-slide.directive');
var videoSlide = require('./video-slide.directive');

angular
  .module('app.carousel.slides', [])
  .directive('imageSlide', imageSlide)
  .directive('videoSlide', videoSlide);

},{"./image-slide.directive":5,"./video-slide.directive":7,"angular":"angular"}],7:[function(require,module,exports){
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
        templateUrl: '/slides/video-slide.html',
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

},{"angular":"angular"}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2Nhcm91c2VsL2Nhcm91c2VsLmNvbnRyb2xsZXIuanMiLCJzcmMvY2Fyb3VzZWwvY2Fyb3VzZWwuZGlyZWN0aXZlLmpzIiwic3JjL2Nhcm91c2VsL2luZGV4LmpzIiwic3JjL3NsaWRlcy9pbWFnZS1zbGlkZS5kaXJlY3RpdmUuanMiLCJzcmMvc2xpZGVzL2luZGV4LmpzIiwic3JjL3NsaWRlcy92aWRlby1zbGlkZS5kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5yZXF1aXJlKCdhbmd1bGFyLXVpLXJvdXRlcicpO1xucmVxdWlyZSgnLi9jYXJvdXNlbCcpO1xuXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnYXBwLmNhcm91c2VsJ1xuXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnY2Fyb3VzZWwnLCB7XG4gICAgICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2Fyb3VzZWwvaW5kZXguaHRtbCdcbiAgICAgICAgfSk7XG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkc2NlRGVsZWdhdGVQcm92aWRlcikge1xuICAgICRzY2VEZWxlZ2F0ZVByb3ZpZGVyLnJlc291cmNlVXJsV2hpdGVsaXN0KFtcbiAgICAgICAgJ3NlbGYnLFxuICAgICAgICAnaHR0cHM6Ly9zMy1hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL2IyYi10ZXN0LXZpZGVvLyoqJ1xuICAgIF0pO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnRlcnZhbCwgJHNjb3BlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBzbGlkZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgICAgICBzcmM6ICdodHRwczovL3MzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYjJiLXRlc3QtdmlkZW8vY2l0aWVzL2hrLmpwZydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ3ZpZGVvJyxcbiAgICAgICAgICAgIHNyYzogJ2h0dHBzOi8vczMtYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbS9iMmItdGVzdC12aWRlby92aWRlb3MvYmVhY2gubXA0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICAgICAgc3JjOiAnaHR0cHM6Ly9zMy1hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL2IyYi10ZXN0LXZpZGVvL2NpdGllcy9sb25kb24uanBlZydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ3ZpZGVvJyxcbiAgICAgICAgICAgIHNyYzogJ2h0dHBzOi8vczMtYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbS9iMmItdGVzdC12aWRlby92aWRlb3MvZmxvdy5tcDQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgICAgICBzcmM6ICdodHRwczovL3MzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYjJiLXRlc3QtdmlkZW8vY2l0aWVzL21vc2Nvdy5qcGcnXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgJHNjb3BlLnNsaWRlcyA9IHNsaWRlcztcblxuICAgIHZhciBjdXJyZW50SW5kZXggPSAtMTtcbiAgICB2YXIgY3VycmVudFNsaWRlID0gbnVsbDtcblxuICAgICRzY29wZS5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuZ29OZXh0KCk7XG5cbiAgICAgICAgLy8gJGludGVydmFsKHNlbGYuZ29OZXh0LCAzMDAwKTtcbiAgICB9O1xuXG4gICAgc2VsZi5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgdmFyIGluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcblxuICAgICAgICBpZiAoaW5kZXggPj0gY291bnQpIHtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuXG4gICAgICAgIGlmIChjdXJyZW50U2xpZGUpIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKGN1cnJlbnRTbGlkZSwge2FjdGl2ZTogZmFsc2V9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IHNsaWRlc1tjdXJyZW50SW5kZXhdO1xuICAgICAgICBhbmd1bGFyLmV4dGVuZChjdXJyZW50U2xpZGUsIHthY3RpdmU6IHRydWV9KTtcbiAgICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG52YXIgQ2Fyb3VzZWxDdHJsID0gcmVxdWlyZSgnLi9jYXJvdXNlbC5jb250cm9sbGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGludGVydmFsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgY29udHJvbGxlcjogQ2Fyb3VzZWxDdHJsLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9jYXJvdXNlbC9jYXJvdXNlbC5odG1sJ1xuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnZhciBjYXJvdXNlbCA9IHJlcXVpcmUoJy4vY2Fyb3VzZWwuZGlyZWN0aXZlJyk7XG5cbnJlcXVpcmUoJy4uL3NsaWRlcycpO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNhcm91c2VsJywgWydhcHAuY2Fyb3VzZWwuc2xpZGVzJ10pXG4gICAgLmRpcmVjdGl2ZSgnY2Fyb3VzZWwnLCBjYXJvdXNlbCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgcmVxdWlyZTogJ15jYXJvdXNlbCcsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBzcmM6ICc9PycsXG4gICAgICAgICAgICBhY3RpdmU6ICc9PydcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvc2xpZGVzL2ltYWdlLXNsaWRlLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNhcm91c2VsQ3RybCkge1xuICAgICAgICAgICAgdmFyICRlbGVtID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgdmFyIGFjdGl2ZUNsYXNzTmFtZSA9ICdhY3RpdmUnO1xuXG4gICAgICAgICAgICBzY29wZS4kd2F0Y2goJ2FjdGl2ZScsIGZ1bmN0aW9uKGFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW0uYWRkQ2xhc3MoYWN0aXZlQ2xhc3NOYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChjYXJvdXNlbEN0cmwuZ29OZXh0LCAzMDAwKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbS5yZW1vdmVDbGFzcyhhY3RpdmVDbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xudmFyIGltYWdlU2xpZGUgPSByZXF1aXJlKCcuL2ltYWdlLXNsaWRlLmRpcmVjdGl2ZScpO1xudmFyIHZpZGVvU2xpZGUgPSByZXF1aXJlKCcuL3ZpZGVvLXNsaWRlLmRpcmVjdGl2ZScpO1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5jYXJvdXNlbC5zbGlkZXMnLCBbXSlcbiAgLmRpcmVjdGl2ZSgnaW1hZ2VTbGlkZScsIGltYWdlU2xpZGUpXG4gIC5kaXJlY3RpdmUoJ3ZpZGVvU2xpZGUnLCB2aWRlb1NsaWRlKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHRpbWVvdXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICByZXF1aXJlOiAnXmNhcm91c2VsJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHNyYzogJz0/JyxcbiAgICAgICAgICAgIGFjdGl2ZTogJz0/J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9zbGlkZXMvdmlkZW8tc2xpZGUuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY2Fyb3VzZWxDdHJsKSB7XG4gICAgICAgICAgICB2YXIgJGVsZW0gPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB2YXIgYWN0aXZlQ2xhc3NOYW1lID0gJ2FjdGl2ZSc7XG5cbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnYWN0aXZlJywgZnVuY3Rpb24oYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbS5hZGRDbGFzcyhhY3RpdmVDbGFzc05hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGNhcm91c2VsQ3RybC5nb05leHQsIDMwMDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtLnJlbW92ZUNsYXNzKGFjdGl2ZUNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiJdfQ==
