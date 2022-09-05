/**
 * Gulp SCSS compiler for project
 *
 */

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    zip = require('gulp-zip'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass')(require('sass')),
    tap = require('gulp-tap'),
    gulpif = require('gulp-if'),
    del = require('del');

/*  PostCSS */
var postcss = require('gulp-postcss'),
	mqpacker = require('css-mqpacker'), //Преобразования в css
	csswring = require('csswring'), //Минифер
	perfectionist = require('perfectionist'), //Бьютифер
	postcss_autoprefixer = require('autoprefixer'), //PostCss автопрефиксер
	remcom = require("postcss-discard-comments"); //Удаляем комментарии

const path = require('path');
const sortCSSmq = require('sort-css-media-queries'); //Сортировка для mqpacker
var open = require('gulp-open');

/* Config File */
var conf = require('./gulp_conf.json');

if( !conf.scss_src ) {
	console.log('Error! File gulp_conf.json is not configured! Not found scss_src.')
	return;
}else {

	//"scss_watch" : ["../src/scss/**/*.scss"],
	//"scss_src" : ["../src/scss/*.scss", "!../src/scss/_*", "!../src/scss/_**/_**/*", "!../src/scss/bootstrap.scss", "!../src/scss/_**/*"],

	var csrc = conf.scss_src;
	if( !Array.isArray(csrc) ){
		csrc = [csrc];
	}
	var csrc_name = path.basename(csrc[0]);
	var csrc_dir = path.dirname(csrc[0]);
	//exclude
	csrc.push('!' + csrc_dir + '/_*');
	csrc.push('!' + csrc_dir + '/_**/*');
	csrc.push('!' + csrc_dir + '/.*');
	csrc.push('!' + csrc_dir + '/.**/*');
	csrc.push('!' + csrc_dir + '/bootstrap.scss');

	conf.scss_src = csrc;
	//Set watch default pattern puth
    if( !conf.scss_watch ){
    	conf.scss_watch = [csrc_dir + '/**/*.scss'];
	}

    //Set bootstrap default watch pattern puth
    if( !conf.bootstrap_watch ){
    	conf.bootstrap_watch = [csrc_dir + '/bootstrap.scss', csrc_dir + '/_variables.scss'];
	}
    //Set bootstrap default compile pattern puth
    if( !conf.bootstrap_src ){
    	conf.bootstrap_src = [csrc_dir + '/bootstrap.scss'];
	}

	var fs = require('fs');

	function is_dir(path) {
		try {
			var stat = fs.lstatSync(path);
			return stat.isDirectory();
		} catch (e) {
			return false;
		}
	}

	var destination = [];

	function get_dest(filename) {
		if (is_dir(filename)) return;

		var allstring = fs.readFileSync(filename, "utf8").split("\n");

		if (allstring.length > 0) {
			allstring.forEach(function (strng, i) {

				if (strng.indexOf('//dest:') >= 0) {
					destination[filename] = '' + strng.replace('//dest:', '').trim();
					return true;
				}
			});
		}
		return false;
	}

	var condition_min = function (file) {
		if (file.path.indexOf('.min.') >= 0) {
			return true;
		}
		return false;
	}
	var condition_min_map = function (file) {
		if (file.path.indexOf('.min.') >= 0) {
			return false;
		}
		return true;
	}
	var processors = [
		perfectionist({format: 'expanded', maxSelectorLength: 10}),
		mqpacker({
			sort: sortCSSmq
		}),
		postcss_autoprefixer({
			//overrideBrowserslist: ['last 2 versions'],
			cascade : false
		}),
	];

	var processors_min = [
		mqpacker({
			sort: sortCSSmq
		}),
		postcss_autoprefixer({
			//overrideBrowserslist: ['last 2 versions'],
			cascade : false
		}),
		csswring({preserveHacks: true, removeAllComments: true})
	];

	 function console_compile(dest, file){
        dest = dest.replace(/\/+$/, '') + '/';
        if (file.history[1]) {
            console.log('Compile: ' + dest + path.basename(file.history[1]));
        } else {
            console.log('Compile: ' + dest + path.basename(file.history[0]));
        }
    }

	/****************** MAIN CSS COMPILE TASKS**************************/
	/**
	 * Для сохранения файла по кастомному пути первой строкой в файле вписываем путь сохранения с именем файла
	 * Если указать в имени вайла .min то будет сохранена минифицированная версия
	 * //dest:../wp-content/themes/themename/style.css
	 * Путь указывать от данного файла gulp_sass.js
	 */

//Cli: gulp scss_watch --gulpfile "полный путь к файлу на диске/gulpfile_sass.js"
	gulp.task('scss_watch', function (cb) {
		return gulp.watch(conf.scss_watch, gulp.series('scss_compile')); //For gulp 4
	});

//Cli: gulp scss_compile --gulpfile "полный путь к файлу на диске/gulpfile_sass.js"
	gulp.task('scss_compile', function () {

		var onError = function (err) {
			notify.onError({
				time    : 10000,
				title   : "Gulp Sass Auto",
				subtitle: "Error!",
				message : "Error: <%= error.message %>"
			})(err);
			this.emit('end');
		};

		var puth_dest_infile = '';
		var rename_name = '';

		return gulp.src(conf.scss_src)
			.pipe(plumber({errorHandler: onError, time: 10000}))
			.pipe(tap(function (file, t) {

				get_dest(file.history[0]);

				if (destination[file.history[0]]) {

					puth_dest_infile = destination[file.history[0]];

					var namedest = path.basename(destination[file.history[0]]);

					if (namedest.indexOf('.') >= 0) {
						rename_name = namedest.split('.')[0];
						if (namedest.indexOf('.min.') >= 0) {
							rename_name = rename_name + '.min';
						}
					} else {
						rename_name = '';
					}
				}

			}))

			.pipe(rename(function (path) {
				if (rename_name && puth_dest_infile.indexOf('css.map') < 0) {
					path.basename = rename_name;
					path.extname = ".css";
				}
			}))

			.pipe(gulpif(condition_min_map, sourcemaps.init()))

			.pipe(sass())

			.pipe(gulpif(condition_min, postcss(processors_min), postcss(processors)))

			.pipe(gulpif(condition_min_map, sourcemaps.write('./')))

			.pipe(gulp.dest(function (file) {

				var dest = path.dirname(destination[file.history[0]]);
				if (dest === '..') {
					dest = '../';
				}

				if (!file.history[2]) {
					console_compile(dest, file);
				}

				return dest;
			}))

			.pipe(notify({
				time    : 10000,
				title   : 'Gulp Sass Auto',
				subtitle: 'success',
				message : 'Sass Auto Compyle',
				onLast  : true
			}));
	});

//Cli: gulp scss_min --gulpfile "полный путь к файлу на диске/gulpfile_sass.js"
	gulp.task('scss_min', function () {
		var onError = function (err) {
			notify.onError({
				time    : 10000,
				title   : "Gulp Sass Min",
				subtitle: "Error!",
				message : "Error: <%= error.message %>"
			})(err);
			this.emit('end');
		};

		var puth_dest_infile = '';
		var rename_name = '';

		return gulp.src(conf.scss_src)
			.pipe(plumber({errorHandler: onError, time: 10000}))
			.pipe(tap(function (file, t) {

				get_dest(file.history[0]);

				if (destination[file.history[0]]) {

					puth_dest_infile = destination[file.history[0]];

					var namedest = path.basename(destination[file.history[0]]);

					if (namedest.indexOf('.') >= 0) {
						rename_name = namedest.split('.')[0];
						rename_name = rename_name + '.min';
					} else {
						rename_name = '';
					}
				}

			}))

			.pipe(rename(function (path) {
				if (rename_name && puth_dest_infile.indexOf('css.map') < 0) {
					path.basename = rename_name;
					path.extname = ".css";
				}
			}))

			.pipe(sass())

			.pipe(postcss(processors_min))

			.pipe(gulp.dest(function (file) {

				var dest = path.dirname(destination[file.history[0]]);
				if (dest === '..') {
					dest = '../';
				}

				if (!file.history[2]) {
					console_compile(dest, file);
				}

				return dest;
			}))

			.pipe(notify({
				time    : 10000,
				title   : 'Gulp Sass Min',
				subtitle: 'success',
				message : 'Sass Min Compyle',
				onLast  : true
			}));
	});

//Cli: gulp scss_unmin --gulpfile "полный путь к файлу на диске/gulpfile_sass.js"
	gulp.task('scss_unmin', function () {
		var onError = function (err) {
			notify.onError({
				time    : 10000,
				title   : "Gulp Sass Unmin",
				subtitle: "Error!",
				message : "Error: <%= error.message %>"
			})(err);
			this.emit('end');
		};

		var puth_dest_infile = '';
		var rename_name = '';

		return gulp.src(conf.scss_src)
			.pipe(plumber({errorHandler: onError, time: 10000}))
			.pipe(tap(function (file, t) {

				get_dest(file.history[0]);

				if (destination[file.history[0]]) {

					puth_dest_infile = destination[file.history[0]];

					var namedest = path.basename(destination[file.history[0]]);

					if (namedest.indexOf('.') >= 0) {
						rename_name = namedest.split('.')[0];
						rename_name = rename_name + '.min';
					} else {
						rename_name = '';
					}
				}

			}))

			.pipe(rename(function (path) {
				if (rename_name && puth_dest_infile.indexOf('css.map') < 0) {
					path.basename = rename_name;
					path.extname = ".css";
				}
			}))
			.pipe(sourcemaps.init())

			.pipe(sass())

			.pipe(postcss(processors))

			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(function (file) {

				var dest = path.dirname(destination[file.history[0]]);
				if (dest === '..') {
					dest = '../';
				}

				if (!file.history[2]) {
					console_compile(dest, file);
				}

				return dest;
			}))

			.pipe(notify({
				time    : 10000,
				title   : 'Gulp Sass Unmin',
				subtitle: 'success',
				message : 'Sass Unmin Compyle',
				onLast  : true
			}));
	});

	/****************** BOOTSTRAP CSS COMPILE **************************/
//Cli: gulp bootstrap_watch --gulpfile "полный путь к файлу на диске/gulpfile_sass.js"
	gulp.task('bootstrap_watch', function (cb) {
		return gulp.watch(conf.bootstrap_watch, gulp.series('bootstrap_min'));
	});

//Cli: gulp bootstrap_min --gulpfile "полный путь к файлу на диске/gulpfile_sass.js"
	gulp.task('bootstrap_min', function () {
		var onError = function (err) {
			notify.onError({
				time    : 10000,
				title   : "Gulp Bootstrap",
				subtitle: "Error!",
				message : "Error: <%= error.message %>"
			})(err);
			this.emit('end');
		};
		
		var puth_dest_infile = '';
		var rename_name = '';

		return gulp.src(conf.bootstrap_src)
			.pipe(plumber({errorHandler: onError, time: 10000}))
			.pipe(tap(function (file, t) {

				get_dest(file.history[0]);

				if (destination[file.history[0]]) {

					puth_dest_infile = destination[file.history[0]];

					var namedest = path.basename(destination[file.history[0]]);

					if (namedest.indexOf('.') >= 0) {
						rename_name = namedest.split('.')[0];
						if (namedest.indexOf('.min.') >= 0) {
							rename_name = rename_name + '.min';
						}
					} else {
						rename_name = '';
					}
				}

			}))

			.pipe(rename(function (path) {
				if (rename_name && puth_dest_infile.indexOf('css.map') < 0) {
					path.basename = rename_name;
					path.extname = ".css";
				}
			}))

			.pipe(gulpif(condition_min_map, sourcemaps.init()))

			.pipe(sass())

			.pipe(gulpif(condition_min, postcss(processors_min), postcss(processors)))

			.pipe(gulpif(condition_min_map, sourcemaps.write('./')))

			.pipe(gulp.dest(function (file) {

				var dest = path.dirname(destination[file.history[0]]);
				if (dest === '..') {
					dest = '../';
				}

				if (!file.history[2]) {
					console_compile(dest, file);
				}

				return dest;
			}))

			.pipe(notify({
				time    : 10000,
				title   : 'Gulp Bootstrap',
				subtitle: 'success',
				message : 'Bootstrap Compyle',
				onLast  : true
			}));

	});

}



