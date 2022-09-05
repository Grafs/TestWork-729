/**
 * Gulp JS compiler for project
 *
 */

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    //uglify = require('gulp-uglify'),
    uglify = require('gulp-uglify-es').default,
    //jsImport = require('gulp-js-import-file'),
    tap = require('gulp-tap'),
    replace = require('gulp-replace'),
    stripcom = require('gulp-strip-comments'),
    rigger = require('gulp-rigger'),
    gulpif = require('gulp-if');
const path = require('path');
const jsObfuscator = require('gulp-javascript-obfuscator');

/* Config File */
var conf = require('./gulp_conf.json');

// "js_watch" : ["../src/js/**/*.js"],
//   "js_src" : ["../src/js/*.js", "!../src/js/_*", "!../src/js/_**/*"]
if( !conf.js_src ) {
	console.log('Error! File gulp_conf.json is not configured! Not found js_src.')
	return;
}else {

    var csrc = conf.js_src;
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

	conf.js_src = csrc;
	//Set watch default pattern puth
    if( !conf.js_watch ){
    	conf.js_watch = [csrc_dir + '/**/*.js'];
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

    var condition_obfus = function (file) {
        if (file.path.indexOf('.xmin.') >= 0) {
            return true;
        }
        return false;
    }

    function console_compile(dest, file){
        dest = dest.replace(/\/+$/, '') + '/';
        if (file.history[1]) {
            console.log('Compile: ' + dest + path.basename(file.history[1]));
        } else {
            console.log('Compile: ' + dest + path.basename(file.history[0]));
        }
    }


    /********* JS COMPILE TASKS ******/

//Cli: gulp js_auto_watch --gulpfile "полный путь к файлу на диске/gulpfile_js.js"
    gulp.task('js_watch', function (cb) {
        return gulp.watch(conf.js_watch, gulp.series('js_compile')); //For gulp 4
    });

//Cli: gulp js_auto --gulpfile "полный путь к файлу на диске/gulpfile_js.js"
    gulp.task('js_compile', function (cb) {
        var onError = function (err) {
            notify.onError({
                time    : 10000,
                title   : "JS auto",
                subtitle: "ERROR!",
                message : "Error: <%= error.message %>"
            })(err);
            this.emit('end');
        };

        var puth_dest_infile = '';
        var rename_name = '';

        return gulp.src(conf.js_src)
            .pipe(rigger())

            .pipe(tap(function (file, t) {
                get_dest(file.history[0]);

                if (destination[file.history[0]]) {

                    puth_dest_infile = destination[file.history[0]];

                    var namedest = path.basename(destination[file.history[0]]);

                    if (namedest.indexOf('.') >= 0) {
                        rename_name = namedest.split('.')[0];
                        if (namedest.indexOf('.obfus') >= 0) {
                            rename_name = rename_name + '.xmin';

                        } else if (namedest.indexOf('.min.') >= 0) {
                            rename_name = rename_name + '.min';

                        }

                    } else {
                        rename_name = '';
                    }
                }
            }))

            .pipe(replace(/\/\/dest:.*[\n\r]+/g, ''))

            .pipe(rename(function (path) {
                if (rename_name) {
                    path.basename = rename_name;
                    path.extname = ".js";
                }
            }))

            .pipe(stripcom({
                //ignore: /\/\*\s*\n([^\*]*(\*[^\/])?)*\*\//g,
                ignore: /(\/\*[^]*?\*\/|\/\/\*.*)/g,
                trim  : true
            }))

            //https://github.com/minhnguyenvan95/gulp-javascript-obfuscator
            // https://github.com/javascript-obfuscator/javascript-obfuscator#javascript-obfuscator-options
            .pipe(gulpif(condition_obfus, jsObfuscator({
                compact            : true,
                deadCodeInjection  : true,
                selfDefending      : true,
                stringArrayEncoding: true
            })))

            .pipe(gulpif(condition_min, uglify({compress: true})))

            .pipe(gulp.dest(function (file) {
                if(!destination[file.history[0]]){
                    console.error('Not set puth in file for save');
                    return;
                }
                var dest = path.dirname(destination[file.history[0]]);
                if (dest === '..') {
                    dest = '../';
                }

                console_compile(dest, file);

                return dest;
            }))

            .pipe(notify({
                time    : 10000,
                title   : 'JS auto',
                subtitle: 'success',
                message : 'JS auto Compyle',
                onLast  : true
            }));
    });

//Cli: gulp js_min --gulpfile "полный путь к файлу на диске/gulpfile_js.js"
    gulp.task('js_min', function () {
        var onError = function (err) {
            notify.onError({
                time    : 10000,
                title   : "JS min",
                subtitle: "Failure!",
                message : "Error: <%= error.message %>"
            })(err);
            this.emit('end');
        };

        var puth_dest_infile = '';
        var rename_name = '';

        return gulp.src(conf.js_src)
            .pipe(rigger())

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

            .pipe(replace(/\/\/dest:.*[\n\r]+/g, ''))

            .pipe(rename(function (path) {
                if (rename_name) {
                    path.basename = rename_name;
                    path.extname = ".js";
                }
            }))

            .pipe(stripcom({
                ignore: /\/\*\s*\n([^\*]*(\*[^\/])?)*\*\//g,
                trim  : true
            }))

            .pipe(uglify({compress: true}))

            .pipe(gulp.dest(function (file) {

                var dest = path.dirname(destination[file.history[0]]);
                if (dest === '..') {
                    dest = '../';
                }

                console_compile(dest, file);

                return dest;
            }))

            .pipe(notify({
                time    : 10000,
                title   : 'JS min',
                subtitle: 'success',
                message : 'JS min Compyle <%= file.relative %> ',
                onLast  : true
            }));
    });

//Cli: gulp js_unmin --gulpfile "полный путь к файлу на диске/gulpfile_js.js"
    gulp.task('js_unmin', function () {
        var onError = function (err) {
            notify.onError({
                time    : 10000,
                title   : "JS unmin",
                subtitle: "Failure!",
                message : "Error: <%= error.message %>"
            })(err);
            this.emit('end');
        };
        var puth_dest_infile = '';
        var rename_name = '';

        return gulp.src(conf.js_src)
            .pipe(rigger())

            .pipe(tap(function (file, t) {
                get_dest(file.history[0]);

                if (destination[file.history[0]]) {

                    puth_dest_infile = destination[file.history[0]];

                    var namedest = path.basename(destination[file.history[0]]);

                    if (namedest.indexOf('.') >= 0) {
                        rename_name = namedest.split('.')[0];
                    } else {
                        rename_name = '';
                    }
                }
            }))

            .pipe(replace(/\/\/dest:.*[\n\r]+/g, ''))

            .pipe(rename(function (path) {
                if (rename_name) {
                    path.basename = rename_name;
                    path.extname = ".js";
                }
            }))

            .pipe(stripcom({
                ignore: /\/\*\s*\n([^\*]*(\*[^\/])?)*\*\//g,
                trim  : true
            }))

            .pipe(gulp.dest(function (file) {

                var dest = path.dirname(destination[file.history[0]]);
                if (dest === '..') {
                    dest = '../';
                }

                console_compile(dest, file);

                return dest;
            }))

            .pipe(notify({
                time    : 10000,
                title   : 'JS unmin',
                subtitle: 'success',
                message : 'JS unmin Compyle <%= file.relative %> ',
                onLast  : true
            }));
    });

//Cli: gulp js_obfus --gulpfile "полный путь к файлу на диске/gulpfile_js.js"
    gulp.task('js_obfus', function () {
        var onError = function (err) {
            notify.onError({
                time    : 10000,
                title   : "JS obfuscate",
                subtitle: "Failure!",
                message : "Error: <%= error.message %>"
            })(err);
            this.emit('end');
        };
        var puth_dest_infile = '';
        var rename_name = '';

        return gulp.src(conf.js_src)
            .pipe(rigger())

            .pipe(tap(function (file, t) {
                get_dest(file.history[0]);

                if (destination[file.history[0]]) {

                    puth_dest_infile = destination[file.history[0]];

                    var namedest = path.basename(destination[file.history[0]]);

                    if (namedest.indexOf('.') >= 0) {
                        rename_name = namedest.split('.')[0];
                        rename_name = rename_name + '.xmin';

                    } else {
                        rename_name = '';
                    }
                }
            }))

            .pipe(replace(/\/\/dest:.*[\n\r]+/g, ''))

            .pipe(rename(function (path) {
                if (rename_name) {
                    path.basename = rename_name;
                    path.extname = ".js";
                }
            }))

            .pipe(stripcom({
                ignore: /\/\*\s*\n([^\*]*(\*[^\/])?)*\*\//g,
                trim  : true
            }))

            //https://github.com/minhnguyenvan95/gulp-javascript-obfuscator
            // https://github.com/javascript-obfuscator/javascript-obfuscator#javascript-obfuscator-options
            .pipe(jsObfuscator({
                compact            : true,
                deadCodeInjection  : true,
                selfDefending      : true,
                stringArrayEncoding: true
            }))

            .pipe(gulp.dest(function (file) {

                var dest = path.dirname(destination[file.history[0]]);
                if (dest === '..') {
                    dest = '../';
                }

                console_compile(dest, file);

                return dest;
            }))

            .pipe(notify({
                time    : 10000,
                title   : 'JS obfuscate',
                subtitle: 'success',
                message : 'JS obfuscate Compyle <%= file.relative %> ',
                onLast  : true
            }));
    });

}