'use strict';

/**
 * ALBUMS
 */
(function () {
  var serviceUrl = "/api/method/albums";
  var data = {};

  var _ajaxCall = function (url, method, data) {
    var method_ = method || "GET";
    var serviceUrl_ = url || serviceUrl;

    $.ajax({
      type:    method_,
      url:     serviceUrl_,
      data:    data,
      success: function (msg) {
        console.log(msg);
      },
      error:   function (err) {
      }
    });
  };

  var getAlbumByID = function (album_id) {
    var id_ = album_id || 0;
    if (!id_) return false;

    _ajaxCall(serviceUrl + ".getAlbumByID", undefined, {album_id: id_});
  };

  var getAlbumsByUser = function (user_id) {
    var user_id_ = user_id || null;
    var data = {
      user_id: user_id_
    };
    _ajaxCall(serviceUrl + ".getAlbumsByUser", null, data);
  };

  var addAlbum = function (name, descr) {
    var data = {
      album_name:  name,
      album_descr: descr
    };
    _ajaxCall(serviceUrl + ".addAlbum", "POST", data)
  };

  var deleteAlbum = function (album_id) {
    var id_ = album_id || 0;
    var data = {
      album_id:  id_,
      confirmed: "Y"
    };
    if (!id_) return false;

    _ajaxCall(serviceUrl + ".deleteAlbum", "POST", data);
  };

  var updateAlbum = function (album_id, name, descr) {

    var data = {
      album_id:    album_id || undefined,
      album_name:  name || undefined,
      album_descr: descr || undefined,
      album_bg:    ''
    };
    _ajaxCall(serviceUrl + ".updateAlbum", "POST", data);
  };

  window.modAlbum = {
    getAlbumsByUser: getAlbumsByUser,
    getAlbumByID:    getAlbumByID,
    addAlbum:        addAlbum,
    updateAlbum:     updateAlbum,
    deleteAlbum:     deleteAlbum
  };
})();


/**
 * PHOTOS
 */
(function () {
  var serviceUrl = "/api/method/photos";
  var data = {};

  var _ajaxCall = function (url, method, data) {
    var method_ = method || "GET";
    var serviceUrl_ = url || serviceUrl;

    $.ajax({
      type:    method_,
      url:     serviceUrl_,
      data:    data,
      success: function (msg) {
        console.log(msg);
      },
      error:   function (err) {
      }
    });
  };


  var getPhotoById = function () {

  };


  var getNewPhotos = function (count, skip) {

    data = {
      skip:  parseInt(skip) || undefined,
      count: parseInt(count) || undefined
    };

    _ajaxCall(serviceUrl + ".getNewPhotos", null, data);
  };


  var addPhoto = function () {
  };


  var addPhotoComment = function () {
  };


  var addPhotoLike = function () {
  };


  var deletePhoto = function () {
  };


  var updatePhoto = function () {
  };


  var searchPhotos = function () {
  };


  var movePhotos = function () {
  };


  window.modPhoto = {
    getPhotoById:    getPhotoById,
    getNewPhotos:    getNewPhotos,
    addPhoto:        addPhoto,
    addPhotoComment: addPhotoComment,
    addPhotoLike:    addPhotoLike,
    deletePhoto:     deletePhoto,
    updatePhoto:     updatePhoto,
    searchPhotos:    searchPhotos,
    movePhotos:      movePhotos
  };
})();


/**
 * USERS
 */
(function () {
  var serviceUrl = "/api/method/users";
  var data = {};

  var _ajaxCall = function (url, method, data) {
    var method_ = method || "GET";
    var serviceUrl_ = url || serviceUrl;

    $.ajax({
      type:    method_,
      url:     serviceUrl_,
      data:    data,
      success: function (msg) {
        console.log(msg);
      },
      error:   function (err) {
      }
    });
  };

  var getUsersList = function () {
    _ajaxCall(serviceUrl + ".getUsersList", undefined, {});
  };

  var getUserById = function (user_id) {
    var id_ = user_id || undefined;

    _ajaxCall(serviceUrl + ".getUserById", undefined, {user_id: id_});
  };

  var addUser = function (user_id) {
    var id_ = user_id || undefined;

    _ajaxCall(serviceUrl + ".getUserById", undefined, {user_id: id_});
  };

  var updateUserImgs = function (user_id, profile) {

    var newProfile = {
      user_id: user_id || undefined,
      ava_img: "/img/no-avatar.png",
      bg_img:  "/img/no-user-bg.png"
    };


    _ajaxCall(serviceUrl + ".updateUserImgs", "POST", newProfile);
  };

  var updateUserProfile = function (user_id, profileData) {

    var profileData_ = {
      user_id:   user_id || undefined,
      firstName: "Джеки",
      lastName:  "Чен",
      message:   "Я голливудский актер, мне уже лет 50. Люблю сниматься в боевиках и активный отдых.",
      email:     "djaki@chan.ru",
      fb:        "",
      gl:        "",
      tw:        "",
      vk:        "https://new.vk.com/djaki"
    };


    _ajaxCall(serviceUrl + ".updateUserProfile", "POST", profileData_);
  };

  var deleteUser = function (user_id) {
    var id_ = user_id || undefined;

    _ajaxCall(serviceUrl + ".getUserById", undefined, {user_id: id_});
  };

  window.modUser = {
    getUsersList:      getUsersList,
    getUserById:       getUserById,
    addUser:           addUser,
    updateUserImgs:    updateUserImgs,
    updateUserProfile: updateUserProfile,
    deleteUser:        deleteUser
  };
})();