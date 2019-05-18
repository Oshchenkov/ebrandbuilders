var     gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		clean         = require('gulp-clean'),
		sourceMap     = require('gulp-sourcemaps');


gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: '../'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
    return gulp.src('../sass/**/*.+(scss|sass)')
    
	.pipe(sourceMap.init())
	.pipe(sass().on('error', sass.logError))
    .pipe(sourceMap.write())
    
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(rename({ 
		basename: 'style',
	}))
	
	.pipe(gulp.dest('../css'))
	.pipe(browserSync.stream())
});
gulp.task('stylesMin', function() {
	return gulp.src('../sass/**/*.+(scss|sass)')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ 
		basename: 'style',
		suffix: '.min',
	}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('../css'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		//'../inc/jquery/jquery-3.4.1.min.js',
		'../js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('../js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('../*.html')
	.pipe(browserSync.reload({ stream: true }))
});


gulp.task('watch', function() {
    gulp.watch('../sass/**/*.+(scss|sass)', gulp.parallel(['styles','stylesMin']));
    gulp.watch(['../libs/**/*.js', '../js/common.js'], gulp.parallel('scripts'));
    gulp.watch('../*.html', gulp.parallel('code'))
});
gulp.task('default', gulp.parallel('styles','stylesMin', 'scripts', 'browser-sync', 'watch',));

