'use strict';

$(document).ready(function() {
    $(".field__itx").niceScroll({
        autohidemode: "scroll",
        bouncescroll: true,
        railoffset: true,
        railpadding: { top: 10,bottom:10}
    });
    $('.dropzone').niceScroll({
        autohidemode: "scroll",
        touchbehavior: true,
        railpadding: { top: 10,bottom:10},bouncescroll: true,
        railoffset: true
    });
});