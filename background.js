'use strict';

// Convenience function, useful to pass as a callback.
function log_if_chrome_error() {
	if (chrome.runtime.lastError) {
		console.error(chrome.runtime.lastError);
	}
}


function get_tv_opts(callback) {
	// TODO: Get both TV options and layout.
	var tv_opts = {
		'tv_ip': '192.168.0.105',  // String.
		'tv_port': 55000,  // Integer.
		'unique_id': 'crx-ss',  // String.
		'display_name': 'SS TV Remote'  // String.
	};
	callback(tv_opts);
}


//////////////////////////////////////////////////////////////////////
// Window-handling.

function open_options_window() {
	chrome.app.window.create('options.html', {
		'id': 'optionswindow',  // An id will preserve the window size/position.
		'innerBounds': {
			'width': 500,
			'height': 300
		}
	});
}

function open_tvremote_window() {
	get_tv_opts(function(tv_opts) {
		chrome.app.window.create('tvremote.html', {
			'id': 'tvremotewindow',  // An id will preserve the window size/position.
			//'alwaysOnTop': false,
			//'visibleOnAllWorkspaces': false,
			'frame': 'none',
			'innerBounds': {
				'width': 200,
				'height': 200
			}
		}, function(createdWindow) {
			createdWindow.contentWindow.TV_OPTS = tv_opts;
		});
	});
}


//////////////////////////////////////////////////////////////////////
// Chrome events.

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
	}, log_if_chrome_error);
	// There is no "easy" way to get the window from where the context menu was clicked.
	// chrome.contextMenus.create({
	// 	'type': 'normal',
	// 	'title': 'Close',
	// 	'id': 'menuitem_close',
	// 	'contexts': ['all']
	// }, log_if_chrome_error);
});

chrome.app.runtime.onLaunched.addListener(function() {
	open_tvremote_window();
});
