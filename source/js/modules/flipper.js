jQuery(document).ready(function(){

        jQuery('#reg').on('click', function(event) {
             jQuery('.flip-cnt-w').addClass('hover')
             event.stopPropagation();
        });
       
        jQuery(document).on('click', function(event) {        
             if ($(event.target).closest(".hover").length) return;
             	 jQuery('.flip-cnt-w').removeClass('hover');	
        });

        jQuery('#pass').on('click', function(event) {
             if ($(event.target).closest(".hidden").length) return;
                 jQuery('.pass-rec').removeClass('hidden');
             jQuery('.flip-cnt').addClass('hidden')
             event.stopPropagation();
        });
       
    });