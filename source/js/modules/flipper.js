jQuery(document).ready(function(){

        jQuery('.card-a').on('click', function(event) {
             jQuery('.flip-cnt-w').addClass('hover')
             event.stopPropagation();
        });
       
        jQuery(document).on('click', function(event) {        
             if ($(event.target).closest(".hover").length) return;
             	 jQuery('.flip-cnt-w').removeClass('hover');	
        });

        jQuery('.card__a').on('click', function(event) {
             //jQuery('.flip-cnt-w').addClass('hidden')
             jQuery('.pass-rec').removeClass('hidden')
             event.stopPropagation();
        });
       
    });