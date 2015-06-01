'use strict';

var BUILTIN_LAYOUTS = [
{
	"id": "samsung5000",
	"name": "Samsung 5000",
	"description": "Layout based on remote control for Samsung 5000 series TVs.",
	"layout": "grid",
	"fontSize": "6vw",
	"defaultWinSize": [200, 700],
	"rows": [
		{
			"cells": [
				// In the future, we can use \u23FB for Power: http://unicodepowersymbol.com/
				{"key": "KEY_POWER" , "label": "Power" , "css": "color-red"},
				{"key": "KEY_HDMI"  , "label": "HDMI"  , "css": null},
				{"key": "KEY_SOURCE", "label": "Source", "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_1", "label": "1", "css": "text-large color-white"},
				{"key": "KEY_2", "label": "2", "css": "text-large color-white"},
				{"key": "KEY_3", "label": "3", "css": "text-large color-white"},
			]
		},
		{
			"cells": [
				{"key": "KEY_4", "label": "4", "css": "text-large color-white"},
				{"key": "KEY_5", "label": "5", "css": "text-large color-white"},
				{"key": "KEY_6", "label": "6", "css": "text-large color-white"},
			]
		},
		{
			"cells": [
				{"key": "KEY_7", "label": "7", "css": "text-large color-white"},
				{"key": "KEY_8", "label": "8", "css": "text-large color-white"},
				{"key": "KEY_9", "label": "9", "css": "text-large color-white"},
			]
		},
		{
			"cells": [
				{"key": "KEY_PLUS100", "label": "—"     , "css": "text-large"},
				{"key": "KEY_0"      , "label": "0"     , "css": "text-large color-white"},
				{"key": "KEY_PRECH"  , "label": "Pre-CH", "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_VOLUP"  , "label": "🔊"  , "css": "text-large color-slateblue"},
				{"key": "KEY_MUTE"   , "label": "🔇"  , "css": "text-large"},
				{"key": "KEY_CHUP"   , "label": "CH+", "css": "text-large color-slateblue"},
			]
		},
		{
			"cells": [
				{"key": "KEY_VOLDOWN", "label": "🔉"      , "css": "text-large color-slateblue"},
				{"key": "KEY_CH_LIST", "label": "CH List", "css": null},
				{"key": "KEY_CHDOWN" , "label": "CH-"    , "css": "text-large color-slateblue"},
			]
		},
		{
			"cells": [
				{"key": "KEY_CONTENTS", "label": "Content", "css": null},
				{"key": "KEY_MENU"    , "label": "Menu"   , "css": "color-green"},
				{"key": "KEY_GUIDE"   , "label": "Guide"  , "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_TOOLS", "label": "Tools", "css": null},
				{"key": "KEY_UP"   , "label": "↑"    , "css": "text-large color-black"},
				{"key": "KEY_INFO" , "label": "Info" , "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_LEFT" , "label": "←", "css": "text-large color-black"},
				{"key": "KEY_ENTER", "label": "⏎", "css": "text-large color-black"},
				{"key": "KEY_RIGHT", "label": "→", "css": "text-large color-black"},
			]
		},
		{
			"cells": [
				{"key": "KEY_RETURN", "label": "Return ↶", "css": null},
				{"key": "KEY_DOWN"  , "label": "↓"       , "css": "text-large color-black"},
				{"key": "KEY_EXIT"  , "label": "Exit"    , "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_RED"   , "label": "A" , "css": "color-red"},
				{"key": "KEY_GREEN" , "label": "B" , "css": "color-green"},
				{"key": "KEY_YELLOW", "label": "C" , "css": "color-yellow"},
				{"key": "KEY_CYAN"  , "label": "D" , "css": "color-cyan"},
			]
		},
		{
			"cells": [
				{"key": "KEY_TOPMENU", "label": "E-Manual", "css": null},
				{"key": "KEY_SRS"    , "label": "SRS"     , "css": null},
				{"key": "KEY_PMODE"  , "label": "P. Mode" , "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_PICTURE_SIZE", "label": "P. Size", "css": null},
				{"key": "KEY_CAPTION"     , "label": "CC"     , "css": null},
				{"key": "KEY_MTS"         , "label": "MTS"    , "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_REWIND", "label": "⏪", "css": "text-large color-white"},
				{"key": "KEY_PAUSE" , "label": "⏸", "css": "text-large color-white"},
				{"key": "KEY_FF"    , "label": "⏩", "css": "text-large color-white"},
			]
		},
		{
			"cells": [
				{"key": "KEY_REC" , "label": "⏺", "css": "text-large color-white color-rec"},
				{"key": "KEY_PLAY", "label": "▶", "css": "text-large color-white"},
				{"key": "KEY_STOP", "label": "■", "css": "text-large color-white"},
			]
		},
	]
},
{
	"id": "chromecast",
	"name": "Chromecast-optimized",
	"description": "Layout containing only the most relevant buttons while using a Chromecast.",
	"layout": "grid",
	"fontSize": "7vmin",
	"defaultWinSize": [225, 150],
	"rows": [
		{
			"cells": [
				// Useful at night, or when playing music through Chromecast.
				{"key": "KEY_ESAVING", "label": "Energy", "css": null},

				// Picture Mode: movie, dynamic, ...
				//{"key": "KEY_PMODE", "label": "P. Mode", "css": null},

				{"key": "KEY_TOOLS", "label": "Tools", "css": null},
				{"key": "KEY_MENU", "label": "Menu", "css": null},

				// Using HDMI key will not enable Anynet+/HDMI-CEC feature.
				// That's why using Source key is better.
				//{"key": "KEY_HDMI"  , "label": "HDMI"  , "css": null},
				{"key": "KEY_SOURCE", "label": "Source"  , "css": null},
				// In the future, we can use \u23FB for Power: http://unicodepowersymbol.com/
				{"key": "KEY_POWER" , "label": "Power" , "css": "color-red"},
			]
		},
		{
			"cells": [
				{"key": "KEY_VOLUP" , "label": "🔊"       , "css": "text-large color-slateblue"},
				{"key": "KEY_RETURN", "label": "↶ Return", "css": null},
				{"key": "KEY_UP"    , "label": "↑"       , "css": "text-large color-black"},
				{"key": "KEY_ENTER" , "label": "⏎"       , "css": "text-large color-black"},
			]
		},
		{
			"cells": [
				{"key": "KEY_VOLDOWN", "label": "🔉", "css": "text-large color-slateblue"},
				{"key": "KEY_LEFT"   , "label": "←", "css": "text-large color-black"},
				{"key": "KEY_DOWN"   , "label": "↓", "css": "text-large color-black"},
				{"key": "KEY_RIGHT"  , "label": "→", "css": "text-large color-black"},
			]
		},
		{
			"cells": [
				{"key": "KEY_MUTE" , "label": "🔇"    , "css": "text-large color-white"},
				{"key": "KEY_PAUSE", "label": "⏸"    , "css": "text-large color-white"},
				{"key": "KEY_PLAY" , "label": "▶"    , "css": "text-large color-white"},
				{"key": "KEY_SLEEP", "label": "Sleep", "css": null},
			]
		},
	]
},
{
	"id": "chromecast-2",
	"name": "Chromecast-optimized (alternative)",
	"description": "Layout containing only the most relevant buttons while using a Chromecast. Also includes buttons to change volume in multiple steps at once.",
	"layout": "grid",
	"fontSize": "7vmin",
	"defaultWinSize": [225, 150],
	"rows": [
		{
			"cells": [
				{"key": "KEY_VOLUP,KEY_VOLUP,KEY_VOLUP,KEY_VOLUP"        , "label": "🔊 ×4", "css": "color-slateblue"},

				// Picture Mode: movie, dynamic, ...
				//{"key": "KEY_PMODE", "label": "P. Mode", "css": null},

				// Using HDMI key will not enable Anynet+/HDMI-CEC feature.
				// That's why using Source key is better.
				//{"key": "KEY_HDMI"  , "label": "HDMI"  , "css": null},
				{"key": "KEY_SOURCE", "label": "Source"  , "css": null},

				{"key": "KEY_MENU", "label": "Menu", "css": null},

				// In the future, we can use \u23FB for Power: http://unicodepowersymbol.com/
				{"key": "KEY_POWER" , "label": "Power" , "css": "color-red"},

				{"key": ""          , "label": null, "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_VOLUP" , "label": "🔊"       , "css": "text-large color-slateblue"},
				{"key": "KEY_RETURN", "label": "↶ Return", "css": null},
				{"key": "KEY_UP"    , "label": "↑"       , "css": "text-large color-black"},
				{"key": "KEY_ENTER" , "label": "⏎"       , "css": "text-large color-black"},
				{"key": "KEY_TOOLS", "label": "Tools", "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_VOLDOWN", "label": "🔉", "css": "text-large color-slateblue"},
				{"key": "KEY_LEFT"   , "label": "←", "css": "text-large color-black"},
				{"key": "KEY_DOWN"   , "label": "↓", "css": "text-large color-black"},
				{"key": "KEY_RIGHT"  , "label": "→", "css": "text-large color-black"},
				// Useful at night, or when playing music through Chromecast.
				{"key": "KEY_ESAVING", "label": "Energy", "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_VOLDOWN,KEY_VOLDOWN,KEY_VOLDOWN,KEY_VOLDOWN", "label": "🔉 ×4", "css": "color-slateblue"},
				{"key": "KEY_MUTE" , "label": "🔇"    , "css": "text-large color-white"},
				{"key": "KEY_PAUSE", "label": "⏸"    , "css": "text-large color-white"},
				{"key": "KEY_PLAY" , "label": "▶"    , "css": "text-large color-white"},
				{"key": "KEY_SLEEP", "label": "Sleep", "css": null},
			]
		},
	]
},
{
	"id": "first",
	"name": "Foobar",
	"description": "First layout ever written.",
	"layout": "grid",
	"fontSize": "8vmin",
	"defaultWinSize": [280, 180],
	"rows": [
		{
			"cells": [
				{"key": "KEY_RED"   , "label": "A" , "css": "color-red"},
				{"key": "KEY_GREEN" , "label": "B" , "css": "color-green"},
				{"key": "KEY_YELLOW", "label": "C" , "css": "color-yellow"},
				{"key": "KEY_CYAN"  , "label": "D" , "css": "color-cyan"},
				{"key": ""          , "label": null, "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_MUTE"                                       , "label": "🔇"   , "css": null},
				{"key": "KEY_VOLDOWN,KEY_VOLDOWN,KEY_VOLDOWN,KEY_VOLDOWN", "label": "🔉 ×4", "css": "color-slateblue"},
				{"key": "KEY_VOLDOWN"                                    , "label": "🔉"   , "css": "color-slateblue"},
				{"key": "KEY_VOLUP"                                      , "label": "🔊"   , "css": "color-slateblue"},
				{"key": "KEY_VOLUP,KEY_VOLUP,KEY_VOLUP,KEY_VOLUP"        , "label": "🔊 ×4", "css": "color-slateblue"},
			]
		},
		{
			"cells": [
				{"key": "KEY_TOOLS" , "label": "Tools" , "css": null},
				{"key": "KEY_UP"    , "label": "↑"     , "css": "color-black"},
				{"key": "KEY_INFO"  , "label": "Info"  , "css": null},
				{"key": "KEY_MENU"  , "label": "Menu"  , "css": null},
				{"key": "KEY_SOURCE", "label": "Source", "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_LEFT" , "label": "←", "css": "color-black"},
				{"key": "KEY_ENTER", "label": "⏎", "css": "color-black"},
				{"key": "KEY_RIGHT", "label": "→", "css": "color-black"},
				{"key": "KEY_REC"  , "label": "⏺", "css": "color-rec"},
				{"key": "KEY_PLAY" , "label": "▶", "css": null},
			]
		},
		{
			"cells": [
				{"key": "KEY_RETURN", "label": "↶ Return", "css": null},
				{"key": "KEY_DOWN"  , "label": "↓"       , "css": "color-black"},
				{"key": "KEY_EXIT"  , "label": "Exit"    , "css": null},
				{"key": "KEY_STOP"  , "label": "■"       , "css": null},
				{"key": "KEY_PAUSE" , "label": "⏸"       , "css": null},
			]
		},
	]
} ];
