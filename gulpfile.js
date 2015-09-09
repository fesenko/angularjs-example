var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var webserver = require('gulp-webserver');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');

var htmlFilesMask = './src/**/*.html';
var libs = [
	'pixi.js',
	'assert-plus',
	'javascript-state-machine',
	'q'
];

var browserifyOpts = {
	entries: ['./src/index.js'],
	debug: true
}

var b =
	browserify(browserifyOpts)
	.external(libs)
b = watchify(b)

function compileCode() {
	b.bundle()
	.on('error', gutil.log.bind(gutil, 'Browserify Error'))
	.pipe(source('index.js'))
	.pipe(buffer())
	.pipe(gulp.dest('./build'))
}

b.on('update', compileCode)
b.on('log', gutil.log)

gulp.task('libs', ['cleanBuildDir'], function() {
	browserify({})
	.require(libs)
	.bundle()
	.pipe(source('libs.js'))
	.pipe(gulp.dest('./build'))
});

gulp.task('compileCode', ['cleanBuildDir'], compileCode);

gulp.task('html', ['cleanBuildDir'], function(){
	gulp
	.src(htmlFilesMask)
	.pipe(gulp.dest('./build'))
});

gulp.task('media', ['cleanBuildDir'], function(){
	gulp
	.src('./media/**/*')
	.pipe(gulp.dest('./build/media'))
});

gulp.task('cleanBuildDir', function(cb) {
	del(['./build/**/*.*'], cb);
});

gulp.task('build', ['compileCode', 'html', 'libs', 'media']);

gulp.task('webserver', ['build'], function(){
	gulp
	.src('build')
	.pipe(webserver({
		livereload: true,
		open: true,
		root: './build'
	}));
});

gulp.task('default', ['build', 'webserver'], function(){
	gulp.watch(htmlFilesMask, ['html'])
});
