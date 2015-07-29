;(function($, window, document, undefined) {
	/**
	 * Name of the plugin
	 */
	var pluginName = "progressforms";

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
	var container;

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

	/**
	 * Loaded settings of the plugin
	 */
	var settings;

	/**
	 * Methods for the plugin
	 */
	 var methods = {
		 init: function(options) {
	 		settings = $.extend(true, $.fn.progressforms.defaults, options);

			container = $(this);
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

			return container;
		 },
		 goToTab: function(index) {

		 }
	 };

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

	 function _createNextButton() {
		 var nextButton = settings.ui.createNextButton();
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

	 function _createPrevButton() {
		 var prevButton = settings.ui.createPrevButton();
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
		 for (var i = 0; i < fieldsets.length; i++) {
			 var nextPrevBar = $('<div class="next-prev-bar">');
			 if (i === 0) {
				 // Only add next
				 nextPrevBar.append(_createNextButton());
			 } else if (i === fieldsets.length - 1) {
				 // Only add previous
				 nextPrevBar.append(_createPrevButton());
			 } else {
				 // Add next and previous
				 nextPrevBar.append(_createPrevButton());
				 nextPrevBar.append(_createNextButton());
			 }
			 $(fieldsets[i]).append(nextPrevBar);
		 }
	 }

   $.fn.progressforms = function(options) {
	   if (methods[options]) {
		   return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
	   } else if (typeof options === 'object' || !options) {
		   return methods.init.apply(this, arguments);
	   } else {
		   $.error(options + ' is not a valid method in progressforms');
	   }
   };

   $.fn.progressforms.defaults = {
      tabs: [],
      validateRequired: true,

      /**
   	* Set this in order to override the default check per page
   	*
   	* The signature of the functions passed in should be
   	*     function(currentFieldset):object
   	*/
      validateRequiredFunctions: [],

      callbacks:  {
   	   onNext: function(tabClicked, tabEntered) { },
   	   onPrev: function(tabClicked, tabEntered) { },
   	   onLastTabEntered: function() { },
   	   onValidateRequiredFailed: function(notFilled) {
   		   alert("Please fill out all required fields!");
   		   notFilled.focus();
   	   }
      },
      ui: {
   	   createNextButton: function() { return $('<button class="next">').html("Next"); },
   	   createPrevButton: function() { return $('<button class="prev">').html("Previous"); }
      }
   };
})( jQuery, window, document );
