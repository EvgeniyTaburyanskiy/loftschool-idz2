'use strict';

(function () {
  $("#loginForm").submit(function (e) {
    var url = "/auth/login"; // the script where you handle the form input.

    $.ajax({
      type:    "POST",
      url:     url,
      data:    $("#loginForm").serialize(), // serializes the form's elements.
      success: function (data) {
        console.log(data); // show response from the php script.
      }
    });

    e.preventDefault(); // avoid to execute the actual submit of the form.
  });

})();
