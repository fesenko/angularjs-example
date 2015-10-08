'use strict';

var angular = require('angular');

module.exports = function($scope) {
    $scope.slides = [
        {
            type: 'photo',
            url: 'img/hk.jpg',
            transition: 'fadeOut',
            transitionDuration: 1
        },
        {
            type: 'photo',
            url: 'img/london.jpeg',
            transition: 'fadeOut',
            transitionDuration: 1
        },
        {
            type: 'video',
            url: 'img/beach.mp4',
            transition: 'jumpCut'
        },
        {
            type: 'photo',
            url: 'img/moscow.jpg',
            transition: 'jumpCut'
        }
    ];
};

