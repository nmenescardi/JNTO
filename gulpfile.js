var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    addsrc = require('gulp-add-src');
	bs = require('browser-sync').create();

/**
 * Minify and combine JS files, including jQuery and Bootstrap
 */
gulp.task('scripts', function() {
    gulp.src([
            './node_modules/jquery/dist/jquery.js',
            './node_modules/bootstrap/dist/js/bootstrap.js',
            './src/js/**/*.js'
        ])
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./dist/js'));
});

/**
 * Build SASS, combine with Bootstrap CSS and minify
 */
gulp.task('sass', function() {
    gulp.src([
            './src/sass/main.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(addsrc.prepend('./node_modules/bootstrap/dist/css/bootstrap.css'))
        .pipe(minifyCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./dist/css'))
		.pipe(bs.reload({stream: true})); // prompts a reload after compilation
});


gulp.task('images', function() {
    gulp.src([
            './src/images/**/*'
        ])
        .pipe(gulp.dest('./dist/images'));
});


gulp.task('browser-sync', function() {
    bs.init({
        server: {
            baseDir: "./",
			index: "index.html"
        }
    });

	gulp.watch("./sass/*.scss", ['sass']);
	gulp.watch("./*.html").on('change', bs.reload);
});
/**
 * The default gulp task
 
gulp.task('default', function() {
    gulp.run('scripts', 'sass', 'images', 'browser-sync');
});*/
gulp.task('default', ['scripts', 'sass', 'images', 'browser-sync'] );

/**
 * Watch asset files for changes. First runs default to prevent annoying issues.
 */
gulp.task('watch', function() {
    gulp.run('default');

    gulp.watch('./src/sass/**/*.scss', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('sass');
    });

    gulp.watch('./src/js/**/*.js', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('scripts');
    });

    gulp.watch('./src/images/**/*', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('images');
    });

	
});