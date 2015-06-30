var gulp = require('gulp'),
	source = require('vinyl-source-stream'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	reactify = require('reactify'),
	sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename');

gulp.task('browserify', function() {

	var b = browserify();
	b.transform(reactify); // use the reactify transform
	b.add('./public/scripts/app.js');
	return b.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('./build/scripts'));

});

gulp.task('browserify2', function() {
	//var bundler = browserify({
	//	entries: './public/scripts/app.js',
	//	transform: [reactify],
	//	debug: true
	//});

	//browserify(bundler).bundle().pipe(source('app.js')).pipe(gulp.dest('./build/scripts/'));
	browserify('./public/scripts/app.js').transform(reactify).bundle().pipe(source('app.js')).pipe(gulp.dest('./build/scripts/'));
});

gulp.task('express', function() {
	var express = require('express');
	var path = require('path');
	var app = express();
	app.use('/', express.static(path.join(__dirname, 'build')));
	app.listen(4000);
});

gulp.task('styles', function() {
	// return gulp.src('scss/main.scss')
		// .pipe(sass({ style: 'expanded' }))
		// .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
		// .pipe(gulp.dest('./build/css/'));
		// .pipe(rename({suffix: '.min'}))
		// .pipe(minifycss())
		// .pipe(gulp.dest('css'));
		return sass('./scss/main.scss', {sourcemap: false})
						.on('error', function (err) {
							console.error('Error!', err.message);
						})
						.pipe(gulp.dest('./build/css'));
});

gulp.task('watch', function() {
	gulp.watch('sass/*.scss', ['styles']);
	//gulp.watch('*.html', notifyLiveReload);
	//gulp.watch('css/*.css', notifyLiveReload);
});

