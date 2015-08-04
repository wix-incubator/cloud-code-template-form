import * as mailSender from 'backend/mailsender';
$(function onDocumentReady() {
  'use strict';
  var $contactForm = $('.contact-form');
  var $errorMessage = $('.error');
  var $overlay = $('.overlay');
  var $overlayMessage = $('.overlay-message');
  var $successMessage = $('.success');
  var $submitButton = $('.submit-button');
  $contactForm.validate({
    errorClass: 'invalid',
    rules: {
      name: {
        required: true,
      },
      email: {
        required: true,
        email: true
      },
      phone: {
        required: false,
        regex: '[0-9\-\(\)\s]+'
      },
      message: {
        required: true
      }
    },

    invalidHandler: function (event, validator) {
      var errors = validator.numberOfInvalids();
      if (errors) {
        $errorMessage.show();
      } else {
        $errorMessage.hide();
      }
    },
    errorPlacement: function (error, element) {
      element.addClass(this.errorClass);
    }
  });

  $submitButton.click(function () {
    if ($contactForm.valid()) {
      $errorMessage.hide();
      $overlay.show();
      mailSender.sendMail($('input[name=email]').val(),
          $('input[name=name]').val(),
          $('textarea[name=message]').val(),
          $('input[name=phone]').val(),
          $('input[name=emailToIndex]').val())
        .then(function () {
          $overlay.hide();
          $successMessage.show();
          resetForm();
        }).catch(function (error) {
          onError(error);
        });
    } else {
      $successMessage.hide();
    }
  });

  function onError(error) {
    $overlayMessage.text('Oops! Something went wrong.');
    setTimeout(function () {
      $overlay.hide();
    }, 3000);
  }

  function resetForm() {
    $contactForm.find('.form-input').val('');
  }
});

//Add a custom regex validatior to the validation plugin.
$.validator.addMethod(
  'regex',
  function (value, element, regexp) {
    var re = new RegExp(regexp);
    return this.optional(element) || re.test(value);
  },
  'Please check your input.'
);
