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