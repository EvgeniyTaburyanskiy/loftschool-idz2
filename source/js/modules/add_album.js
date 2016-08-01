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
