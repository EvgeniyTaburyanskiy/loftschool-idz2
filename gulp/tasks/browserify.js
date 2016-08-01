'use strict';

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var sourceStream = require('vinyl-source-stream');
var uglify = require('gulp-uglify');


module.exports = function () {
  $.gulp.task('browserify', function () {
    return browserify([$.path.app],{
      debug:   true
    })
    .bundle()
    .pipe(sourceStream('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    //.pipe($.gp.sourcemaps.init({loadMaps: true}))
    //.pipe($.gp.sourcemaps.write('./maps'))
    .pipe($.gulp.dest($.config.root + '/assets/js'));
  });
};