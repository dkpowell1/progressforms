$(function() {
	$('#progressFormWrapper').progressforms({
		tabs: ['Personal', 'Contact', 'Your Login', 'Confirmation'],
		validateRequired: true,
		validateRequiredFunctions: [
			// Checks that the emails are valid
			function(fieldset) {
				var emailField = $(fieldset.find('#email'));
				var confirmEmailField = $(fieldset.find('#confirmemail'));
				if (emailField.val() !== confirmEmailField.val()) {
					alert('Emails must match!');
					return emailField;
				}
			},
			function(fieldset) { },
			function(fieldset) {
				if (!fieldsMatch('#password', '#confirmpassword')) {
					alert('Passwords must match!');
					return $('#password');
				}
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
            createNextButton: function() {
                return $('<button class="next">').html('Next <i class="fa fa-caret-right"></i>');
            },
            createPrevButton: function() {
                return $('<button class="prev">').html('<i class="fa fa-caret-left"></i> Previous');
            }
        }
	});
});
