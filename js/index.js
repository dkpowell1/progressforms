/**
  * @author ComFreek
  * @license MIT (c) 2013-2015 ComFreek <http://stackoverflow.com/users/603003/comfreek>
  * Please retain this author and license notice!
  */
(function (exports) {
    function valOrFunction(val, ctx, args) {
        if (typeof val == "function") {
            return val.apply(ctx, args);
        } else {
            return val;
        }
    }

    function InvalidInputHelper(input, options) {
        input.setCustomValidity(valOrFunction(options.defaultText, window, [input]));

        function changeOrInput() {
            if (input.value === "") {
                input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
            } else {
                input.setCustomValidity("");
            }
        }

        function invalid() {
            if (input.value === "") {
                input.setCustomValidity(valOrFunction(options.emptyText, window, [input]));
            } else {
               console.log("INVALID!"); input.setCustomValidity(valOrFunction(options.invalidText, window, [input]));
            }
        }

        input.addEventListener("change", changeOrInput);
        input.addEventListener("input", changeOrInput);
        input.addEventListener("invalid", invalid);
    }
    exports.InvalidInputHelper = InvalidInputHelper;
})(window);

$(function() {
	var createTodoListItem = function(name, text) {
		var listItem = $('<li class="todo-list-item">');
		var listItemContent = $('<label class="checkbox auto">');

		listItemContent.append($('<input type="checkbox">').attr('name', name));
		listItemContent.append('<i>');
		listItemContent.append('<span>' + text + '</span>');
		return listItem.append(listItemContent);
	};

	var createTodoList = function(title, listItems, list) {
		var todoList = list || $('<ul class="todo-list">');
		for (var i = 0; i < listItems.length; i++) {
			todoList.append(createTodoListItem(listItems[i], listItems[i]));
		}
		return $('<div class="todo-list-wrapper">').append($('<h3>').append(title))
												   .append(todoList);
	};

	function cleanColon(text) {
		if (text.trim().match(/(\:)$/)) {
			return text + " ";
		} else {
			return text.trim().substring(0, text.trim().length - 1) + ": ";
		}
	}

	function fieldsMatch(selectorA, selectorB) {
		return $(selectorA).val() === $(selectorB).val();
	}

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
				var todoListItems = [];
				var fieldgroups = $(".fieldgroup[data-todo]");
				for (var i = 0; i < fieldgroups.length; i++) {
					var currentFieldgroup = $(fieldgroups[i]);
					var newItemText = '';
					var labelCleaned = '<b>' + cleanColon(currentFieldgroup.find('label')[0].innerHTML) + '</b>';
					if (currentFieldgroup.find('[required]').is('select')) {
						todoListItems.push(labelCleaned + '<span class="todo-list-item-content">' + currentFieldgroup.find('select :selected').html() + '</span>');
					} else if (currentFieldgroup.find('[required]').is('input')) {
						todoListItems.push(labelCleaned + '<span class="todo-list-item-content">' + currentFieldgroup.find('[required]').val() + '</span>');
					}
				}

				$('#confirmationTabContent').html('')
										    .append('<p>Check all checkboxes below to verify that your data is correct.</p>')
											.append(createTodoList('', todoListItems));
			}
		}
	});

	$('#submit').click(function() {
		var allChecked = true;
		var checks = $('.todo-list-wrapper input[type="checkbox"]');
		for (var i = 0; i < checks.length && allChecked; i++) {
			allChecked = $(checks[i]).is(':checked');
		}
		if (allChecked) {

		} else {
			alert('Please check all checkboxes to ensure your data is correct!');
		}
	});

	$('input').keydown(function() { $(this).removeClass('validate-failed'); });
});
