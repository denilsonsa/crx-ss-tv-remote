'use strict';

var g_last_saved_options = {};

function set_form_values_from_options(options) {
	var form = document.getElementById('options_form');

	form.tv_ip.value = options.tv_ip;
	form.tv_port.value = options.tv_port;
	form.unique_id.value = options.unique_id;
	form.display_name.value = options.display_name;
	form.macro_behavior.value = options.macro_behavior;
	form.always_on_top.checked = options.always_on_top;

	var submit_button = document.getElementById('submit_button');
	submit_button.disabled = true;
	g_last_saved_options = options;
}

function hide_toaster_message() {
	var toaster = document.getElementById('toaster');
	toaster.style.opacity = 0.0;
	setTimeout(function() {
		toaster.style.display = 'none';
	}, 1000);
}

function show_toaster_message(message, timeout) {
	var toaster = document.getElementById('toaster');
	toaster.textContent = message;
	toaster.style.display = 'block';
	setTimeout(function() {
		toaster.style.opacity = 1.0;
		setTimeout(hide_toaster_message, timeout);
	}, 10);
}

function form_element_input_handler(ev) {
	var submit_button = document.getElementById('submit_button');
	if (ev.target.value != g_last_saved_options[ev.target.name]) {
		submit_button.disabled = false;
	}
}
function form_element_change_handler(ev) {
	submit_button.disabled = false;
}

function form_submit_handler(ev) {
	if (ev) {
		ev.preventDefault();
		ev.stopPropagation();
	}

	var form = document.getElementById('options_form');
	var options = {
		'tv_ip': form.tv_ip.value,
		'tv_port': form.tv_port.value,
		'unique_id': form.unique_id.value,
		'display_name': form.display_name.value,
		'macro_behavior': form.macro_behavior.value,
		'always_on_top': form.always_on_top.checked
	}

	chrome.runtime.getBackgroundPage(function(background) {
		background.save_options_to_storage(options, function() {
			var submit_button = document.getElementById('submit_button');
			submit_button.disabled = true;
			show_toaster_message('Saved!', 5000);
			background.update_tvremote_window_options();
		}, function(message) {
			console.error(message);
			alert(message);
		});
	});
}

function init() {
	var form = document.getElementById('options_form');
	form.addEventListener('submit', form_submit_handler);

	// OnInput works for most form elements.
	form.addEventListener('input', form_element_input_handler);
	// OnChange is required for checkboxes (because they do not trigger onInput).
	form.addEventListener('change', form_element_change_handler);

	var close_button = document.getElementById('close_button');
	close_button.addEventListener('click', function(ev) {
		window.close();
	});

	chrome.runtime.getBackgroundPage(function(background) {
		background.get_options_from_storage(set_form_values_from_options, function(message) {
			console.error(message);
			alert(message);
		});
	});
}

init();
