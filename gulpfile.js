var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var webserver = require('gulp-webserver');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var sass = require('gulp-sass');

var htmlFilesMask = './src/**/*.html';
var vendors = [
	'angular',
	'angular-ui-router'
];

var browserifyOpts = {
	entries: ['./src/app.js'],
	debug: true
}

var b =
	browserify(browserifyOpts)
	.external(vendors)
b = watchify(b)

function compileCode() {
	b.bundle()
	.on('error', gutil.log.bind(gutil, 'Browserify Error'))
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(gulp.dest('./build'))
}

b.on('update', compileCode)
b.on('log', gutil.log)

gulp.task('vendors', ['cleanBuildDir'], function() {
	browserify({})
	.require(vendors)
	.bundle()
	.pipe(source('vendors.js'))
	.pipe(gulp.dest('./build'))
});

gulp.task('compileCode', ['cleanBuildDir'], compileCode);

gulp.task('html', ['cleanBuildDir'], function(){
	gulp
	.src(htmlFilesMask)
	.pipe(gulp.dest('./build'))
});

gulp.task('cleanBuildDir', function(cb) {
	del(['./build/**/*.*'], cb);
});

gulp.task('sass', function () {
  gulp.src('./src/styles.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});

gulp.task('build', ['compileCode', 'html', 'vendors', 'sass']);

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
