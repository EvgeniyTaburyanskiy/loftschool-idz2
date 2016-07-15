'use strict';

module.exports = function () {
  $.gulp.task('serve', function () {

    $.browserSync(
        {
          notify: false,
          port:   9000,
          server: $.config.root
        }
    );
    /*.init({
     open: false,
     server: $.config.root
     })*/
    ;

    $.browserSync.watch([$.config.root + '/**/*.*', '!**/*.css'], $.browserSync.reload);
  });
};
