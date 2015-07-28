(function($) {
	$.fn.progressforms = function(options) {
		/**
		 * Settings for the plugin
		 */
		var settings = $.extend(true, {
			tabs: [],
			validateRequired: true,

			/**
			 * Set this in order to override the default check per page
			 *
			 * The signature of the functions passed in should be
			 *     function(currentFieldset):boolean
			 */
			validateRequiredFunctions: [],

			callbacks:  {
				onInit: function() { },
				onNext: function(tabClicked, tabEntered) { },
				onPrev: function(tabClicked, tabEntered) { },
				onLastTabEntered: function() { },
				onValidateRequiredFailed: function(notFilled) {
					alert("Please fill out all required fields!");
					notFilled.focus();
				}
			}
		}, options);

		/**
		 * All fieldsets in the container (the element where the plugin was
		 * initialized at)
		 */
		var fieldsets;

		/**
		 * This is the generated progress bar from the tabs field in the
		 * settings
		 */
		var progressBar;

		/**
		 * All dots that mark progress of the form
		 */
		var progressBarDots;

		/**
		 * The element where the plugin was initialized at
		 */
		var container = $(this);

		/**
		 * The current "page"
		 */
		var currentIndex = 0;

		/**
		 * The current visible fieldset
		 */
		var currentFieldset;

		/**
		 * The fieldset before the current one
		 */
		var previousFieldset;

		/**
		 * Fieldset with the confirmation message
		 */
		var confirmationFieldset;

		function init() {
			fieldsets = container.children('fieldset');
			for (var i = 0; i < fieldsets.length; i++) {
				if (i !== 0) {
					$(fieldsets[i]).hide();
				}
			}

			currentFieldset = $(fieldsets[0]);
			progressBar = generateProgressBar();
			progressBarDots = progressBar.find('li');
			container.prepend(progressBar);
			setListSize();
			addPrevNextButtons();
			container.addClass('progressformswrapper');

			settings.callbacks.onInit();
		}

		function setListSize() {
			var percentage = 100.0 / progressBarDots.length;
			$(progressBarDots).each(function() {
				$(this).css('width', percentage + '%');
			});
		}

		function generateProgressBar() {
			var progressBar = $('<ul class="progressBar"></ul>');
			for (var i = 0; i < settings.tabs.length; i++) {
				var toAppend = $('<li>').html(settings.tabs[i]);
				if (i === 0) {
					toAppend.addClass('active');
				}
				progressBar.append(toAppend);
			}
			return progressBar;
		}

		function createButton(options) {
			options = $.extend( {
				text: "Next",
				classes: "next"
			}, options);
			return $('<button type="button"></button>').addClass(options.classes).html(options.text);
		}

		function createNextButton() {
			var nextButton = createButton({ text: "Next", classes: "next" });
			nextButton.click(onNextClick);
			return nextButton;
		}

		function onNextClick() {
			var notFilled = settings.validateRequired ? validateRequiredFields(currentFieldset)
											          : false;

			// Prevent current index from gettings higher than range of fieldsets
			if (currentIndex + 1 >= fieldsets.length) {
				currentIndex--;
			} else if (notFilled) {
				settings.callbacks.onValidateRequiredFailed(notFilled);
			} else {
				$(progressBarDots[currentIndex]).addClass('completed').removeClass('active');
				var tabClicked = $(progressBar[currentIndex]);
				// Increment the current index to the next fieldset
				currentIndex++;

				previousFieldset = currentFieldset;
				currentFieldset = fieldsets[currentIndex];
				if (previousFieldset) {
					$(previousFieldset).hide();
				}
				$(currentFieldset).show();
				$(progressBarDots[currentIndex]).addClass('active');

				settings.callbacks.onNext(tabClicked, currentFieldset);

				if (currentIndex === fieldsets.length - 1) {
					settings.callbacks.onLastTabEntered();
				}
			}
		}

		function validateRequiredFields(fieldset) {
			var notFilled;
			var valid = true;

			var requiredFields = $(fieldset).find('[required]');
			var i = 0;

			for (i = 0; i < requiredFields.length && notFilled === undefined; i++) {
				if ($(requiredFields[i]).is(':visible') && $(requiredFields[i]).val() === '') {
					notFilled = $(requiredFields[i]);
				}
			}

			if (!notFilled) {
				// Look for check boxes
				var requiredCheckboxGroups = $(fieldset).find('[data-required]');
				for (i = 0; i < requiredCheckboxGroups.length; i++) {
					var numRequired = parseInt($(requiredCheckboxGroups[i]).attr('data-required') || 1);
					var numChecked = 0;
					var checkboxes = $(requiredCheckboxGroups[i]).find('input[type="checkbox"]');
					var checked = false;

					for (var j = 0; j < checkboxes.length && !checked; j++) {
						if ($(checkboxes[j]).is(':checked')) {
							checked = ++numChecked == numRequired;
						}
					}

					if (!checked && checkboxes.length > 0) {
						notFilled = $(checkboxes[0]);
					}
				}
			}

			if (!notFilled && typeof settings.validateRequiredFunctions[currentIndex] == 'function') {
				notFilled = settings.validateRequiredFunctions[currentIndex](fieldset);
			}

			return notFilled;
		}

		function createPrevButton() {
			var prevButton = createButton({ text: "Previous", classes: "previous" });
			prevButton.click(onPrevClick);
			return prevButton;
		}

		function onPrevClick() {
			$(progressBarDots[currentIndex]).removeClass('active');
			// Prevent current index from gettings higher than range of fieldsets
			if (--currentIndex < 0) {
				currentIndex++;
			} else {
				$(currentFieldset).hide();
				var tabClicked = $(currentFieldset);
				currentFieldset = previousFieldset;
				previousFieldset = currentIndex > 0 ? fieldsets[currentIndex - 1] : undefined;
				$(currentFieldset).show();
				$(progressBarDots[currentIndex]).addClass('active').removeClass('completed');

				settings.callbacks.onPrev(tabClicked, currentFieldset);
			}
		}

		function addPrevNextButtons() {
			var prevButtonFields = { text: "Previous", classes: "previous" };
			var nextButtonFields = { text: "Next", classes: "next" };

			for (var i = 0; i < fieldsets.length; i++) {
				var nextPrevBar = $('<div class="progressforms-next-prev-bar">');
				if (i === 0) {
					// Only add next
					nextPrevBar.append(createNextButton());
				} else if (i === fieldsets.length - 1) {
					// Only add previous
					nextPrevBar.append(createPrevButton());
				} else {
					// Add next and previous
					nextPrevBar.append(createPrevButton());
					nextPrevBar.append(createNextButton());
				}
				$(fieldsets[i]).append(nextPrevBar);
			}

		}

		init();
	};
})( jQuery );
