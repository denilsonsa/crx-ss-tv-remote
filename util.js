'use strict';

//////////////////////////////////////////////////////////////////////
// Working with Strings and Arrays and ArrayBuffers.

// Receives a plain string. Should only contain ASCII characters.
// Returns Uint8Array containing the string length in the first two bytes
// followed by the string.
function pack_string(s) {
	var bytes = (new TextEncoder('utf-8')).encode(s);  // Converting the string to Uint8Array.
	return pack_array(bytes);
}

// Receives Uint8Array.
// Returns Uint8Array containing the original array length in the first two
// bytes followed by the original array.
function pack_array(bytes) {
	var len = bytes.length;

	var ret = new Uint8Array(len + 2);  // Creating the result array.
	ret.set(bytes, 2);  // Copying the byte string to ret, offset=2.

	var dv = new DataView(ret.buffer);
	dv.setUint16(0, len, true);  // Copying 'len' to the first two bytes, little-endian.

	return ret;
}


// Returns true if a elements are equal to b elements.
// a and be should be Arrays or TypedArrays.
function arr_equal(a, b) {
	if (a.length != b.length) {
		return false;
	}
	for (var i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}


//////////////////////////////////////////////////////////////////////
// Network-related functions.

function easy_connect(ip, port, success_callback, failure_callback) {
	chrome.sockets.tcp.create({
		'bufferSize': 256
	}, function(createInfo) {
		chrome.sockets.tcp.connect(createInfo.socketId,
 		   ip, port, function(result) {
			   if (result < 0 || chrome.runtime.lastError) {
				   if (failure_callback) failure_callback(createInfo, result, chrome.runtime.lastError.message);
			   } else {
				   if (success_callback) success_callback(createInfo, result);
			   }
		   });
	});
}


function easy_send(socketId, data, success_callback) {
	if (data.buffer) {  // If data is a TypedArray or DataView.
		data = data.buffer;  // Get the ArrayBuffer behind it.
	}
	chrome.sockets.tcp.send(socketId, data, function(sendInfo) {
		if (sendInfo.resultCode < 0 || chrome.runtime.lastError) {
			if (failure_callback) failure_callback(sendInfo.resultCode, chrome.runtime.lastError.message);
		} else if (sendInfo.resultCode == 0 && sendInfo.bytesSent != data.byteLength) {
			if (failure_callback) failure_callback(sendInfo.resultCode, 'Sent only ' + sendInfo.bytesSent + ' of ' + data.length + ' bytes.');
		} else {
			if (success_callback) success_callback();
		}
	});
}
