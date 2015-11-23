'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

var angular = require('angular');

require('angular-mocks');
require('./index');

var mockModule = angular.mock.module;

describe('Directive Carousel', function() {
    var $rootScope,
        $compile,
        $element;

    beforeEach(mockModule('carousel/carousel.html'));
    beforeEach(mockModule('carousel/screensaver.html'));
    beforeEach(mockModule('slides/image-slide.html'));
    beforeEach(mockModule('slides/video-slide.html'));
    beforeEach(mockModule('app.carousel'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    describe('rendering', function() {
        beforeEach(function() {
            $rootScope.slides = [{
                type: 'photo',
                url: '<photoUrl>',
            },
            {
                type: 'video',
                url: '<videoUrl>',
            }];

            $element = $compile('<carousel slides="slides"></carousel>')($rootScope);
            $rootScope.$digest();
        });

        it('renders the screensaver element', function() {
             var $screensaver = $element.find('screensaver');

             expect($screensaver.length)
                .to.be.equal(1);
        });

        it('renders the slides elements', function() {
            var $imageSlides = $element.find('image-slide');
            var $videoSlides = $element.find('video-slide');

             expect($imageSlides.length)
                .to.be.equal(1);

             expect($videoSlides.length)
                .to.be.equal(1);
        });
    });

    describe('play', function() {
        var isolateScope,
            slides = [{
                type: 'photo',
                url: '<photoUrl>',
            }, {
                type: 'video',
                url: '<videoUrl>',
            }];

        beforeEach(function() {
            $rootScope.slides = slides;
            $element = $compile('<carousel slides="slides"></carousel>')($rootScope);
            $rootScope.$digest();
            isolateScope = $element.isolateScope();
            isolateScope.play();
        });

        it('finds the current slide to play', function() {
            expect(slides[0])
                .to.have.property('active', true);

            expect(isolateScope.currentSlide)
                .to.be.equal(slides[0]);
        });

        it('finds the next slide to preload', function() {
            expect(slides[1])
                .to.have.property('preload', true);

            expect(isolateScope.nextSlide)
                .to.be.equal(slides[1]);
        });

        it('sets true to isPlaying property', function() {
            expect(isolateScope.isPlaying)
                .to.be.equal(true);
        });
    });

    describe('stop', function() {
        var isolateScope,
            slides = [{
                type: 'photo',
                url: '<photoUrl>',
                preload: true
            }, {
                type: 'video',
                url: '<videoUrl>',
                active: true
            }];

        beforeEach(function() {
            $rootScope.slides = slides;
            $element = $compile('<carousel slides="slides"></carousel>')($rootScope);
            $rootScope.$digest();
            isolateScope = $element.isolateScope();
            isolateScope.currentSlide = slides[1];
            isolateScope.nextSlide = slides[0];
            isolateScope.stop();
        });

        it('resets the current slide', function() {
            expect(slides[1])
                .to.not.have.property('active');

            expect(isolateScope.currentSlide)
                .to.be.null;
        });

        it('resets the next slide', function() {
            expect(slides[0])
                .to.not.have.property('preload');

            expect(isolateScope.nextSlide)
                .to.be.null;
        });

        it('sets false to isPlaying property', function() {
            expect(isolateScope.isPlaying)
                .to.be.equal(false);
        });
    });

    describe('getNextIndex', function() {
        var isolateScope,
            slides = [{
                type: 'photo',
                url: '<photoUrl>'
            }, {
                type: 'video',
                url: '<videoUrl>'
            }];

        beforeEach(function() {
            $rootScope.slides = slides;
            $element = $compile('<carousel slides="slides"></carousel>')($rootScope);
            $rootScope.$digest();
            isolateScope = $element.isolateScope();
        });

        it('calculates and returns the index of the next slide', function() {
            isolateScope.currentIndex = 0;

            expect(isolateScope.getNextIndex())
                .to.be.equal(1);

            isolateScope.currentIndex = 1;

            expect(isolateScope.getNextIndex())
                .to.be.equal(0);
        });
    });

    describe('getNext', function() {
        var isolateScope,
            slides = [{
                type: 'photo',
                url: '<photoUrl>'
            }, {
                type: 'video',
                url: '<videoUrl>'
            }];

        beforeEach(function() {
            $rootScope.slides = slides;
            $element = $compile('<carousel slides="slides"></carousel>')($rootScope);
            $rootScope.$digest();
            isolateScope = $element.isolateScope();

            isolateScope.isPlaying = true;
            slides[1].active = true;
            isolateScope.currentSlide = slides[1];
            isolateScope.nextIndex = 0;
            isolateScope.nextSlide = slides[0];
            isolateScope.goNext();
        });

        it('makes the preloaded slide current', function() {
            expect(slides[1])
                .to.not.have.property('active');

            expect(isolateScope.currentSlide)
                .to.be.equal(slides[0]);
        });

        it('finds the next slide to preload', function() {
            expect(slides[0])
                .to.have.property('active', true);

            expect(slides[1])
                .to.have.property('preload', true);
        });
    });
});
