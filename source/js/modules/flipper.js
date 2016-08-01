jQuery(document).ready(function(){
  var switcher = false;

  jQuery('#reg').on('click', function(event) {
    jQuery('.flip-cnt-w').addClass('hover');
    event.stopPropagation();
  });

  jQuery(document).on('click', function(event) {
    var target = $(event.target);

    if ( target.closest('.card').length === 0 || target.is('.card-a') ) {
      jQuery('.flip-cnt-w').removeClass('hover');
    }

    if ( (target.closest('.card').length === 0 || target.is('.card-a')) && switcher === true) {
      switcher = false;
      jQuery('.pass-rec').addClass('hidden');
      jQuery('.flip-cnt').removeClass('hidden');
      event.stopPropagation();
    }
  });

  jQuery('#pass').on('click', function(event) {
    switcher = true;
    jQuery('.pass-rec').removeClass('hidden');
    jQuery('.flip-cnt').addClass('hidden');
    event.stopPropagation();
  });
});