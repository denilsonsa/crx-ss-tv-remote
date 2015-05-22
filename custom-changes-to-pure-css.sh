#!/bin/sh

curl -o pure-0.6.0-min.css http://yui.yahooapis.com/pure/0.6.0/pure-min.css

sed -i '
	s/\(@media only screen and (max-width \):[0-9.]\+px)/\1:360px)/
	s/\(\.pure-form-aligned \.pure-control-group label\) \?{/\1.pure-checkbox,\1.pure-radio{margin-left:11em}\1:not(.pure-checkbox):not(.pure-radio) {/
	' pure-0.6.0-min.css
