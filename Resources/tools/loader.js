var _ = require("lib/underscore");

var defaults = {

	content : null,
	source : "ui/layout.xml",
	data : {},
	toXML : true

}

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
