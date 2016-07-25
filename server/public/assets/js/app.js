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

  window.modPhoto = {
    
  };
})();
