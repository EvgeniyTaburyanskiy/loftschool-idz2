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
  browserSync: require('browser-sync').create(),
  gp:          require('gulp-load-plugins')()
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
        'copy:image',     //-> Копирует все(кроме svg) картинки из src/images в /assets/img
        'css:foundation', //-> Собирает  все Вендорные CSS указанные в  gulp/paths/foundation.css в один foundation.css
        'sprite:svg'      //-> Собирает  все ./source/images/svg/ очищает их от атрибутов и генерит спрайт svg
    ),
    $.gulp.parallel(
        'watch',
        'serve'
    )
));
