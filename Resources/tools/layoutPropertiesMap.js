var map = {};
(function() {

	var fnString = function(value) {
		return value.toString()
	};
	var fnInt = function(value) {
		return parseInt(value)
	};
	var fnBool = function(value) {
		return value == "true"
	};
	var fnPoint = function(value) {
		var v = value.split("x");
		return {
			x : parseInt(v[0]),
			y : parseInt(v[1])
		};
	};
	var fnFont = function(value) {
		var values = value.split(" ");
		var result = {};
		for(var i = 0, j = values.length; i < j; i++) {
			var item = values[i].toString().replace(/^\s+|\s+$/g, "");
			if(item == "italic") {
				result.fontStyle = "italic";
			} else if(item == "bold") {
				result.fontWeight = "bold";
			} else if(parseInt(item) > -1) {
				result.fontSize = parseInt(item);
			} else {
				result.fontFamily = item;
			}
		};
		return result;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////
	// PASTE CODE BELOW ...																	//
	//////////////////////////////////////////////////////////////////////////////////////////
	
	map["activity"] = fnString;
	map["anchorPoint"] = fnPoint;
	map["animatedCenterPoint"] = fnPoint;
	map["autoLink"] = fnInt;
	map["backButtonTitle"] = fnString;
	map["backButtonTitleImage"] = fnString;
	map["backgroundColor"] = fnString;
	map["backgroundDisabledColor"] = fnString;
	map["backgroundDisabledImage"] = fnString;
	map["backgroundFocusedColor"] = fnString;
	map["backgroundFocusedImage"] = fnString;
	map["backgroundGradient"] = fnString;
	map["backgroundImage"] = fnString;
	map["backgroundLeftCap"] = fnInt;
	map["backgroundPaddingBottom"] = fnInt;
	map["backgroundPaddingLeft"] = fnInt;
	map["backgroundPaddingRight"] = fnInt;
	map["backgroundPaddingTop"] = fnInt;
	map["backgroundRepeat"] = fnBool;
	map["backgroundSelectedColor"] = fnString;
	map["backgroundSelectedImage"] = fnString;
	map["backgroundTopCap"] = fnInt;
	map["barColor"] = fnString;
	map["barImage"] = fnString;
	map["borderColor"] = fnString;
	map["borderRadius"] = fnInt;
	map["borderWidth"] = fnInt;
	map["bottom"] = fnInt;
	map["center"] = fnPoint;
	map["children"] = fnString;
	map["color"] = fnString;
	map["ellipsize"] = fnBool;
	map["exitOnClose"] = fnBool;
	map["focusable"] = fnBool;
	map["font"] = fnFont;
	map["fullscreen"] = fnBool;
	map["height"] = fnInt;
	map["highlightedColor"] = fnString;
	map["html"] = fnString;
	map["keepScreenOn"] = fnBool;
	map["layout"] = fnString;
	map["left"] = fnInt;
	map["leftNavButton"] = fnString;
	map["minimumFontSize"] = fnInt;
	map["modal"] = fnBool;
	map["navBarHidden"] = fnBool;
	map["opacity"] = fnInt;
	map["orientation"] = fnInt;
	map["orientationModes"] = fnString;
	map["right"] = fnInt;
	map["rightNavButton"] = fnString;
	map["shadowColor"] = fnString;
	map["shadowOffset"] = fnString;
	map["size"] = fnString;
	map["softKeyboardOnFocus"] = fnInt;
	map["tabBarHidden"] = fnBool;
	map["text"] = fnString;
	map["textAlign"] = fnString;
	map["textid"] = fnString;
	map["title"] = fnString;
	map["titleControl"] = fnString;
	map["titleid"] = fnString;
	map["titleImage"] = fnString;
	map["titlePrompt"] = fnString;
	map["titlepromptid"] = fnString;
	map["toolbar"] = fnString;
	map["top"] = fnInt;
	map["touchEnabled"] = fnBool;
	map["transform"] = fnString;
	map["translucent"] = fnBool;
	map["url"] = fnString;
	map["visible"] = fnBool;
	map["width"] = fnInt;
	map["windowPixelFormat"] = fnInt;
	map["windowSoftInputMode"] = fnInt;
	map["wordWrap"] = fnBool;
	map["zIndex"] = fnInt;
	map["anchorPoint"] = fnPoint;

	//////////////////////////////////////////////////////////////////////////////////////////
	// Until here...																		//
	//////////////////////////////////////////////////////////////////////////////////////////

})();
