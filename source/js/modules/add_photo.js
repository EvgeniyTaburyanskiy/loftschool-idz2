'use strict';

var photoAdd = $('.add-photo-wrap'),
    photoAddCard = $('.add-photo'),
    AddPhotoBtn = $('.add-block__btn'),
    closeBtn = $('.cancel-popup__btn'),
    indexClick = 0;

$ ( function() {
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
});
$(document).on('click', (function(e) {
    if ($(e.target).closest(".add-photo").length) return;
    photoAdd.fadeOut(100);
    photoAddCard.removeClass('photoAddSlideDown');
    indexClick = 0;
    e.stopPropagation();
}));