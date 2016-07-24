'use strict';
/**
 * ALBUMS
 */
(function () {
  var serviceUrl = "/api/albums";
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

  var getAlbum = function (id) {
    var id_ = id || 0;
    if (!id) return false;

    _ajaxCall(undefined, undefined, {album_id: id_});
  };

  var getAlbums = function (user_id) {
    var user_id_ = user_id || null;
    var data = {
      user_id: user_id_
    };
    _ajaxCall("/api/albums/useralbums", null, data);
  };

  var addAlbum = function (name, descr) {
    var data = {
      album_name:  name,
      album_descr: descr
    };
    _ajaxCall(undefined, "POST", data)
  };

  var delAlbum = function (id) {
    var id_ = id || 0;
    var data = {
      album_id:  id_,
      confirmed: "Y"
    };
    if (!id) return false;

    _ajaxCall('/api/albums/delete', "POST", data);
  };

  var updateAlbum = function (id, name, descr) {

    var data = {
      album_id:    id || undefined,
      album_name:  name || undefined,
      album_descr: descr || undefined,
      album_bg:    ''
    };
    _ajaxCall('/api/albums/update', "POST", data);
  };
  
  window.ajaxCall = {
    getAlbums:   getAlbums,
    getAlbum:    getAlbum,
    addAlbum:    addAlbum,
    updateAlbum: updateAlbum,
    delAlbum:    delAlbum
  };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG5cclxuXHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
