import * as mailSender from 'backend/mailsender'

$(document).ready(function () {
	$('.contact-form').validate({
		errorClass: 'invalid',
		rules: {
			name: {
				required: true,
			},
			email: {
				required: true,
				email:true
			},
			phone: {
				required: false,
				regex:"[0-9\-\(\)\s]+"
			},
			message: {
				required: true
			}
		},
		invalidHandler: function(event, validator) {
		    var errors = validator.numberOfInvalids();
		    if (errors) {
		      $('div.error').show();
		    } else {
		      $('div.error').hide();
			}
		},
		errorPlacement: function(error, element) {
			element.addClass(this.errorClass);
		}
	});

	$('.submit-button').click(function () {
		if ($('.contact-form').valid()) {
			$('div.error').hide();
			$('div.overlay').show();

			mailSender.sendMail($('input[name=email]').val(),
								$('input[name=name]').val(),
								$('textarea[name=message]').val(),
								$('input[name=phone]').val(),
								$('input[name=emailToIndex]').val()
								)
			.then(function(){
				$('div.overlay').hide();
				$('div.success').show();
				resetForm();
			}).catch(function(error){
				console.log(error);
				onError();
			});
		} else {
			$('div.success').hide();
		}
	});

	function onError() {
		$('.overlay span').text('Ooops something went wrong!');
		setTimeout(function(){ $('div.overlay').hide(); }, 3000);
	}

	function resetForm() {
		$('.contact-form').find("input[type=text], textarea").val("");
	}
});

//Add a custom regex validatior to the validation plugin.
$.validator.addMethod(
    "regex",
    function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    },
    "Please check your input."
);
