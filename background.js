'use strict';

function log_if_error() {
	if (chrome.runtime.lastError) {
		console.error(chrome.runtime.lastError);
	}
}

function open_options_window() {
	chrome
	chrome.app.window.create('options.html', {
		'id': 'optionswindow',  // An id will preserve the window size/position.
		'innerBounds': {
			'width': 300,
			'height': 200
		}
	});
}

function open_tvremote_window() {
	chrome.app.window.create('tvremote.html', {
		'id': 'tvremotewindow',  // An id will preserve the window size/position.
		//'alwaysOnTop': false,
		//'visibleOnAllWorkspaces': false,
		'frame': 'none',
		'innerBounds': {
			'width': 200,
			'height': 200
		}
	});
}

// Having 'onclick' handler for each menu item would have been so much easier...
chrome.contextMenus.onClicked.addListener(function(info) {
	if (info.menuItemId == 'menuitem_options') {
		open_options_window();
	}
});

chrome.runtime.onInstalled.addListener(function(details) {
	chrome.contextMenus.create({
		'type': 'normal',
		'title': 'Options',
		'id': 'menuitem_options',
		'documentUrlPatterns': [ "chrome-extension://*/tvremote.html"],
		'contexts': ['all', 'launcher']
	}, log_if_error);
	// There is no "easy" way to get the window from where the context menu was clicked.
	// chrome.contextMenus.create({
	// 	'type': 'normal',
	// 	'title': 'Close',
	// 	'id': 'menuitem_close',
	// 	'contexts': ['all']
	// }, log_if_error);
});

chrome.app.runtime.onLaunched.addListener(function() {
	open_tvremote_window();
});
