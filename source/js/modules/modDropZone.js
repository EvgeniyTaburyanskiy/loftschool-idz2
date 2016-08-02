(function () {
  $(document).ready(function () {
    if ($('#photoDropZone').length) {
      Dropzone.options.photoDropZone = {
        paramName:        'photos', // The name that will be used to transfer the file
        acceptedFiles:    'image/*',
        maxFilesize:      2, // MB
        uploadMultiple:   true,
        addRemoveLinks:   true,
        thumbnailWidth: 135,
        thumbnailHeight: 135,
        dictRemoveFile: "x",
        maxFiles:         10,
        autoProcessQueue: false,
        parallelUploads:  10,
        init:             function () {
          var submitButton = document.querySelector(".add-photo button.form-menu__submit"),
              myDropzone   = this; // closure

          myDropzone.on("complete", function (file) {
            if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
              window.location.reload(true);
            }
          });

          submitButton.addEventListener("click", function () {
            myDropzone.processQueue(); // Tell Dropzone to process all queued files.
          });

        }
      };
    }
  });
})();