$(function() {
  if ( $('body').find('.slider-item').length ) {
    /*
     *  Slider pop-up part
     *
     */
    $(function() {
      var switcher = false,
        slideControls = $('.slide-controls'),
        slideItem = $('.slider-item');

      slideItem.css({
        'max-height':'calc(100% - 50px)',
        'overflow':'scroll'
      });

      //invokes slider
      $(document).on('click', function (event) {
        var target = $(event.target),
          offset = $(window).scrollTop() + 25;

        if (target.closest('.a-tile-top').length === 1 ||
          target.closest('.tile-top').length === 1 || target.is('.a-tile-menu__a')) {

          event.preventDefault();
          window.onscroll = function () { window.scrollTo(0, offset - 25); };

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
          slideItem.niceScroll({
            zindex: 9999,
            cursorcolor:"#fff",
            cursoropacitymin:".5",
            cursorwidth:"10px",
            cursorborderradius:"1px",
            // autohidemode: "scroll",
            bouncescroll: true,
            railoffset: true,
            railpadding: {right: -10}
          });
        }
      });

      //fades slider
      $(document).on('click', function (event) {
        var target = $(event.target);

        if ( target.is('.bg-mask') ) {
          window.onscroll = null;

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

      //controls appear & fade for better UX(UI) (no longer needed)
      $(window).on('scroll', function() {
        var cOffset = slideControls.offset().top,
          sOffset = slideItem.offset().top,
          controlsOffset = cOffset + slideControls.height() / 2,
          slideOffset = sOffset + slideItem.height();

        if ( (controlsOffset > slideOffset || controlsOffset < sOffset) && switcher === false ) {
          switcher = true;

          $(this).on('scroll', function (e) {
            e.preventDefault();
          });

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
  }
});