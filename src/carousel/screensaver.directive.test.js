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

describe('Directive Screensaver', function() {
    var $rootScope,
        $compile;

    beforeEach(mockModule('carousel/screensaver.html'));
    beforeEach(mockModule('app.carousel'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    it('renders the appropriate content', function() {
        var $element = $compile('<screensaver></screensaver>')($rootScope);
        $rootScope.$digest();

        var $img = $element.find('img');

        expect($img.length).to.be.equal(1);

        expect($img.hasClass('logo')).to.be.true;
    });
});
