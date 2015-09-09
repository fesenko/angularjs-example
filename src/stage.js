var PIXI = require('pixi.js');
var renderer = new PIXI.WebGLRenderer(1440, 1080);
var stage = new PIXI.Container();

document.body.appendChild(renderer.view);

exports.render = function() {
	renderer.render(stage);
}

exports.removeChildAt = function(index) {
	stage.removeChildAt(index);
}

exports.addChildAt = function(el, index) {
	stage.addChildAt(el, index);
}

exports.removeChild = function(el) {
	stage.removeChild(el);
}

