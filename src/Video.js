var util = require('util');
var events = require('events');
var assert = require('assert-plus');
var PIXI = require('pixi.js');
var stage = require('./stage');

function Video(url) {
	assert.string (url, 'url');
	this.url = url;
}

util.inherits(Video, events.EventEmitter);

Video.prototype.load = function() {
	var self = this;
	var texture = PIXI.Texture.fromVideoUrl(this.url);
	var sprite = new PIXI.Sprite(texture);

	baseTexture = texture.baseTexture;
	source = baseTexture.source;
	source.muted = true;
	self.source = source;
	self.sprite = sprite;

	if (baseTexture.hasLoaded) {
		this.emit('loaded', sprite);
	} else {
		baseTexture.once('loaded', function() {
			source.pause()
			self.emit('loaded', sprite);
		});
	}
};

Video.prototype.play = function() {
	var self = this;
	var requestId = null;
	var source = self.source;

	source.onended = function() {
		cancelAnimationFrame(requestId);
		self.emit('ended');
	}

	source.muted = false;
	source.play();

	function vp_f() {
		stage.render();
		requestId = requestAnimationFrame(vp_f);
	}

	vp_f();
};

Video.prototype.destroy = function() {
	this.source.onended = null;
	this.source = null;
	this.sprite.destroy(true, true);
	this.sprite = null;
	this.removeAllListeners();
};

Video.prototype.hide = function() {
	var self = this;

	function vFadeOut() {
		if (Math.max(self.sprite.alpha, 0) == 0) {
			self.emit('hidden');
			return
		}

		self.sprite.alpha -= 0.05;
		stage.render();
		requestAnimationFrame(vFadeOut);
	}

	vFadeOut();
};

module.exports = Video;