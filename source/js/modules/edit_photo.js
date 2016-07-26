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
