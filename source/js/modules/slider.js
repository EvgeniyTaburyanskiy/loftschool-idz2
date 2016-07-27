$(function() {
  $('.tile-top').on('click', function() {
    $('.bg-mask').css('z-index','4').animate({
      opacity: '1'
    }, 300);
    $('.slider-item').css('z-index','5').animate({
      opacity: '1'
    }, 300);
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
      $(this).css('z-index','-1');
    });
  });
});