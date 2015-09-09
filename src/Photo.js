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