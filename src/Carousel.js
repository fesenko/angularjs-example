var assert = require('assert-plus');
var StateMachine = require('javascript-state-machine');

function Carousel(slides) {
	assert.arrayOfObject(slides, 'slides');

	this.slides = slides;
	this.preloadedSlide = null;
	this.preloadedSlideIndex = -1;

	this.played = this.played.bind(this);
	this.started = this.started.bind(this);
	this.play = this.play.bind(this);
};

Carousel.prototype.preloadNextSlide = function() {
	var count = this.slides.length;
	var index = this.preloadedSlideIndex + 1;

	if (index >= count) {
		index = 0
	}

	var slide = this.slides[index];

	this.preloadedSlide = slide;
	this.preloadedSlideIndex = index;

	return slide.load();
};

Carousel.prototype.onstarting = function() {
	this.preloadNextSlide().then(this.started);
};

Carousel.prototype.onready = function() {
	this.play();
};

Carousel.prototype.onplaying = function() {
	Promise.all([
		this.preloadedSlide.play(),
		this.preloadNextSlide()
	]).then(this.played);
};

Carousel.prototype.ondecision = function() {
	this.play();
};

Carousel.prototype.onnone = function() {

};


StateMachine.create({
	target: Carousel.prototype,
	events: [
		{ name: 'start', from: 'none', to: 'starting' },
		{ name: 'started', from: 'starting', to: 'ready' },
		{ name: 'play', from: ['ready', 'decision'], to: 'playing' },
		{ name: 'played', from: 'playing', to: 'decision' },
		{ name: 'stop', from: 'decision', to: 'ready' },
		{ name: 'shutdown', from: 'ready', to: 'none' }
	]
});

module.exports = Carousel;
