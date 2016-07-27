$(function() {

  $(document).on('click', function (event) {
    var target = $(event.target),
        offset = $(window).scrollTop() + 25;

    if (target.closest('.a-tile-top').length === 1 ||
        target.closest('.tile-top').length === 1 || target.is('.a-tile-menu__a')) {

      event.preventDefault();

      $('.bg-mask').css('z-index','4').animate({
        opacity: '1'
      }, 300);
      $('.slider-item').css('z-index','5').animate({
        top: offset + 'px',
        opacity: '1'
      }, 300);
    }
  });

  $('.bg-mask').on('click', function() {

    $(this).animate({
      opacity: '0'
    }, 200, function() {
      $(this).css('z-index','-1');
    });
    $('.slider-item').animate({
      opacity: '0'
    }, 200, function() {
      $(this).css({
        'z-index': '-1',
        'top': '-100%'
      });
    });
  });
});