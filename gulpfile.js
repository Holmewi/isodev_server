var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    browserify = require('gulp-browserify');

var DevGulp = (function () {
	var srcAsset = function  (path) {
		return './assets' + path;
	};
	var distAssets = function (path) {
		return './www/assets' + path;
	}
	return {
		srcAsset: srcAsset,
		distAssets: distAssets
	}
})();

/**
 *	Development tasks
 */
gulp.task('sass', function () {
  return gulp.src(DevGulp.srcAsset('/scss/style.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DevGulp.distAssets('/css')));
});

gulp.task('js', function () {
    return gulp.src(DevGulp.srcAsset('/js/**/*.js'))
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest(DevGulp.distAssets('/js')));
});

/**
 *	Production tasks
 */
 gulp.task('sass-prod', function () {
  return gulp.src(DevGulp.srcAsset('/scss/style.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(DevGulp.distAssets('/css')));
});

gulp.task('js-prod', function () {
    return gulp.src(DevGulp.srcAsset('/js/**/*.js'))
    	.pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest(DevGulp.distAssets('/js')));
});

/**
 *	Tasks
 */
gulp.task('default', ['sass', 'js']);
gulp.task('prod', ['sass-prod', 'js-prod']);

/**
 *	Watcher for development
 */
gulp.task('watch', ['default'], function () {
    var watch = {
        scss: [
            DevGulp.srcAsset('/scss/**/*.scss')
        ],
        js: [
            DevGulp.srcAsset('/js/**/*.js')
        ]
    };

    gulp.watch(watch.scss,['sass']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    gulp.watch(watch.js, ['js']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});