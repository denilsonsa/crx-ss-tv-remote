'use strict';

window.addEventListener('load', function() {
	var toggle_collapsed = function(ev) {
		var fieldset = ev.target;
		while (fieldset && fieldset.tagName.toLowerCase() !== 'fieldset') {
			fieldset = fieldset.parentNode;
		}
		if (!fieldset) {
			return;
		}
		fieldset.classList.toggle('collapsed');
		ev.stopPropagation();
	}

	var elems = document.querySelectorAll('fieldset.collapsible > legend');
	for (var i = 0; i < elems.length; i++) {
		elems[i].addEventListener('click', toggle_collapsed);
	}
});
