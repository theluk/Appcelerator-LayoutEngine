var _ = require("lib/underscore");

var defaults = {

	content : null,
	source : "ui/layout.xml",
	data : {},

}

/**
 *  @options : map of properties which may contain
 * 		content : string (xml)
 * 		source 	: path
 * 		template: compiled template
 * 		data	: data to forward to templating engine
 * 
 * 	@returns nearly the same object as the imput
 * 				template, content, xml
 */
var read = function(options) {

	var o = _.extend({}, defaults, options),
		ret = {};

	if(o.source && !o.content) {
		var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, o.source), blob = file.read();
		o.content = blob.text;
		blob = null;
		file = null;
	}
	
	ret.template = (o.template || _.template(o.content));
	ret.content = o.content = ret.template(o.data);
	ret.xml = Ti.XML.parseString(o.content);
	o = null;
	
	return ret;

}

module.exports.read = read;
