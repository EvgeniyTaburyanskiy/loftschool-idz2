'use strict';

(function () {
  var serviceUrl = "/api/albums";
  var data = {};


  var _ajaxCall = function (method, data) {
    var method_ = method || "GET";

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

  var getAlbums = function () {
    _ajaxCall();
  };

  var addAlbum = function (data) {
    _ajaxCall("POST", data)
  };
  window.ajaxCall = {
    getAlbums: getAlbums,
    addAlbum:  addAlbum
  };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG5cclxuXHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
