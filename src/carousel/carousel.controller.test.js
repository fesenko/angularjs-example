'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);


describe('Carousel Controller', function() {
    it('as a constructor', function() {
        expect(true)
            .to.be.true
    });
});