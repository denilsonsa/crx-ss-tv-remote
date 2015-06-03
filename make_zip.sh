#!/bin/sh

rm -f crx-ss-tv-remote.zip
zip -9Xr crx-ss-tv-remote.zip \
	background.js \
	collapsible-fieldset.js \
	icon128.png \
	icon16.png \
	icon48.png \
	keylist.js \
	layouts.js \
	manifest.json \
	options.css \
	options.html \
	options.js \
	protocol.js \
	pure-0.6.0.css \
	sample_svg_layout.svg \
	tvremote.css \
	tvremote.html \
	tvremote.js
