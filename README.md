progressforms
===

This JQuery plugin utilizes the tutorial for a multi-step JQuery form
with a progress bar found [here](http://codepen.io/atakan/pen/gqbIz).

### How to Use

#### Initialization
In order to initialize progressforms, you must call the function on an element that has children that are fieldsets. The way that the plug-in separates the form into segments is by using segments that are the first set of children underneath the HTML element of which `progressforms()` was invoked. Below is an example of a structure that would work for the plug-in.

    <div id="progressforms-wrapper">
		<fieldset>
            <label for="name">Name:</label>
            <input id="name">
        </fieldset>
		<fieldset>
            <label for="email">Email:</label>
            <input id="email" type="email">
        </fieldset>
        <fieldset>
            <input type="submit" value="Submit">
        </fieldset>
	</div>

And then to make initialize the function, you need to be sure to have JQuery on the page as well as the script for this plug in like so:

    <script src="path/to/jquery"></script>
    <script src="path/to/progressforms"></script>

And then to initialize the plug-in on an element, simply run the following:

    $(function() {
        $('#progressforms-wrapper').progressforms({
            tabs: ['Name', 'Email', 'Submit']
        });
    });

The tabs field in the object passed into progress forms determines what the titles of the "pages" are for each section in the form. This is what will show up in the progress bar.

#### Required Fields
Progressforms automatically validates that all fields that have the required attribute are actually filled out before continuing to the next tab. This can also be set up to work for check boxes where a minimum amount need to be checked. In order for this to work, the check boxes need to be wrapped in a containing element with the attribute `data-required` on it. The attribute can also have a value to specify how many check boxes must be checked in order for the requirement to be satisfied. Below is an example of how to set up a check box group.

    <div id="progressforms-wrapper">
        <fieldset>
            <label>Check one or more.</label>

            <!-- Only one check box needs to be checked to move on -->
            <div data-required="1">
                <input type="checkbox" id="chk1">
                <input type="checkbox" id="chk2">
                <input type="checkbox" id="chk3">
            </div>
        </fieldset>
        <fieldset>

            <!-- Now two check boxes needs to be checked to move on -->
            <label>Check two or more.</label>
            <div data-required="2">
                <input type="checkbox" id="chk1">
                <input type="checkbox" id="chk2">
                <input type="checkbox" id="chk3">
            </div>
        </fieldset>
    </div>

### Demo
To see a styled example of the page, clone this project and open up index.html in the browser.

### Contributors
  1. Anthony Benavente
  2. Daniel Powell
