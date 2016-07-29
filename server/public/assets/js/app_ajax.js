'use strict';
//--------------------- API MODULES---------------------------------//
/**
 * mod ALBUMS
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


  if (!window.loftogram) window.loftogram = {};
  window.loftogram.modAlbum = {
    getAlbumsByUser: getAlbumsByUser,
    getAlbumByID:    getAlbumByID,
    addAlbum:        addAlbum,
    updateAlbum:     updateAlbum,
    deleteAlbum:     deleteAlbum
  };
})();


/**
 * mod PHOTOS
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

  if (!window.loftogram) window.loftogram = {};
  window.loftogram.modPhoto = {
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
 * mod USERS
 */
(function () {
  var serviceUrl = "/api/method/users";
  var data = {};

  var _ajaxCall = function (url, method, data) {
    var method_ = method || "GET";
    var serviceUrl_ = url || serviceUrl;

    return $.ajax({
      type:        method_,
      url:         serviceUrl_,
      processData: false,
      data:        data
    })
  };

  var getUsersList = function () {
    return _ajaxCall(serviceUrl + ".getUsersList", undefined, {});
  };

  var getUserById = function (user_id) {
    var id_ = user_id || undefined;

    return _ajaxCall(serviceUrl + ".getUserById", undefined, {user_id: id_});
  };

  var addUser = function (user_id) {
    var id_ = user_id || undefined;

    return _ajaxCall(serviceUrl + ".getUserById", undefined, {user_id: id_});
  };

  var updateUserImgs = function (form_id) {

    var profileData = new FormData(document.forms[form_id]);

    return _ajaxCall(serviceUrl + ".updateUserImgs", "POST", profileData);
  };

  var updateUserProfile = function (form_id) {

    var profileData = new FormData(document.forms[form_id]);

    return _ajaxCall(serviceUrl + ".updateUserProfile", "POST", profileData);
  };

  var deleteUser = function (user_id) {
    var id_ = user_id || undefined;

    return _ajaxCall(serviceUrl + ".getUserById", undefined, {user_id: id_});
  };

  if (!window.loftogram) window.loftogram = {};

  window.loftogram.modUser = {
    getUsersList:      getUsersList,
    getUserById:       getUserById,
    addUser:           addUser,
    updateUserImgs:    updateUserImgs,
    updateUserProfile: updateUserProfile,
    deleteUser:        deleteUser
  };
})();


/**
 *  mod AUTH
 */
(function () {
  var serviceUrl = "/api/method/auth";
  var data = {};


  var _ajaxCall = function (url, method, data) {
    var method_ = method || "POST";
    var serviceUrl_ = url || serviceUrl;

    return $.ajax({
      type:        method_,
      url:         serviceUrl_,
      dataType:    'json',
      data:        data
    });
  };


  var signin = function (form_id) {

    var form = document.forms[form_id];

    var data = {
      'username': form.elements['username'].value,
      'password': form.elements['password'].value,
      '_csrf':    form.elements['_csrf'].value
    };

    return _ajaxCall(serviceUrl + ".signin", "POST", data);
  };


  var signout = function () {
    return _ajaxCall(serviceUrl + ".signout", "POST", {});
  };


  var signup = function (form_id) {
    var form = document.forms[form_id];

    var data = {
      'name':     form.elements['name'].value,
      'username': form.elements['username'].value,
      'password': form.elements['password'].value,
      '_csrf':    form.elements['_csrf'].value
    };

    return _ajaxCall(serviceUrl + ".signup", "POST", data);
  };


  var fogotPasswd = function (form_id) {

    var form = document.forms[form_id];

    var data = {
      'email': form.elements['email'].value,
      '_csrf': form.elements['_csrf'].value
    };

    return _ajaxCall(serviceUrl + ".fogotPasswd", "POST", data);

  };


  var resetPasswd = function (form_id) {
    var form = document.forms[form_id];

    var data = {
      'password': form.elements['password'].value,
      'token':    form.elements['token'].value,
      '_csrf':    form.elements['_csrf'].value
    };

    return _ajaxCall(serviceUrl + ".resetPasswd", "POST", data);

  };


  if (!window.loftogram) window.loftogram = {};

  window.loftogram.modAuth = {
    signin:      signin,
    signout:     signout,
    signup:      signup,
    fogotPasswd: fogotPasswd,
    resetPasswd: resetPasswd


  };
})();


//---------------------  FRONT API USAGE---------------------------//

// EDIT_PROFILE
(function () {
  $(document).on('submit', '#edit_profile', function (event) {
    event.preventDefault();
    //var form = $(this);

    var dfdEditProfile = window.loftogram.modUser.updateUserProfile('edit_profile');
    var dfdEditProfileImgs = window.loftogram.modUser.updateUserImgs('edit_profile');

    $.when(dfdEditProfile, dfdEditProfileImgs).then(
        function (EditProfile, EditProfileImgs) {

          console.log('SUC EditProfile=', JSON.parse(EditProfile.responseText));
          console.log('SUC EditProfileImgs=', JSON.parse(EditProfileImgs));
        },
        function (EditProfile, EditProfileImgs) {
          console.log('ERR EditProfile=', JSON.parse(EditProfile.responseText));
          console.log('ERR  EditProfileImgs=', JSON.parse(EditProfileImgs.responseText));
        }
    );
    return false;
  });
})();


// SIGN OUT
(function () {
  $(document).on('click', '.exit-block__btn', function (event) {
    event.preventDefault();
    var dfdSignout = window.loftogram.modAuth.signout();

    dfdSignout.done(function (data, statusText, xhr) {
      var status = xhr.status;
      if (200 == status) {//200
        window.location.href = '/auth';
      }
    });
  });
})();


// SIGN IN
(function () {
  $(document).on('submit', '#signin_form', function (event) {
    event.preventDefault();

    var dfdSignIn = window.loftogram.modAuth.signin('signin_form');

    $.when(dfdSignIn).then(
        function (resSignIn) {
          window.location.href = '/';
        },
        function (resSignIn) {
          console.log(resSignIn);
          var result = resSignIn.responseJSON;
          alert(result.error_user_msg);
        }
    );
    return false;
  });
})();


// SIGN UP
(function () {
  $(document).on('submit', '#signup_form', function (event) {
    event.preventDefault();

    var dfdSignUp = window.loftogram.modAuth.signup('signup_form');

    $.when(dfdSignUp).then(
        function (resSignup) {
          window.location.href = '/';
        },
        function (resSignup) {
          var result = resSignup.responseJSON;
          alert(result.error_user_msg);
        }
    );
    return false;
  });
})();


// FOGOT PASSWD
(function () {
  $(document).on('submit', '#fogotPasswd_form', function (event) {
    event.preventDefault();

    var dfdFogotPasswd = window.loftogram.modAuth.fogotPasswd('fogotPasswd_form');

    $.when(dfdFogotPasswd).then(
        function (resFogotPasswd) {
          var result = resFogotPasswd;
          alert(result.error_user_msg);
        },
        function (resFogotPasswd) {
          var result = resFogotPasswd.responseJSON;
          alert(result.error_user_msg);
        }
    );
    return false;
  });
})();


// RESET PASSWD
(function () {
  $(document).on('submit', '#resetPasswd_form', function (event) {
    event.preventDefault();

    var dfdResetPasswd_form = window.loftogram.modAuth.resetPasswd('resetPasswd_form');

    $.when(dfdResetPasswd_form).then(
        function (resResetPasswd) {
          window.location.href = '/';
        },
        function (resResetPasswd) {
          var result = resResetPasswd.responseJSON;
          alert(result.error_user_msg);
        }
    );
    return false;
  });
})();
