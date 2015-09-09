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

