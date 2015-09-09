(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"assert-plus":"assert-plus","javascript-state-machine":"javascript-state-machine"}],2:[function(require,module,exports){
var PIXI = require('pixi.js');
var assert = require('assert-plus');

function Photo(url) {
	assert.string(url, 'url');

	this.url = url;
}

Photo.prototype.load = function() {
	var self = this;

	return new Promise(function(resolve) {
		var sprite = PIXI.Sprite.fromImage(self.url);
		var baseTexture = sprite.texture.baseTexture;

		self.sprite = sprite;

		if (baseTexture.hasLoaded) {
			resolve();
		} else {
			baseTexture.once('loaded', function() {
				resolve();
			});
		}

	});
};

Photo.prototype.play = function() {
	return new Promise(function(resolve) {
		setTimeout(resolve, 1500);
	});
};

Photo.prototype.destroy = function() {

};

Photo.prototype.hide = function() {
	var self = this;

	return new Promise(function(resolve) {
		setTimeout(resolve, 500);
	});
};

module.exports = Photo;
},{"assert-plus":"assert-plus","pixi.js":"pixi.js"}],3:[function(require,module,exports){
var Photo = require('./Photo');
// var Video = require('./Video');
var Carousel = require('./Carousel');
var Q = require('q');
var def = Q.defer(function(resolve, reject) {
	console.log(111,arguments);
});

var photo1 = new Photo('./media/hk.jpg');
var photo2 = new Photo('./media/spb.jpg');
var photo3 = new Photo('./media/london.jpeg');
var photo4 = new Photo('./media/singapore.jpg');
// var video1 = new Video('./media/beach.mp4');

var carousel = new Carousel([photo1, photo2, photo3, photo4]);

// var btn = document.getElementById('start');

// btn.addEventListener('click', function() {
// 	slideshow.play();
// }, false);

// setTimeout(function() {
// 	carousel.start();
// }, 2000);


},{"./Carousel":1,"./Photo":2,"q":"q"}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ2Fyb3VzZWwuanMiLCJzcmMvUGhvdG8uanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQtcGx1cycpO1xudmFyIFN0YXRlTWFjaGluZSA9IHJlcXVpcmUoJ2phdmFzY3JpcHQtc3RhdGUtbWFjaGluZScpO1xuXG5mdW5jdGlvbiBDYXJvdXNlbChzbGlkZXMpIHtcblx0YXNzZXJ0LmFycmF5T2ZPYmplY3Qoc2xpZGVzLCAnc2xpZGVzJyk7XG5cblx0dGhpcy5zbGlkZXMgPSBzbGlkZXM7XG5cdHRoaXMucHJlbG9hZGVkU2xpZGUgPSBudWxsO1xuXHR0aGlzLnByZWxvYWRlZFNsaWRlSW5kZXggPSAtMTtcblxuXHR0aGlzLnBsYXllZCA9IHRoaXMucGxheWVkLmJpbmQodGhpcyk7XG5cdHRoaXMuc3RhcnRlZCA9IHRoaXMuc3RhcnRlZC5iaW5kKHRoaXMpO1xuXHR0aGlzLnBsYXkgPSB0aGlzLnBsYXkuYmluZCh0aGlzKTtcbn07XG5cbkNhcm91c2VsLnByb3RvdHlwZS5wcmVsb2FkTmV4dFNsaWRlID0gZnVuY3Rpb24oKSB7XG5cdHZhciBjb3VudCA9IHRoaXMuc2xpZGVzLmxlbmd0aDtcblx0dmFyIGluZGV4ID0gdGhpcy5wcmVsb2FkZWRTbGlkZUluZGV4ICsgMTtcblxuXHRpZiAoaW5kZXggPj0gY291bnQpIHtcblx0XHRpbmRleCA9IDBcblx0fVxuXG5cdHZhciBzbGlkZSA9IHRoaXMuc2xpZGVzW2luZGV4XTtcblxuXHR0aGlzLnByZWxvYWRlZFNsaWRlID0gc2xpZGU7XG5cdHRoaXMucHJlbG9hZGVkU2xpZGVJbmRleCA9IGluZGV4O1xuXG5cdHJldHVybiBzbGlkZS5sb2FkKCk7XG59O1xuXG5DYXJvdXNlbC5wcm90b3R5cGUub25zdGFydGluZyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnByZWxvYWROZXh0U2xpZGUoKS50aGVuKHRoaXMuc3RhcnRlZCk7XG59O1xuXG5DYXJvdXNlbC5wcm90b3R5cGUub25yZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnBsYXkoKTtcbn07XG5cbkNhcm91c2VsLnByb3RvdHlwZS5vbnBsYXlpbmcgPSBmdW5jdGlvbigpIHtcblx0UHJvbWlzZS5hbGwoW1xuXHRcdHRoaXMucHJlbG9hZGVkU2xpZGUucGxheSgpLFxuXHRcdHRoaXMucHJlbG9hZE5leHRTbGlkZSgpXG5cdF0pLnRoZW4odGhpcy5wbGF5ZWQpO1xufTtcblxuQ2Fyb3VzZWwucHJvdG90eXBlLm9uZGVjaXNpb24gPSBmdW5jdGlvbigpIHtcblx0dGhpcy5wbGF5KCk7XG59O1xuXG5DYXJvdXNlbC5wcm90b3R5cGUub25ub25lID0gZnVuY3Rpb24oKSB7XG5cbn07XG5cblxuU3RhdGVNYWNoaW5lLmNyZWF0ZSh7XG5cdHRhcmdldDogQ2Fyb3VzZWwucHJvdG90eXBlLFxuXHRldmVudHM6IFtcblx0XHR7IG5hbWU6ICdzdGFydCcsIGZyb206ICdub25lJywgdG86ICdzdGFydGluZycgfSxcblx0XHR7IG5hbWU6ICdzdGFydGVkJywgZnJvbTogJ3N0YXJ0aW5nJywgdG86ICdyZWFkeScgfSxcblx0XHR7IG5hbWU6ICdwbGF5JywgZnJvbTogWydyZWFkeScsICdkZWNpc2lvbiddLCB0bzogJ3BsYXlpbmcnIH0sXG5cdFx0eyBuYW1lOiAncGxheWVkJywgZnJvbTogJ3BsYXlpbmcnLCB0bzogJ2RlY2lzaW9uJyB9LFxuXHRcdHsgbmFtZTogJ3N0b3AnLCBmcm9tOiAnZGVjaXNpb24nLCB0bzogJ3JlYWR5JyB9LFxuXHRcdHsgbmFtZTogJ3NodXRkb3duJywgZnJvbTogJ3JlYWR5JywgdG86ICdub25lJyB9XG5cdF1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhcm91c2VsO1xuIiwidmFyIFBJWEkgPSByZXF1aXJlKCdwaXhpLmpzJyk7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0LXBsdXMnKTtcblxuZnVuY3Rpb24gUGhvdG8odXJsKSB7XG5cdGFzc2VydC5zdHJpbmcodXJsLCAndXJsJyk7XG5cblx0dGhpcy51cmwgPSB1cmw7XG59XG5cblBob3RvLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24oKSB7XG5cdHZhciBzZWxmID0gdGhpcztcblxuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuXHRcdHZhciBzcHJpdGUgPSBQSVhJLlNwcml0ZS5mcm9tSW1hZ2Uoc2VsZi51cmwpO1xuXHRcdHZhciBiYXNlVGV4dHVyZSA9IHNwcml0ZS50ZXh0dXJlLmJhc2VUZXh0dXJlO1xuXG5cdFx0c2VsZi5zcHJpdGUgPSBzcHJpdGU7XG5cblx0XHRpZiAoYmFzZVRleHR1cmUuaGFzTG9hZGVkKSB7XG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJhc2VUZXh0dXJlLm9uY2UoJ2xvYWRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7XG59O1xuXG5QaG90by5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuXHRcdHNldFRpbWVvdXQocmVzb2x2ZSwgMTUwMCk7XG5cdH0pO1xufTtcblxuUGhvdG8ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcblxufTtcblxuUGhvdG8ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG5cdFx0c2V0VGltZW91dChyZXNvbHZlLCA1MDApO1xuXHR9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGhvdG87IiwidmFyIFBob3RvID0gcmVxdWlyZSgnLi9QaG90bycpO1xuLy8gdmFyIFZpZGVvID0gcmVxdWlyZSgnLi9WaWRlbycpO1xudmFyIENhcm91c2VsID0gcmVxdWlyZSgnLi9DYXJvdXNlbCcpO1xudmFyIFEgPSByZXF1aXJlKCdxJyk7XG52YXIgZGVmID0gUS5kZWZlcihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0Y29uc29sZS5sb2coMTExLGFyZ3VtZW50cyk7XG59KTtcblxudmFyIHBob3RvMSA9IG5ldyBQaG90bygnLi9tZWRpYS9oay5qcGcnKTtcbnZhciBwaG90bzIgPSBuZXcgUGhvdG8oJy4vbWVkaWEvc3BiLmpwZycpO1xudmFyIHBob3RvMyA9IG5ldyBQaG90bygnLi9tZWRpYS9sb25kb24uanBlZycpO1xudmFyIHBob3RvNCA9IG5ldyBQaG90bygnLi9tZWRpYS9zaW5nYXBvcmUuanBnJyk7XG4vLyB2YXIgdmlkZW8xID0gbmV3IFZpZGVvKCcuL21lZGlhL2JlYWNoLm1wNCcpO1xuXG52YXIgY2Fyb3VzZWwgPSBuZXcgQ2Fyb3VzZWwoW3Bob3RvMSwgcGhvdG8yLCBwaG90bzMsIHBob3RvNF0pO1xuXG4vLyB2YXIgYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0Jyk7XG5cbi8vIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuLy8gXHRzbGlkZXNob3cucGxheSgpO1xuLy8gfSwgZmFsc2UpO1xuXG4vLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuLy8gXHRjYXJvdXNlbC5zdGFydCgpO1xuLy8gfSwgMjAwMCk7XG5cbiJdfQ==
