'use strict';

var profile = $('.edit-profile-wrap'),
    profileCard = $('.edit-profile'),
    editProfile = $('.m-controls .edit-block__btn'),
    closeBtn = $('.cancel-popup__btn'),
    indexClick = 0;

$ ( function() {
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
});
$(document).on('click', (function(e) {
    if ($(e.target).closest(".edit-profile").length) return;
    profile.fadeOut(100);
    profileCard.removeClass('profileSlideDown');
    indexClick = 0;
    e.stopPropagation();
}));