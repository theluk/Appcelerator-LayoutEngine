
(function(){
	
	_ = require("lib/underscore");
	Class = require("lib/base");
	x = require("tools/functions").xml;
	
	$ = {};
	UI = {};
	
	/**
	 * Base Types...
	 */
	Ti.include("reader/ReaderData.js")
	Ti.include("reader/Context.js");
	
	Ti.include("reader/ReaderBase.js");
	Ti.include("reader/Merger.js");
	Ti.include("reader/ComplexTypeReader.js");
	Ti.include("reader/ResolveReader.js");
	Ti.include("reader/PlattformDependencyReader.js");
	Ti.include("reader/Reader.js");
	
	/**
	 * View
	 */
	Ti.include("reader/PropertiesReader.js");
	Ti.include("reader/ChildrenReader.js");
	Ti.include("reader/ViewReader.js");
	
	module.exports.reader = $;
	
	/**
	 * UI
	 */
	
	Ti.include("ui/ViewWrapper.js");
	Ti.include("ui/App.js");
	
	module.exports.ui = UI;
	
})();
