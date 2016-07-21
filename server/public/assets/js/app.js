'use strict';

(function () {
  var serviceUrl = "/api/albums";
  var data = {};


  var _ajaxCall = function (url, method, data) {
    var method_ = method || "GET";
    var serviceUrl = url || serviceUrl;
    $.ajax({
      type:    method_,
      url:     serviceUrl,
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
    _ajaxCall(null, null, {album_id: id_});
  };

  var getAlbums = function () {
    _ajaxCall("/api/albums/useralbums");
  };


  var addAlbum = function (name, descr) {
    var data = {
      album_name:  name,
      album_descr: descr
    };
    _ajaxCall(null, "POST", data)
  };

  window.ajaxCall = {
    getAlbums: getAlbums,
    getAlbum:  getAlbum,
    addAlbum:  addAlbum
  };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG5cclxuXHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
