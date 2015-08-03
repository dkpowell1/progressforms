$(function() {
	$('#progressFormWrapper').progressforms({
		tabs: ['Personal', 'Contact', 'Your Login', 'Confirmation'],
		validateRequired: false,
		validateRequiredFunctions: [
			// Checks that the emails are valid
			function(fieldset) {
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
