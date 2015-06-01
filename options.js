'use strict';

var g_last_saved_options = {};

function set_form_values_from_options(options) {
	var form = document.getElementById('options_form');

	form.tv_ip.value = options.tv_ip;
	form.tv_port.value = options.tv_port;
	form.unique_id.value = options.unique_id;
	form.layout_id.value = options.layout_id;
	form.display_name.value = options.display_name;
	form.macro_behavior.value = options.macro_behavior;
	form.always_on_top.checked = options.always_on_top;
	form.visible_on_all_workspaces.checked = options.visible_on_all_workspaces;

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
		'layout_id': form.layout_id.value,
		'display_name': form.display_name.value,
		'macro_behavior': form.macro_behavior.value,
		'always_on_top': form.always_on_top.checked,
		'visible_on_all_workspaces': form.visible_on_all_workspaces.checked
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

	if (!chrome.app.window.canSetVisibleOnAllWorkspaces()) {
		var can_set_visible_on_all_workspaces = document.getElementById('can_set_visible_on_all_workspaces');
		can_set_visible_on_all_workspaces.title = 'Not available on your platform.';
		can_set_visible_on_all_workspaces.style.textDecoration = 'line-through';
		form.visible_on_all_workspaces.disabled = true;
	}

	chrome.runtime.getBackgroundPage(function(background) {
		form.layout_id.innerHTML = '';
		for (var i = 0; i < background.BUILTIN_LAYOUTS.length; i++) {
			var option_elem = document.createElement('option');
			option_elem.value = background.BUILTIN_LAYOUTS[i].id;
			option_elem.textContent = background.BUILTIN_LAYOUTS[i].name;
			option_elem.title = background.BUILTIN_LAYOUTS[i].description;
			form.layout_id.appendChild(option_elem);
		}

		// Loading the options and updating the form values.
		background.get_options_from_storage(set_form_values_from_options, function(message) {
			console.error(message);
			alert(message);
		});
	});
}

init();
