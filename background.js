'use strict';

// Convenience function, useful to pass as a callback.
function log_if_chrome_error() {
	if (chrome.runtime.lastError) {
		console.error(chrome.runtime.lastError);
	}
}


// Returns a random number x, where begin <= x < end.
// Alternatively, if only a single parameter n is passed, then 0 <= x <= n.
// Undefined results if begin > end.
function randrange(begin, end) {
	if (end === undefined || end === null) {
		end = begin;
		begin = 0;
	}
	return Math.floor(Math.random() * (end - begin)) + begin;
}


// Based on https://stackoverflow.com/questions/1349404/
function generate_random_unique_id() {
	var size = 8;  // Arbitrary.
	var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var ret = '';
	for (var i = 0; i < size; i++) {
		ret += chars.charAt(randrange(chars.length));
	}
	return ret;
}


//////////////////////////////////////////////////////////////////////
// Storage-handling.

// Joins the default values for options with the given input_options; returns
// the result. Also validates the values, falling back to sane defaults in case
// of invalid values.
function complete_options(input_options) {
	if (!input_options) {  // If null or undefined.
		input_options = {};
	}
	var sane_defaults = {
		'tv_ip': '',
		'tv_port': 55000,
		'unique_id': null,
		'display_name': 'SS TV Remote',
		'macro_behavior': 'multiple_connections',
		'always_on_top': false
	};
	var ret = {};
	for (var key in sane_defaults) {
		ret[key] = sane_defaults[key];
		if (input_options[key]) {
			ret[key] = input_options[key];
		}
	}

	// Type conversion/validation.
	ret.tv_port = parseInt(ret.tv_port, 10);
	if (!ret.tv_port || ret.tv_port < 1 || ret.tv_port > 65535) {
		ret.tv_port = sane_defaults.tv_port;
	}

	// Converting to Boolean.
	ret.always_on_top = !! ret.always_on_top;

	// Random unique ID if none is saved.
	if (!ret.unique_id) {
		ret.unique_id = generate_random_unique_id();
	}

	if (ret.macro_behavior != 'multiple_connections'
	&& ret.macro_behavior != 'single_connection') {
		ret.macro_behavior = sane_defaults.macro_behavior;
	}

	return ret;
}

function get_options_from_storage(success_callback, failure_callback) {
	chrome.storage.sync.get(['options'], function(items) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			if (failure_callback) failure_callback(chrome.runtime.lastError.message);
			return;
		}

		if (success_callback) success_callback(complete_options(items.options));
	});
}

function save_options_to_storage(options, success_callback, failure_callback) {
	chrome.storage.sync.set({
		'options': complete_options(options)
	}, function(items) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			if (failure_callback) failure_callback(chrome.runtime.lastError.message);
			return;
		}

		if (success_callback) success_callback();
	});
}


//////////////////////////////////////////////////////////////////////
// Window-handling.

function open_options_window() {
	chrome.app.window.create('options.html', {
		'id': 'optionswindow',  // An id will preserve the window size/position.
		'innerBounds': {
			'width': 350,
			'height': 250
		}
	});
}

function update_tvremote_window_options() {
	get_options_from_storage(function(options) {
		var win = chrome.app.window.get('tvremotewindow');
		if (win) {
			win.contentWindow.TV_OPTS = options;
			win.setAlwaysOnTop(options.always_on_top);
		}
	});
}

function open_tvremote_window() {
	get_options_from_storage(function(options) {
		chrome.app.window.create('tvremote.html', {
			'id': 'tvremotewindow',  // An id will preserve the window size/position.
			'alwaysOnTop': options.always_on_top,
			//'visibleOnAllWorkspaces': false,
			'frame': 'none',
			'innerBounds': {
				'width': 200,
				'height': 200
			}
		}, function(createdWindow) {
			createdWindow.contentWindow.TV_OPTS = options;
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
	// Generating a random ID and saving it.
	get_options_from_storage(function(options) {
		save_options_to_storage(options);
	});

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
