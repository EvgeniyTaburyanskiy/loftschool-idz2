'use strict';


$(function () {

  var photo      = $('.photo-edit-wrap'),
      photoCard  = $('.photo-edit'),
      editPhoto  = $('.a-tile-menu__svg'),
      closeBtn   = $('.cancel-popup__btn'),
      editForm   = photoCard.find('form'),
      indexClick = 0;

  var photo_id = editForm.find('input[name="photo_id"]');
  var photo_name = editForm.find('input[name="photo_name"]');
  var photo_descr = editForm.find('textarea[name="photo_descr"]');
  var delete_confirm = editForm.find('input[name="confirmed"]');

  editPhoto.on('click', ( function (e) {
    var photoTile = $(e.target).closest('.a-photo-tile');

    if (indexClick === 0) {
      photo.fadeIn(100);
      photoCard.addClass('photoSlideDown');
      indexClick = 1;

      photo_id.val(photoTile.attr('id'));

      if (window.loftogram) {
        var dfdPhotoInfo = window.loftogram.modPhoto.getPhotoById(photo_id.val());
        $.when(dfdPhotoInfo)
        .then(
            function (resPhotoInfo) {
              var result = resPhotoInfo;

              if (result.data.length) {
                photo_name.val(result.data[0].name);
                photo_descr.val(result.data[0].descr);
              }
              
            },
            function (resPhotoInfo) {
              var result = resPhotoInfo.responseJSON;
            }
        );

      }
    }
    else {
      photo.fadeOut(100);
      photoCard.removeClass('photoSlideDown');
      indexClick = 0;
    }
    e.stopPropagation();
  }));

  closeBtn.on('click', function () {
    photo.fadeOut(100);
    photoCard.removeClass('photoSlideDown');
  });

  $(document).on('click', '.photo-edit button.delete-block__btn', function (e) {
    delete_confirm.val("Y");
    editForm.submit();
    delete_confirm.val("N");
    photo.fadeOut(100);
    photoCard.removeClass('photoSlideDown');
  });


  $(document).on('click', (function (e) {
    if ($(e.target).closest(".photo-edit").length) return;
    photo.fadeOut(100);
    photoCard.removeClass('photoSlideDown');
    indexClick = 0;
    e.stopPropagation();
  }));
});
