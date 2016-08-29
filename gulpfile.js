var gulp = require('gulp');
var concat = require('gulp-concat');
var scss = require('gulp-sass');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var path = './assets';
var source = {
	css : {
		path : path + '/css/',
		layout : [ path + '/css/layout.scss' ]
	},
	js : {
		path : path + '/js/',
		app : [
			path + '/js/Article.class.js',
			path + '/js/Index.class.js',
			path + '/js/View.class.js',
			path + '/js/layout.js'
		]
	}
};

// make vendor
gulp.task('vendor', function(){
	gulp.src([
		'vendor/jquery/jquery-2.2.4.min.js',
		'vendor/masonry/dist/masonry.pkgd.min.js',
		'vendor/imagesloaded/imagesloaded.pkgd.min.js'
	])
		.pipe(concat('vendor.min.js', { newLine: '\n\n' }))
		.pipe(gulp.dest(path + '/js'));
});

// convert scss
gulp.task('scss', function(){
	gulp.src(source.css.layout)
		.pipe(sourcemaps.init())
		.pipe(scss({
			//outputStyle: 'compact'
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(concat('style.pkgd.css', { newLine: '\n\n' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(source.css.path));
});
// set watcher scss
gulp.task('scss:watch', function(){
	gulp.watch(source.css.layout, ['scss']);
});


// convert javascript
gulp.task('javascript', function(){
	gulp.src(source.js.app)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('app.pkgd.js', { newLine: '\n\n' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(source.js.path))
	;
});

// watch react and javascript
gulp.task('javascript:watch', function(){
	gulp.watch(source.js.app, ['javascript']);
});


// default
gulp.task('default', function(){
	console.log('say hello');
});
