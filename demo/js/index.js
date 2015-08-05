$(function() {
	$('#progressFormWrapper').progressforms({
		clickForward: true,
		clickBack: true,
		clickVisitedOnly: false,
		validateRequiredFunctions: [
			// Checks that the emails are valid
			function(fieldset) {
				var password = fieldset.find('#password').val();
				var confirmpassword = fieldset.find('#confirmpassword').val();

				return password === confirmpassword ? undefined : $('#password');
			}
		],
		callbacks: {
			onValidateRequiredFailed: function(notFilled) {
				notFilled.addClass('validate-failed');
				notFilled.focus();
			},
			onLastTabEntered: function() {
			}
		},
        ui: {
			progressBarTarget: '#myProgressBar',
            createNextButton: function() {
                return $('<button type="button" class="next">').html('Next <i class="fa fa-caret-right"></i>');
            },
            createPrevButton: function() {
                return $('<button type="button" class="prev">').html('<i class="fa fa-caret-left"></i> Previous');
            }
        }
	});
	$('#progressFormWrapper').progressforms('goToTabId', window.location.hash.slice(1));
});
