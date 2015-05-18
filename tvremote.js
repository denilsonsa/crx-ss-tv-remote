'use strict';

var TV_IP = '192.168.0.105';
var PORT = 55000;

var UNIQUE_ID = 'crx-ss';
var DISPLAY_NAME = 'SS TV Remote';

var SELF_IP = null;

var SOCKET_ID = null;
var STATUS = {
	'known_to_the_tv': null,
	'access_granted': null
};
var RECV_CALLBACK = null;


//////////////////////////////////////////////////////////////////////
// Convenience functions, just to make the code easier to write without
// worrying about details.

// Disconnects the current socket.
// Does nothing it there is no active socket.
function disconnect(callback) {
	if (SOCKET_ID !== null) {
		// console.log('Disconnecting SOCKET_ID = ' + SOCKET_ID);
		chrome.sockets.tcp.close(SOCKET_ID, function() {
			// console.log('Disconnected.');
			SOCKET_ID = null;
			if (callback) callback();
		});
	} else {
		if (callback) callback();
	}
}


// Connects the socket.
// Automatically disconnects any previous socket.
function connect(callback) {
	disconnect(function() {
		// console.log('Starting up connection to ', TV_IP, PORT);
		easy_connect(TV_IP, PORT, function(socketInfo, result) {
			SOCKET_ID = socketInfo.socketId;
			SELF_IP = socketInfo.localAddress;
			// console.log('Connected. SOCKET_ID = ' + SOCKET_ID + ', SELF_IP = ' + SELF_IP);
			if (callback) callback();
		});
	});
}


// Sends a packet.
function send(data, callback) {
	if (SOCKET_ID === null) {
		//throw 'Programming error! Socket is not connected!';
		// console.log('Not sending because there is no socket.');
		return;
	}
	// console.log('Sending a packet.');
	easy_send(SOCKET_ID, data, function() {
		// console.log('Sent a packet.');
		if (callback) callback();
	});
}


// Receives a packet.
function on_receive_handler(info) {
	if (info.socketId != SOCKET_ID) {
		return;
	}

	var response = unpack_auth_response(info.data);
	var auth_response = understand_auth_response(response);
	// console.log('Received: ', info.socketId, response.header, response.magic_string, auth_response);

	if (response.header == 2) {
		STATUS.known_to_the_tv = false;
		STATUS.access_granted = null;
	} else {  // response.header is either 0 or 1.
		STATUS.known_to_the_tv = true;
		if (auth_response == AuthResponse.GRANTED) {
			STATUS.access_granted = true;
		} else if (auth_response == AuthResponse.DENIED) {
			STATUS.access_granted = false;
		}
	}

	if (RECV_CALLBACK) {
		RECV_CALLBACK();
	}

	if (auth_response == AuthResponse.CLOSED
	|| auth_response == AuthResponse.DENIED) {
		//disconnect();
	}
}


//////////////////////////////////////////////////////////////////////
// High-level send-key functions.

function send_key(key_code, callback) {
	connect(function() {
		var auth_data = build_auth_packet(SELF_IP, UNIQUE_ID, DISPLAY_NAME);
		send(auth_data, function() {
			var key_packet = build_key_packet(key_code);
			send(key_packet, callback);
		});
	});
}


function send_multiple_keys_single_connection(keys, callback) {
	// Making a copy of the array, so that this function can make changes to
	// the copied array without changing the original one.
	var keys = keys.slice();

	function _send_multiple_keys_recursive() {
		if (keys.length < 1) {
			if (callback) callback();
			return;
		}

		var key = keys.shift();
		var key_packet = build_key_packet(key);
		send(key_packet, _send_multiple_keys_recursive);
	}

	connect(function() {
		var auth_data = build_auth_packet(SELF_IP, UNIQUE_ID, DISPLAY_NAME);
		send(auth_data, function() {
			_send_multiple_keys_recursive();
		});
	});
}

function send_multiple_keys_multiple_connections(keys, callback) {
	// Making a copy of the array, so that this function can make changes to
	// the copied array without changing the original one.
	var keys = keys.slice();

	function _send_multiple_keys_recursive() {
		if (keys.length < 1) {
			if (callback) callback();
			return;
		}

		var key = keys.shift();
		send_key(key, _send_multiple_keys_recursive);
	}
	_send_multiple_keys_recursive();
}

//////////////////////////////////////////////////////////////////////
// Layout stuff.

var LAYOUT = {
	"layout": "table",
	"rows": [
		{
			"cells": [
				{"key": "KEY_MUTE"                                       , "label": "Mute" , "color": null},
				{"key": "KEY_VOLDOWN,KEY_VOLDOWN,KEY_VOLDOWN,KEY_VOLDOWN", "label": "Vol-4", "color": null},
				{"key": "KEY_VOLDOWN"                                    , "label": "Vol-1", "color": null},
				{"key": "KEY_VOLUP"                                      , "label": "Vol+1", "color": null},
				{"key": "KEY_VOLUP,KEY_VOLUP,KEY_VOLUP,KEY_VOLUP"        , "label": "Vol+4", "color": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_TOOLS" , "label": "Tools" , "color": null},
				{"key": "KEY_UP"    , "label": "↑"     , "color": null},
				{"key": "KEY_INFO"  , "label": "Info"  , "color": null},
				{"key": "KEY_MENU"  , "label": "Menu"  , "color": null},
				{"key": "KEY_SOURCE", "label": "Source", "color": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_LEFT" , "label": "←"  , "color": null},
				{"key": "KEY_ENTER", "label": "⏎"  , "color": null},
				{"key": "KEY_RIGHT", "label": "→"  , "color": null},
				{"key": "KEY_REC"  , "label": "Rec", "color": null},
				{"key": "KEY_PLAY" , "label": "▶"  , "color": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_RETURN", "label": "↶ Return", "color": null},
				{"key": "KEY_DOWN"  , "label": "↓"       , "color": null},
				{"key": "KEY_EXIT"  , "label": "Exit"    , "color": null},
				{"key": "KEY_STOP"  , "label": "■"       , "color": null},
				{"key": "KEY_PAUSE" , "label": "⏸"       , "color": null},
			]
		},
	]
};


function create_button_table_from_layout(layout) {
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	table.classList.add('tvremote');

	var rows = layout.rows.length;
	var cols = 0;
	var i, j, tr, td, cell, button;
	for (i = 0; i < layout.rows.length; i++) {
		tr = document.createElement('tr');
		tr.style.height = (100 / rows) + 'vh';
		tbody.appendChild(tr);
		if (cols < layout.rows[i].cells.length) {
			cols = layout.rows[i].cells.length;
		}
		for (j = 0; j < layout.rows[i].cells.length; j++) {
			cell = layout.rows[i].cells[j];

			td = document.createElement('td');
			tr.appendChild(td);

			if (cell.label === null) {
				continue;
			}

			button = document.createElement('button');
			button.appendChild(document.createTextNode(cell.label));
			button.dataset.key = cell.key;
			td.appendChild(button);

			if (cell.color) {
				td.classList.add(cell.color);
			}
		}
	}

	return table;
}


//////////////////////////////////////////////////////////////////////

function tvremote_key_click_handler(ev) {
	var key = ev.target.dataset.key;
	if (key) {
		ev.preventDefault();
		ev.stopPropagation();

		// Splitting the comma-separated list. Also trimming the whitespace.
		var keys = key.split(',');
		var i;
		for (i = 0; i < keys.length; i++) {
			keys[i] = keys[i].trim();
		}

		// TODO: Add an option to switch between single-connection or
		// multiple-connections.
		send_multiple_keys_single_connection(keys);
	}
}

function thebutton_click_handler(ev) {
	send_key('KEY_VOLUP');
}

function multibutton_click_handler(ev) {
	send_multiple_keys_single_connection([
		'KEY_VOLUP',
		'KEY_VOLUP',
		'KEY_VOLUP',
		'KEY_VOLUP',
		'KEY_VOLUP',
		'KEY_VOLUP',
		'KEY_VOLUP',
		'KEY_VOLUP',
	]);
}

function experiment_click_handler() {
	connect(function() {
		var auth_data = build_auth_packet(SELF_IP, UNIQUE_ID, DISPLAY_NAME);
		send(auth_data, function() {
			var key_packet = build_key_packet('KEY_VOLUP');
			send(key_packet, function() {
				var key_packet = build_key_packet('KEY_VOLUP');
				send(key_packet, function() {
				});
			});
		});
	});
}

function update_status_ui() {
	var status_container = document.getElementById('status_container');
	var status_label = document.getElementById('status_label');
	// var status_icon = document.getElementById('status_icon');

	status_container.classList.remove('gray', 'yellow', 'green', 'red');
	if (STATUS.known_to_the_tv === true) {
		if (STATUS.access_granted === true) {
			status_container.classList.add('green');
			status_label.value = 'Ready.';
		} else if (STATUS.access_granted === false) {
			status_container.classList.add('red');
			status_label.value = 'TV remote control was DENIED.';
		} else {
			status_container.classList.add('gray');
			status_label.value = 'This should not happen.';
		}
	} else if (STATUS.known_to_the_tv === false) {
		status_container.classList.add('yellow');
		status_label.value = 'Connected, but not authorized.';
	} else {
		status_container.classList.add('gray');
		status_label.value = 'Not connected.';
	}

	// TODO: Delete these lines.
	var known = document.getElementById('known');
	var auth = document.getElementById('auth');
	known.value = STATUS.known_to_the_tv;
	auth.value = STATUS.access_granted;
}

//////////////////////////////////////////////////////////////////////
// Initialization.

function init(tab_id, bgpage) {
	var thebutton = document.getElementById('thebutton');
	thebutton.addEventListener('click', thebutton_click_handler);

	var multibutton = document.getElementById('multibutton');
	multibutton.addEventListener('click', multibutton_click_handler);

	var experiment = document.getElementById('experiment');
	experiment.addEventListener('click', experiment_click_handler);


	var layout_container = document.getElementById('layout_container');
	layout_container.addEventListener('click', tvremote_key_click_handler);

	layout_container.appendChild(create_button_table_from_layout(LAYOUT));

	RECV_CALLBACK = update_status_ui;
	update_status_ui();

	chrome.sockets.tcp.onReceive.addListener(on_receive_handler);
}

// This script is being included with the "defer" attribute, which means it
// will only be executed after the document has been parsed.
init();
