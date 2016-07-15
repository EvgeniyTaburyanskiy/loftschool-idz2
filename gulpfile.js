'use strict';

global.$ = {
  package:     require('./package.json'),
  config:      require('./gulp/config'),
  path:        {
    task:          require('./gulp/paths/tasks.js'),
    jsFoundation:  require('./gulp/paths/js.foundation.js'),
    cssFoundation: require('./gulp/paths/css.foundation.js'),
    app:           require('./gulp/paths/app.js')
  },
  gulp:        require('gulp'),
  rimraf:      require('rimraf'),
  rsp: require('remove-svg-properties').stream,
  browserSync: require('browser-sync'),//.create(),
  gp:          require('gulp-load-plugins')({
    rename: {
      'gulp-svg-sprite': 'svgSprite',
      'gulp-sass-glob':  'sassGlob'
    }
  })
};

$.path.task.forEach(function (taskPath) {
  require(taskPath)();
});

$.gulp.task('default', $.gulp.series(
    'clean',
    $.gulp.parallel(
        'sass',           //-> Обрабатывает app.scss  
        'pug',            //-> Обрабатывает PUG/ Jade из папки Pages
        'js:foundation',  //-> Собирает  все Вендорные JS указанные в  gulp/paths/foundation.js в один foundation.js
        'js:process',     //-> Собирает все JS указанные в gulp/paths/app.js в один файл с картой app.js
        'copy:image',     //-> Копирует все картинки из source/images в build/assets/img
        'copy:fonts',     //-> Копирует все шрифты из source/fonts в build/assets/fonts
        'css:foundation', //-> Собирает  все Вендорные CSS указанные в  gulp/paths/css.foundation.js один foundation.css
        'svgSprite'      //-> Собирает  все ./source/icons/ очищает их от атрибутов и генерит спрайт svg
    ),
    $.gulp.parallel(
        'watch',
        'serve'
    )
));
