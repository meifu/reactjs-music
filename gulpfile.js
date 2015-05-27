var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');

gulp.task('browserify', function() {
	var bundler = browserify({
		entries: ['./public/scripts/app.js'],
		transform: [reactify],
		debug: true
	});

	browserify(bundler).bundle().pipe(source('app.js')).pipe(gulp.dest('./build/scripts/'));
});