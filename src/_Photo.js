var PIXI = require('pixi.js');
var assert = require('assert-plus');
var stage = require('./stage');
var events = require('events');
var util = require('util');

function Photo(url) {
	assert.string(url, 'url');
	this.url = url;
}

util.inherits(Photo, events.EventEmitter);

Photo.prototype.load = function() {
	var sprite = PIXI.Sprite.fromImage(this.url);
	var baseTexture = sprite.texture.baseTexture;

	this.sprite = sprite;

	if (baseTexture.hasLoaded) {
		stage.addChildAt(sprite, 0);
		stage.render();
		this.emit('loaded');
	} else {
		baseTexture.once('loaded', function() {
			stage.addChildAt(sprite, 0);
			stage.render();
			this.emit('loaded');
		}.bind(this));
	}
};

Photo.prototype.play = function() {
	setTimeout(function() {
		this.emit('ended');
	}.bind(this), 1500);
};

Photo.prototype.destroy = function() {
	this.sprite.destroy(true, true);
	this.sprite = null
	// this.removeAllListeners();
};

Photo.prototype.hide = function() {
	var self = this;
	var sprite = self.sprite;

	function fadeOut() {
		if (Math.max(sprite.alpha, 0) == 0) {
			stage.removeChildAt(1);
			self.emit('hidden');
			self.destroy();
			return
		}

		sprite.alpha -= 0.05;
		stage.render();
		requestAnimationFrame(fadeOut);
	}

	fadeOut();
};

module.exports = Photo;