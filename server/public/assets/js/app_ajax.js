;
'use strict';
//--------------------- API MODULES ---------------------------------//

/**
 * mod AJAX
 */
(function () {
  var serviceUrl = '';

  var _ajax = function (url, method, data) {
    var method_ = method || "GET";
    var serviceUrl_ = url || serviceUrl;

    return $.ajax({
      type:     method_,
      url:      serviceUrl_,
      dataType: 'json',
      data:     data
    });
  };

  var _ajaxFiles = function (url, method, data) {
    var method_ = method || "POST";
    var serviceUrl_ = url || serviceUrl;

    return $.ajax({
      url:         serviceUrl_,
      type:        method_,
      xhr:         function () {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener('progress', _progressHandlingFunction, false); // For handling the progress of the upload
        }
        return myXhr;
      },
      // Form data
      data:        data,
      //Options to tell jQuery not to process data or worry about content-type.
      cache:       false,
      contentType: false,
      processData: false
    });

    function _progressHandlingFunction(e) {
      if (e.lengthComputable) {
        console.log('Upload Progress',
            {
              value: e.loaded,
              max:   e.total
            });
      }
    }

  };

  if (!window.loftogram) window.loftogram = {};

  window.loftogram.modAJAX = {
    ajax:      _ajax,
    ajaxFiles: _ajaxFiles

  };
})();


/**
 * mod ALBUMS
 */
(function () {
  var serviceUrl = "/api/method/albums";
  var data = {};

  var getAlbumByID = function (album_id) {
    var id_ = album_id || 0;
    if (!id_) return false;

    return loftogram.modAJAX.ajax(serviceUrl + ".getAlbumByID", null, {album_id: id_});
  };

  var getAlbumsByUser = function (user_id) {
    var user_id_ = user_id || null;
    var data = {
      user_id: user_id_
    };
    return loftogram.modAJAX.ajax(serviceUrl + ".getAlbumsByUser", null, data);
  };


  var addAlbum = function (form_id) {
    var data = new FormData(document.forms[form_id]);

    return loftogram.modAJAX.ajaxFiles(serviceUrl + ".addAlbum", "POST", data);
  };


  var deleteAlbum = function (album_id) {
    var id_ = album_id || 0;
    var data = {
      album_id:  id_,
      confirmed: "Y"
    };
    if (!id_) return false;

    loftogram.modAJAX.ajax(serviceUrl + ".deleteAlbum", "POST", data);
  };


  var updateAlbum = function (form_id) {
    var data = new FormData(document.forms[form_id]);
    //var form = document.forms[form_id];

    /*    var data = {
     'album_id':    form.elements['album_id'].value,
     '_csrf':       form.elements['_csrf'].value,
     'album_name':  form.elements['album_name'].value,
     'album_descr': form.elements['album_descr'].value,
     'photo_descr': form.elements['photo_descr'].value,
     'album_bg':    form.elements['album_bg'].value
     };*/


    return loftogram.modAJAX.ajaxFiles(serviceUrl + ".updateAlbum", "POST", data);
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

  var getPhotoById = function (photo_id) {
    data = {
      photo_id: photo_id || undefined
    };

    return loftogram.modAJAX.ajax(serviceUrl + ".getPhotoById", 'POST', data);
  };


  var getNewPhotos = function (count, skip) {

    data = {
      skip:  parseInt(skip) || undefined,
      count: parseInt(count) || undefined
    };

    loftogram.modAJAX.ajax(serviceUrl + ".getNewPhotos", 'POST', data);
  };


  var addPhoto = function () {
  };


  var addPhotoComment = function () {
  };


  var addPhotoLike = function (photo_id) {
    data = {
      photo_id: photo_id || undefined
    };

    return loftogram.modAJAX.ajax(serviceUrl + ".addPhotoLike", 'POST', data);
  };


  var deletePhoto = function () {
  };


  var updatePhoto = function (form_id) {

    var form = document.forms[form_id];

    var data = {
      'photo_id':    form.elements['photo_id'].value,
      '_csrf':       form.elements['_csrf'].value,
      'confirmed':   form.elements['confirmed'].value,
      'photo_name':  form.elements['photo_name'].value,
      'photo_descr': form.elements['photo_descr'].value
    };

    return loftogram.modAJAX.ajax(serviceUrl + ".updatePhoto", "POST", data);
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

  var getUsersList = function () {
    return loftogram.modAJAX.ajax(serviceUrl + ".getUsersList", undefined, {});
  };

  var getUserById = function (user_id) {
    var id_ = user_id || undefined;

    return loftogram.modAJAX.ajax(serviceUrl + ".getUserById", undefined, {user_id: id_});
  };

  var addUser = function (user_id) {
    var id_ = user_id || undefined;

    return loftogram.modAJAX.ajax(serviceUrl + ".getUserById", undefined, {user_id: id_});
  };

  var updateUserImgs = function (form_id) {
    var profileData = new FormData(document.forms[form_id]);

    return loftogram.modAJAX.ajaxFiles(serviceUrl + ".updateUserImgs", "POST", profileData);
  };

  var updateUserProfile = function (form_id) {

    var form = document.forms[form_id];

    var data = {
      'user_id':   form.elements['user_id'].value,
      '_csrf':     form.elements['_csrf'].value,
      'firstName': form.elements['firstName'].value,
      'lastName':  form.elements['lastName'].value,
      'message':   form.elements['message'].value,
      'vk':        form.elements['vk'].value,
      'fb':        form.elements['fb'].value,
      'tw':        form.elements['tw'].value,
      'email':     form.elements['email'].value
    };


    return loftogram.modAJAX.ajax(serviceUrl + ".updateUserProfile", "POST", data);
  };

  var deleteUser = function (user_id) {
    var id_ = user_id || undefined;

    return loftogram.modAJAX.ajax(serviceUrl + ".getUserById", undefined, {user_id: id_});
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

  var signin = function (form_id) {

    var form = document.forms[form_id];

    var data = {
      'username': form.elements['username'].value,
      'password': form.elements['password'].value,
      '_csrf':    form.elements['_csrf'].value
    };

    return loftogram.modAJAX.ajax(serviceUrl + ".signin", "POST", data);
  };


  var signout = function () {
    return loftogram.modAJAX.ajax(serviceUrl + ".signout", "POST", {});
  };


  var signup = function (form_id) {
    var form = document.forms[form_id];

    var data = {
      'name':     form.elements['name'].value,
      'username': form.elements['username'].value,
      'password': form.elements['password'].value,
      '_csrf':    form.elements['_csrf'].value
    };

    return loftogram.modAJAX.ajax(serviceUrl + ".signup", "POST", data);
  };


  var fogotPasswd = function (form_id) {

    var form = document.forms[form_id];

    var data = {
      'email': form.elements['email'].value,
      '_csrf': form.elements['_csrf'].value
    };

    return loftogram.modAJAX.ajax(serviceUrl + ".fogotPasswd", "POST", data);

  };


  var resetPasswd = function (form_id) {
    var form = document.forms[form_id];

    var data = {
      'password': form.elements['password'].value,
      'token':    form.elements['token'].value,
      '_csrf':    form.elements['_csrf'].value
    };

    return loftogram.modAJAX.ajax(serviceUrl + ".resetPasswd", "POST", data);

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


//---------------------  FRONT API USAGE ---------------------------//

// SIGN OUT
(function () {
  $(document).on('click', '#signout_btn', function (event) {
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

    var dfdResetPasswd = window.loftogram.modAuth.resetPasswd('resetPasswd_form');

    $.when(dfdResetPasswd).then(
        function (resResetPasswd) {
          window.location.href = '/';
        },
        function (resResetPasswd) {
          var result = resResetPasswd.responseJSON;
          var msg = result.error_user_msg + '\n';

          if (result.data.length) {
            result.data.forEach(function (item) {
              msg += item + '\n';
            })
          }
          alert(msg);
        }
    );
    return false;
  });
})();


// EDIT_PROFILE
(function () {
  $(document).on('submit', '#edit_profile', function (event) {
    event.preventDefault();

    var dfdEditProfile = window.loftogram.modUser.updateUserProfile('edit_profile');
    var dfdEditProfileImgs = window.loftogram.modUser.updateUserImgs('edit_profile');

    $.when(dfdEditProfile).then(
        function (EditProfile) {
          var
              userData          = EditProfile.data.pop().userdata,
              $person_header    = $('header .m-person'),
              person__n         = $person_header.find('.m-person__n'),
              person__tx        = $person_header.find('.m-person__tx'),
              person__soc_vk    = $person_header.find('.person-soc .soc-block__a_vk'),
              person__soc_tw    = $person_header.find('.person-soc .soc-block__a_tw'),
              person__soc_gl    = $person_header.find('.person-soc .soc-block__a_gl'),
              person__soc_fb    = $person_header.find('.person-soc .soc-block__a_fb'),
              person__soc_email = $person_header.find('.person-soc .soc-block__a_email');


          person__n.text(userData.firstName + ' ' + userData.lastName);
          person__tx.text(userData.message);
          person__soc_vk.text(userData.vk);
          person__soc_tw.text(userData.tw);
          person__soc_gl.text(userData.gl);
          person__soc_fb.text(userData.fb);
          person__soc_email.text(userData.email);

        },
        function (EditProfile) {
          var result = EditProfile.responseJSON;
          console.log('ERR EditProfile=', result);
        }
    );

    $.when(dfdEditProfileImgs).then(
        function (EditProfileImgs) {
          var
              userData        = EditProfileImgs.data.pop().userdata,
              $person_ava     = $('header img.m-h__img'),
              $header         = $('header.m-h-w'),
              $footer         = $('footer.f-w'),
              $edit_form__ava = $('.edit-profile img.ava_img'),
              $edit_form__bg  = $('.edit-profile img.bg_img');

          $person_ava.attr("src", userData.ava_img);

          $header.css('background-image', 'url(' + userData.bg_img + ')');

          $footer.css('background-image', 'url(' + userData.bg_img + ')');

          $edit_form__ava.attr("src", userData.ava_img);
          $edit_form__bg.attr("src", userData.bg_img);

        },
        function (EditProfileImgs) {
          var result = EditProfileImgs.responseJSON;
          console.log('ERR EditProfileImgs=', result)
        }
    );


    return false;
  });
})();


// ADD ALBUM
(function () {
  $(document).on('submit', '#addAlbum_form', function (event) {
    event.preventDefault();

    var dfdAddAlbum = window.loftogram.modAlbum.addAlbum('addAlbum_form');

    $.when(dfdAddAlbum).then(
        function (resAddAlbum) {
          var result = resAddAlbum;
          //TODO: FrontJS - Обновить список Альбомов пользователя
          //TODO: FrontJS - Обновить список Новых Фоток
          alert(result.error_user_msg);
          window.location.reload(true);
        },
        function (resAddAlbum) {
          var result = resAddAlbum.responseJSON;
          alert(result.error_user_msg);
          console.log('ERR AddAlbum=', result);
        }
    );
    return false;
  });
})();


// EDIT ALBUM
(function () {
  $(document).on('submit', '#editAlbum_form', function (event) {
    event.preventDefault();

    var dfdUpdateAlbum = window.loftogram.modAlbum.updateAlbum('editAlbum_form');

    $.when(dfdUpdateAlbum).then(
        function (resUpdateAlbum) {
          var result = resUpdateAlbum;
          alert(result.error_user_msg);
          window.location.reload(true);
        },
        function (resUpdateAlbum) {
          var result = resAddAlbum.resUpdateAlbum;
          console.log('ERR resUpdateAlbum=', result);
        }
    );
    return false;
  });
})();


// EDIT PHOTO
(function () {
  $(document).on('submit', '#editPhoto_form', function (event) {
    event.preventDefault();

    var dfdEditPhoto = window.loftogram.modPhoto.updatePhoto('editPhoto_form');

    $.when(dfdEditPhoto).then(
        function (resEditPhoto) {
          var result = resEditPhoto;
          alert(result.error_user_msg);
          window.location.reload(true);

        },
        function (resEditPhoto) {
          var result = resEditPhoto.responseJSON;
          console.log('ERR resEditPhoto=', result);
        }
    );

    return false;
  })
})();


// ADD LIKE
(function () {
  $(document).on('click', 'button.like-block__btn', function (event) {
    event.preventDefault();
    var $that = $(this);
    var photo_id = $that.data('photoid');
    var dfdLikePhoto = window.loftogram.modPhoto.addPhotoLike(photo_id);

    $.when(dfdLikePhoto).then(
        function (resLikePhoto) {
          var result = resLikePhoto;
          $that.find('.like-block__tx').text(result.data.likes.length);

        },
        function (resLikePhoto) {
          var result = resLikePhoto.responseJSON;
          console.log('ERR resLikePhoto=', result);
        }
    );

    return false;
  })
})();
