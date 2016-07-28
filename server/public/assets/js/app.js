'use strict';
(function() {


})();

'use strict';


$ ( function() {

    var albumAdd = $('.add__album-wrap'),
        albumAddCard = $('.add__album'),
        AddAlbumBtn = $('.albums-controls .add-block__btn'),
        closeBtn = $('.cancel-popup__btn'),
        indexClick = 0;


    AddAlbumBtn.on('click',( function(e) {
        if (indexClick === 0) {
            albumAdd.fadeIn(100);
            albumAddCard.addClass('addAlbumSlideDown');
            indexClick = 1;
        }
        else {
            albumAdd.fadeOut(100);
            albumAddCard.removeClass('addAlbumSlideDown');
            indexClick = 0;
        }
        e.stopPropagation();
    }));
    closeBtn.on('click',function () {
        albumAdd.fadeOut(100);
        albumAddCard.removeClass('addAlbumSlideDown');
    });

    $(document).on('click', (function(e) {
        if ($(e.target).closest(".add__album").length) return;
        albumAdd.fadeOut(100);
        albumAddCard.removeClass('addAlbumSlideDown');
        indexClick = 0;
        e.stopPropagation();
    }));
});

'use strict';


$ ( function() {

    var photoAdd = $('.add-photo-wrap'),
        photoAddCard = $('.add-photo'),
        AddPhotoBtn = $('.add-block__btn'),
        closeBtn = $('.cancel-popup__btn'),
        indexClick = 0;


    AddPhotoBtn.on('click',( function(e) {
        if (indexClick === 0) {
            photoAdd.fadeIn(100);
            photoAddCard.addClass('photoAddSlideDown');
            indexClick = 1;
        }
        else {
            photoAdd.fadeOut(100);
            photoAddCard.removeClass('photoAddSlideDown');
            indexClick = 0;
        }
        e.stopPropagation();
    }));
    closeBtn.on('click',function () {
        photoAdd.fadeOut(100);
        photoAddCard.removeClass('photoAddSlideDown');
    });

    $(document).on('click', (function(e) {
        if ($(e.target).closest(".add-photo").length) return;
        photoAdd.fadeOut(100);
        photoAddCard.removeClass('photoAddSlideDown');
        indexClick = 0;
        e.stopPropagation();
    }));
});

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
'use strict';

$(document).ready(function() {
    $(".field__itx").niceScroll({
        autohidemode: "scroll",
        bouncescroll: true,
        railoffset: true,
        railpadding: { top: 10,bottom:10}
    });
});
$(function() {
  if ( $('body').find('.a-h-w') ) {
    var switcher = false;

    if ( switcher === false ) {
      $('.edit-block__btn').on('click', function () {
        $('.a-h-cnt').animate({
          top: 0
        }, 300, function() {
          switcher = true;
        });
      });
    }

    $(document).on('click', function (event) {
      var target = $(event.target);

      if ( switcher === true ) {
        if ( target.closest('.a-h-cnt__form').length === 0 || target.is('#reset') ) {
          $('.a-h-cnt').animate({
            top: '-100%'
          }, 300, function() {
            switcher = false;
          });
        }
      }
    });
  }
});
'use strict';


$ ( function() {

    var photo = $('.photo-edit-wrap'),
        photoCard = $('.photo-edit'),
        editPhoto = $('.a-tile-menu__svg'),
        closeBtn = $('.cancel-popup__btn'),
        indexClick = 0;


    editPhoto.on('click',( function(e) {
        if (indexClick === 0) {
            photo.fadeIn(100);
            photoCard.addClass('photoSlideDown');
            indexClick = 1;
        }
        else {
            photo.fadeOut(100);
            photoCard.removeClass('photoSlideDown');
            indexClick = 0;
        }
        e.stopPropagation();
    }));
    closeBtn.on('click',function () {
        photo.fadeOut(100);
        photoCard.removeClass('photoSlideDown');
    });
    $(document).on('click', (function(e) {
        if ($(e.target).closest(".photo-edit").length) return;
        photo.fadeOut(100);
        photoCard.removeClass('photoSlideDown');
        indexClick = 0;
        e.stopPropagation();
    }));
});

'use strict';


$ ( function() {

    var profile = $('.edit-profile-wrap'),
        profileCard = $('.edit-profile'),
        editProfile = $('.m-controls .edit-block__btn'),
        closeBtn = $('.cancel-popup__btn'),
        indexClick = 0;


    editProfile.on('click',( function(e) {
        if (indexClick === 0) {
            profile.fadeIn(100);
            profileCard.addClass('profileSlideDown');
            indexClick = 1;
        }
        else {
            profile.fadeOut(100);
            profileCard.removeClass('profileSlideDown');
            indexClick = 0;
        }
        e.stopPropagation();
    }));
    closeBtn.on('click',function () {
        profile.fadeOut(100);
        profileCard.removeClass('profileSlideDown');
    });
    $(document).on('click', (function(e) {
        if ($(e.target).closest(".edit-profile").length) return;
        profile.fadeOut(100);
        profileCard.removeClass('profileSlideDown');
        indexClick = 0;
        e.stopPropagation();
    }));
});

jQuery(document).ready(function(){

        jQuery('#reg').on('click', function(event) {
             jQuery('.flip-cnt-w').addClass('hover')
             event.stopPropagation();
        });
       
        jQuery(document).on('click', function(event) {        
             if ($(event.target).closest(".hover").length) return;
             	 jQuery('.flip-cnt-w').removeClass('hover');	
        });

        jQuery('#pass').on('click', function(event) {
             if ($(event.target).closest(".hidden").length) return;
                 jQuery('.pass-rec').removeClass('hidden');
             jQuery('.flip-cnt').addClass('hidden')
             event.stopPropagation();
        });
       
    });
$(document).ready(function () {

  var layer = $('.parallax').find('.parallax-layer'); // Выбираем все parallax__layer в объект

  $(window).on('mousemove', function (e) { // Навешиваем событие перемещени мыши на window, первым аргументом в функцию-обработчик события отправляется ссылка на объект события
    var mouse_dx = (e.pageX); // Узнаем положение мышки по X
    var mouse_dy = (e.pageY); // Узнаем положение мышки по Y
    // Т.к. мы делим экран на четыре части что бы в центре оказалась точка координат 0, то нам надо знать когда у нас будет -Х и +Х, -Y и +Y
    var w = (window.innerWidth / 2) - mouse_dx; // Вычисляем для x перемещения
    var h = (window.innerHeight / 2) - mouse_dy; // Вычисляем для y перемещения

    layer.map(function (key, value) { // Проходимся по всем элементам объекта
      var bottomPosition = ((window.innerHeight / 2) * (key / 400)); // Вычисляем на сколько нам надо опустить вниз наш слой что бы при перемещении по Y не видно было краев
      var widthPosition = w * (key / 400); // Вычисляем коофицент смешения по X
      var heightPosition = h * (key / 400); // Вычисляем коофицент смешения по Y
      $(value).css({ // Выбираем элемент и добавляем css
        'bottom': '-' + bottomPosition + 'px',  // Выставляем bottom
        'transform': 'translate3d(' + widthPosition + 'px, ' + heightPosition + 'px, 0)', // Используем translate3d для более лучшего рендеринга на странице
      });
    });
  });
})
/*
 *  Slider pop-up part
 *
 */

$(function() {

  var switcher = false,
      slideControls = $('.slide-controls'),
      slideItem = $('.slider-item');

//invokes slider
  $(document).on('click', function (event) {
    var target = $(event.target),
        offset = $(window).scrollTop() + 25;

    if (target.closest('.a-tile-top').length === 1 ||
        target.closest('.tile-top').length === 1 || target.is('.a-tile-menu__a')) {

      event.preventDefault();

      slideControls.css({'left':'0'}).animate({
        opacity: 1
      }, 300);
      $('.bg-mask').css('z-index','4').animate({
        opacity: '1'
      }, 300);
      slideItem.css('z-index','5').animate({
        top: offset + 'px',
        opacity: '1'
      }, 300);
    }
  });

//fades slider
  $(document).on('click', function (event) {
    var target = $(event.target);

    if ( target.is('.bg-mask') ) {
      $('.bg-mask').animate({
        opacity: '0'
      }, 200, function() {
        $(this).css('z-index','-1');
      });

      slideItem.animate({
        opacity: '0'
      }, 200, function() {
        $(this).css({
          'z-index': '-1',
          'top': '-100%'
        });
      });
    }
  });

//controls appear & fade for better UX(UI)
  $(window).on('scroll', function() {
    var cOffset = slideControls.offset().top,
        sOffset = slideItem.offset().top,
        controlsOffset = cOffset + slideControls.height() / 2,
        slideOffset = sOffset + slideItem.height();

    if ( (controlsOffset > slideOffset || controlsOffset < sOffset) && switcher === false ) {
      switcher = true;

      slideControls.animate({
        opacity: 0
      }, 200, function() {
        $(this).css({'left':'-200%'});
      });
    } else if ( (controlsOffset <= slideOffset && controlsOffset >= sOffset) && switcher === true ) {
      switcher = false;

      slideControls.css({'left':'0'}).animate({
        opacity: 1
      }, 200);
    }
  });
});

/*
 *  Slider sliding part
 *
 */

$(function() {
  var index = 0;

  if ( $(document).find('.photo-tile').length > 0 ) {
    var slides = $(document).find('.photo-tile');
  } else if ( $(document).find('.a-photo-tile').length > 0 ) {
    slides = $(document).find('.a-photo-tile');
  }

  for (var i = 0; i < slides.length; i++) {
    slides[i].setAttribute( 'data-slide', i + 1 );
  }

  $(document).on('click', function (event) {
    var target = $(event.target);

    if (target.closest('.a-tile-top').length === 1 ||
      target.closest('.tile-top').length === 1 || target.is('.a-tile-menu__a')) {

      index = +target.closest('.photo-tile').attr('data-slide');

      var src = slides[index - 1].querySelector('.tile-top__img').getAttribute('src');
      console.log(src);
      $('.slider-top__img').attr('src', src);
    }
  });

  $('.slide-controls__btn_right').on('click', function() {

    $('.slider-item').animate({
      opacity : 0
    }, 300, function() {
      if (slides[index]) {
        index += 1;
      } else { index = 1; }

      var src = slides[index - 1].querySelector('.tile-top__img').getAttribute('src');

      $('.slider-top__img').attr('src', src);

      $(this).animate({
        opacity : '1'
      }, 300);
    });
  });

  $('.slide-controls__btn_left').on('click', function() {

    $('.slider-item').animate({
      opacity : 0
    }, 300, function() {
      if (slides[index - 2]) {
        index -= 1;
      } else { index = slides.length; }

      var src = slides[index - 1].querySelector('.tile-top__img').getAttribute('src');

      $('.slider-top__img').attr('src', src);

      $(this).animate({
        opacity : '1'
      }, 300);
    });
  });
});

//smooth scroll (links href = elements id)
$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {

    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  });
});
//# sourceMappingURL=maps/app.js.map
