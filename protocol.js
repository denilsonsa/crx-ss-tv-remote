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
	ret.set(bytes, 2);  // Copying the original array to ret, offset=2.

	var dv = new DataView(ret.buffer);
	dv.setUint16(0, len, true);  // Copying 'len' to the first two bytes, little_endian=true.

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
// Low-level protocol-related stuff.
// Packing and unpacking protocol data.

var MAGIC_STRING = 'iphone.iapp.samsung';
var PACKED_MAGIC_STRING = pack_string(MAGIC_STRING);


var AuthResponse = {
	GRANTED: 'GRANTED',
	DENIED: 'DENIED',
	UNKNOWN: 'UNKNOWN'
};


// Returns Uint8Array.
function build_auth_packet(self_ip, unique_id, display_name) {
	// btoa is base64 encoder.
	var s1 = pack_string(btoa(self_ip));
	var s2 = pack_string(btoa(unique_id));
	var s3 = pack_string(btoa(display_name));

	var payload = new Uint8Array(2 + s1.length + s2.length + s3.length);
	payload[0] = 0x64;
	payload[1] = 0x00;
	payload.set(s1, 2);
	payload.set(s2, 2 + s1.length);
	payload.set(s3, 2 + s1.length + s2.length);

	var ms = PACKED_MAGIC_STRING;
	var pp = pack_array(payload);

	var ret = new Uint8Array(1 + ms.length + pp.length);
	ret[0] = 0;
	ret.set(ms, 1);
	ret.set(pp, 1 + ms.length);

	return ret;
}


function unpack_auth_response(bytes) {
	var buffer = bytes;  // The argument should be an ArrayBuffer.
	if (bytes.buffer) {  // If the argument is a TypedArray or DataView.
		buffer = bytes.buffer;  // Get the ArrayBuffer behind it.
	}

	var dv = new DataView(buffer);
	var index = 0;

	var header = dv.getUint8(index);
	index += 1;
	var str_len = dv.getUint16(index, true);  // Little-endian.
	index += 2;
	var magic_string = new Uint8Array(buffer, index, str_len);
	index += str_len;
	var payload_len = dv.getUint16(index, true);  // Little-endian.
	index += 2;
	var payload = new Uint8Array(buffer, index, payload_len);

	return {
		'header': header,  // 8-bit unsigned integer.
		'magic_string': (new TextDecoder('utf-8')).decode(magic_string),  // String.
		'payload': payload  // Uint8Array.
	};
}


// Returns an AuthResponse value.
// Note that the protocol has been reverse-engineered, but not all messages are
// completely understood.
function understand_auth_response(response) {
	// The meaning of response.header is unknown.
	if (response.header < 0x00 || response.header > 0x02) {
		console.warn('Unknown header has been received: ', response.header);
	}

	if (response.magic_string != 'iapp.samsung'
	&& response.magic_string != 'iphone.livingroom.iapp.samsung'
	&& response.magic_string != 'unknown.livingroom.iapp.samsung') {
		console.warn('Unknown magic_string has been received: ', response.magic_string);
	}

	var payload = response.payload;
	var known_payloads = [
		[0x64, 0x00, 0x01, 0x00],  // GRANTED
		[0x64, 0x00, 0x00, 0x00],  // DENIED
		[0x0A, 0x00, 0x01, 0x00, 0x00, 0x00],  // A dialog has closed at the TV. Also received after some actions (such as KEY_PRECH).
		[0x0A, 0x00, 0x02, 0x00, 0x00, 0x00],  // A dialog is open at the TV (e.g. permission request, source, tools, menu, contents).
		[0x0A, 0x00, 0x03, 0x00, 0x00, 0x00],  // Unknown.
		[0x0A, 0x00, 0x07, 0x00, 0x00, 0x00],  // Received after pressing KEY_PICTURE_SIZE).
		[0x0A, 0x00, 0x15, 0x00, 0x00, 0x00],  // A dialog (which one?) has closed at the TV.
		[0x0A, 0x00, 0x18, 0x00, 0x00, 0x00],  // A "channel" dialog (e.g. guide, ch list) is open at the TV.
		[0x2C, 0x01, 0x00, 0x00],  // Permission has been deleted.
		[0x2C, 0x01, 0x01, 0x00],  // Permission has been changed to DENIED.
		[0x65, 0x00],  // CLOSED
		[0x00, 0x00, 0x00, 0x00]  // CLOSED
	];
	var i = 0;
	var is_known = false;
	for (i = 0; i < known_payloads.length; i++) {
		if (arr_equal(payload, known_payloads[i])) {
			is_known = true;
			break;
		}
	}
	if (!is_known) {
		console.warn('Unknown payload has been received: ', payload);
	}

	// console.log(response.header, payload);
	if (payload[0] == 0x64) {
		if (payload[2] == 0x01) {
			return AuthResponse.GRANTED;
		} else if (payload[2] == 0x00) {
			return AuthResponse.DENIED;
		}
	} else if (payload[0] == 0x0A) {
		return AuthResponse.UNKNOWN;
	} else if (payload[0] == 0x2C) {
		if (payload[2] == 0x01) {
			return AuthResponse.DENIED;
		}
		return AuthResponse.UNKNOWN;
	} else if (payload[0] == 0x65 || payload[0] == 0x00) {
		return AuthResponse.UNKNOWN;
	}
	return AuthResponse.UNKNOWN;
}


// Returns Uint8Array.
function build_key_packet(key_code) {
	// btoa is base64 encoder.
	var kc = pack_string(btoa(key_code));

	var payload = new Uint8Array(3 + kc.length);
	payload [0] = 0x00;
	payload [1] = 0x00;
	payload [2] = 0x00;
	payload.set(kc, 3);

	var ms = PACKED_MAGIC_STRING;
	var pp = pack_array(payload);

	var ret = new Uint8Array(1 + ms.length + pp.length);
	ret[0] = 0;
	ret.set(ms, 1);
	ret.set(pp, 1 + ms.length);

	return ret;
}
