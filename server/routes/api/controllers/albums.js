var logger = require('../../../utils/winston')(module);
var HttpError = require('../../../middleware/HttpError').HttpError;
var async = require('async');

var Album = require('../../../db/models/Album').mAlbum;
var Photo = require('../../../db/models/Photo').mPhoto;
var PhotoComment = require('../../../db/models/PhotoComment').mPhotoComments;

/**
 * Возвращает данные Альбома и Список Фотографий Альбома по ID Альбома.
 * @param req
 * @param res
 * @param next
 */
var API_getAlbumByID = function (req, res, next) {
  var album_id = req.query.album_id || req.params.album_id || req.body.album_id;
// TODO: API- Валидация ID Альбома

  // Получаем Инфо об Альбоме
  // Получаем список Фоток Альбома
  // Получаем данные Владельца Альбома
  async.parallel([
    function (done) {
      Album
      .findById(album_id)
      .lean()
      .populate('_user_id')
      .populate('_album_bg')
      .exec(function (err, album) {
        if (err) return done(err);

        var result = {
          id:        album.id,
          name:      album.name,
          descr:     album.descr,
          _album_bg: {
            imgURL:   album._album_bg.imgURL,
            thumbURL: album._album_bg.thumbURL
          }

        };
        return done(err, result);
      });
    },
    function (done) {
      Photo
      .find({_album_id: album_id}, 'name descr imgURL thumbURL album_bg comments likes')
      .lean()
      .populate('comments')
      .exec(function (err, photos) {
        if (err) return done(err);
        var result = {};
        return done(err, photos);
      });
    }
  ], function (err, result) {
    if (err) return next(err);

    next(new HttpError(200, null, '',
        {
          album:  result[0],
          photos: result[1]

        })
    );
  });
};


/**
 * Возвращает список Альбомов Пользователя. По ID пользователя.
 * @param req
 * @param res
 * @param next
 * @constructor
 */
var API_getAlbumsByUser = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.user._id;
  // TODO: API- Валидация ID Пользователя

  // Получаем Инфо об Альбомах
  async.waterfall([
    function (done) {
      Album
      .find({_user_id: user_id}, 'id name descr _album_bg')
      .lean()
      .populate('_album_bg', 'imgURL thumbURL')
      .exec(function (err, albums) {
        if (err) return done(err);
        return done(err, albums);
      });
    }
  ], function (err, albums) {
    if (err) return next(err);

    next(new HttpError(200, null, '', albums));
  });

};


/**
 * Добавляет новый Альбом в БД. + Фото фона альбома в Коллекцию Фоток
 * @param req
 * @param res
 * @param next
 * @constructor
 */
var API_addAlbum = function (req, res, next) {
  var album_name = req.body.album_name;
  var album_descr = req.body.album_descr;
  var album_bg = req.file;
  var user = req.user;
  // TODO: API- Валидация данных перед добавлением нового альбома

  async.waterfall([
    // Создаем Новый Альбом и сохраняем + связка с пльзователем
    function (done) {
      var newAlbum = new Album({
        _user_id: user._id,
        name:     album_name,
        descr:    album_descr
      });

      newAlbum.save(function (err) {
        if (err) return done(err);
        // TODO: API- Обработка ошибок валидации Сохранения Альбома
        return done(null, newAlbum);
      });
    },
    //Создаем документ в БД для хранения инфо о фотографии
    function (album, done) {
      var newPhoto = new Photo({
        _album_id: album._id,
        album_bg:  true
      });

      newPhoto.save(function (err) {
        if (err) return done(err);
        // TODO: API- Обработка ошибок валидации Сохранения Фотографии
        return done(null, album, newPhoto);
      });
    },
    // Устанавливаем обратную ссылку альбому на Фотку(фон)
    function (album, photo, done) {

      album._album_bg = photo._id;

      album.save(function (err) {
        if (err) return done(err);
        // TODO: API- Обработка ошибок валидации Сохранения Альбома
        return done(null, album, photo);
      });
    },
    // Получаем фотки и обрабатываем их. Сохраняем в FS и обновляем документ Фотки.
    function (album, photo, done) {
      var result;
      // TODO: API- Обработка Загруженой фотки с валидацией

      result = {
        id:        album.id,
        name:      album.name,
        descr:     album.descr,
        _album_bg: {
          imgURL:   photo.imgURL,
          thumbURL: photo.thumbURL
        }
      };
      return done(null, result);
    }
  ], function (err, result) {
    if (err) return next(err);
    // TODO: API- Код ошибки об успешном сосздании альбома

    next(new HttpError(200, null, '', result));
  });
};


/**
 * Обновляет данные Альбома по его ID
 * @param req
 * @param res
 * @param next
 * @constructor
 */
var API_updateAlbum = function (req, res, next) {
  var album_bg;
  var album_id = req.body.album_id;
  var album_name = req.body.album_name || 'Альбом без названия!';
  var album_descr = req.body.album_descr || '';
  console.log('files', req.files);
  //var album_bg = (req.files !== 'undefined') ? req.files['album_bg'] : '' || req.body.album_bg; // ожидаем либо файл либо ID фотки из БД
  // TODO: API- Валидация данных перед обновлением  альбома

  if (!album_id) {
    next(new HttpError(400, null, 'ID альбома указано не верно!'));
  }

  async.waterfall([
    //Проверяем что альбом принадлежит текущему пользователю
    function (done) {
      Album.findOne({'_user_id': req.user._id, '_id': album_id})
      .populate('_album_bg')
      .exec(function (err, album) {
        // TODO: API -Код ошибки отказа в обновлении чужого альбома
        if (!album) return done(new HttpError(400, null, 'Альбом не существует либо Вы не являетесь его владельцем!'));
        return done(err, album);
      });
    },
    //Обрабатываем загруженный файл фотки Imagick и сохраняем в FS и в БД
    function (album, done) {
      //Если новую фотку не загрузили файлом или ID новой и старой совпадают, движемся дальше
      if (
          !album_bg ||
          album_bg.toString() === album._album_bg._id.toString()
      ) {
        // изменений фотки небыло
        return done(null, album, null);
      }

      // TODO: API- Реализовать Обработку фото в IMAGICK

      var photofiles = {
        img:         {},
        img_resized: {}
      };

      // Создаем новую фотку .
      var newPhoto = new Photo({
        '_album_id': album._album_bg._id,
        'album_bg':  true,
        'imgURL':    photofiles.img,
        'thumbURL':  photofiles.img_resized
      });

      // Новую фотку  сохраненяем в БД
      newPhoto.save(function (err) {
        if (err) return done(err);
      });

      return done(null, album, newPhoto);
    },
    // Снимаем со старой фотки флаг того что она Фоновая картинка альбома, если есть новая фотка
    function (album, newPhoto, done) {
      console.log('newPhoto', newPhoto);
      if (newPhoto) {
        // Находим фотку текущего фона
        Photo.findById(album._album_bg._id, function (err, oldPhoto) {
          // Снимаем у старой фотки флаг того что она бекграунд.
          if (oldPhoto) {
            oldPhoto.album_bg = false;

            oldPhoto.save(function (err) {
              if (err) return done(err);
            })
          }
        });
      }

      return done(null, album, newPhoto);
    },
    //Вносим изменения в Альбом с указанием ссылки на новый Фон
    function (album, newPhoto, done) {
      album.name = album_name;
      album.descr = album_descr;
      if (newPhoto) {
        album._album_bg = newPhoto._id;
      }

      album
      .save()
      .then(done(null, album), done);
    }

  ], function (err, album) {
    if (err) return next(err);
    // TODO: API- Код ошибки об успешном удалении альбома и всех фото из него
    var result = {
      id:        album.id,
      name:      album.name,
      descr:     album.descr,
      _album_bg: {
        _id:      album._album_bg._id,
        imgURL:   album._album_bg.imgURL,
        thumbURL: album._album_bg.thumbURL
      }
    };
    next(new HttpError(200, null, 'Альбом успешно изменен!', result));
  });
};


/**
 * Удаляет Альбом и все связанные с ним Фото из БД.
 * @param req
 * @param res
 * @param next
 * @constructor
 */
var API_deleteAlbum = function (req, res, next) {
  var album_id = req.body.album_id;
  var isConfirmed = req.body.confirmed;

  // TODO: API- Валидация данных перед удалением альбома

  if (
      isConfirmed.toLowerCase() != "y" &&
      isConfirmed.toLowerCase() != "true"
  ) {
    return next(new HttpError(400, null, 'Удаление альбома не подтверждено!'));
  }

  async.waterfall([
    //Проверяем что альбом принадлежит текущему пользователю
    function (done) {
      Album.findOne({'_user_id': req.user._id, '_id': album_id}, done);
    },
    //Удалеяем все фотки альбома если запрос от владельца альбома
    function (album, done) {
      // TODO: API -Код ошибки отказа в удалении чужого альбома
      if (!album) return done(new HttpError(400, null, 'Альбом не существует либо Вы не являетесь его владельцем!'));

      album
      .remove()
      .then(done(null, album), done);
    }
  ], function (err, album) {
    if (err) return next(err);
    // TODO: API- Код ошибки об успешном удалении альбома и всех фото из него
    var result = {
      id:    album.id,
      name:  album.name,
      descr: album.descr
    };
    next(new HttpError(200, null, 'Альбом успешно удален!', result));
  });

};


exports = module.exports = {
  API_getAlbumByID:    API_getAlbumByID,
  API_getAlbumsByUser: API_getAlbumsByUser,
  API_addAlbum:        API_addAlbum,
  API_updateAlbum:     API_updateAlbum,
  API_deleteAlbum:     API_deleteAlbum
};