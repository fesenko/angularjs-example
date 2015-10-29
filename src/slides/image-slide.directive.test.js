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

describe('Directive <image-slide>', function() {
    var $rootScope,
        $compile,
        $timeout,
        $element,
        $animate,
        $q,
        callback,
        duration,
        imgSrc;

    beforeEach(mockModule('slides/image-slide.html'));
    beforeEach(mockModule('app.carousel.slides'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_, _$animate_, _$q_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
        $animate = _$animate_;
        $q = _$q_;
    }));

    describe('when a slide is active', function() {
        beforeEach(function() {
            imgSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            duration = 1000;
            callback = sinon.spy();
            sinon.stub($animate, 'animate', function() {
                return $q(function(resolve) {
                    resolve();
                });
            });

            angular.extend($rootScope, {
                active: true,
                src: imgSrc,
                duration: duration,
                callback: callback
            });

            $element = $compile(
              '<image-slide active=\'active\' src=\'src\' duration=\'duration\' ' +
              'ended=\'callback()\'></image-slide>'
              )($rootScope);

            $rootScope.$digest();
            $timeout.flush(duration);
        });

        afterEach(function() {
            $animate.animate.restore();
        });

        it('renders the appropriate content', function() {
            var $img = $element.find('img');

            expect($img.attr('src')).to.be.equal(imgSrc);
        });

        it('executes animation when the delay passes', function() {
            expect($animate.animate).to.be.called;
        });

        it('calls the callback when the animation is executed', function() {
            expect(callback).to.be.called;
        });
    });

    describe('when a slide is not active', function() {
        beforeEach(function() {
            $element = $compile('<image-slide></image-slide>')($rootScope);
            $rootScope.$digest();
        });

        it('renders nothing', function() {
            var $img = $element.find('img');

            expect($img.length).to.be.equal(0);
        });
    });

});