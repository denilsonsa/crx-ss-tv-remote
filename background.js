'use strict';

chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('tvremote.html', {
		'id': 'devwindow',  // An id will preserve the window size/position.
		//'alwaysOnTop': false,
		//'visibleOnAllWorkspaces': false,
		'frame': 'none',
		'innerBounds': {
			'width': 200,
			'height': 200
		}
	});
});
