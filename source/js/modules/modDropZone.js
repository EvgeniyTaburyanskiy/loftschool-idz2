(function () {
  $(document).ready(function () {
    if ($('#photoDropZone').length) {
      Dropzone.options.photoDropZone = {
        paramName:        'photos', // The name that will be used to transfer the file
        acceptedFiles:    'image/*',
        maxFilesize:      2, // MB
        uploadMultiple:   true,
        addRemoveLinks:   true,
        maxFiles:         10,
        autoProcessQueue: false,
        parallelUploads:  10,
        init:             function () {
          var submitButton = document.querySelector(".add-photo button.form-menu__submit"),
              myDropzone   = this; // closure

          myDropzone.on("success", function (file, responseText) {
            // Handle the responseText here. For example, add the text to the preview element:
            //console.log(responseText);
            //file.previewTemplate.appendChild(document.createTextNode(responseText));
          });

          submitButton.addEventListener("click", function () {
            myDropzone.processQueue(); // Tell Dropzone to process all queued files.
          });

        }
      };
    }
  });
})();