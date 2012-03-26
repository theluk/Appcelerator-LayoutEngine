Ti.include("../lib/base.js");
var _ = require("lib/underscore");
Ti.include("layoutPropertiesMap.js");

var w = this, instance = null;

function Layout(options, openClose, clr, callerCustomCtor) {
	this.options = _.extend({}, {
		source : "layout.xml"
	}, options);

	this.openClose = (openClose == true);
	if(openClose) {
		this.clr = clr;
		this.callerCustomCtor = callerCustomCtor;
	}
	this._viewByID = {};
	this._views = [];
	this._main = null;

	this.initialize();
	this._initialized = false;
};

_.extend(Layout.prototype, {

	initialize : function() {
		if(this._initialized)
			return;

		_.bindAll(this, "create", "createByID", "find", "main", "destroy");

		this.xml = this._initContents();
		this._loadViews();
		this._initialized = true;

	},
	_initContents : function() {
		if(this._initialized)
			return;
		var contentValue = this.options.content, openPath = this.options.source, template = false;
		if(this.options.asTemplate && (this.options.source || this.options.content) && this.options.data) {(this.options.source && ( openPath = this.options.source)); (this.options.content && ( contentValue = this.options.content));
			template = true;
		}
		if(openPath) {
			var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, openPath), blob = file.read();
			contentValue = blob.text;
			blob = null;
			file = null;
		}

		if(template) {
			contentValue = _.template(contentValue, this.options.data);
		}

		var xml = Ti.XML.parseString(contentValue);
		contentValue = null;
		return xml;
	},
	main : function(silent) {
		this._main = this.createByID("main");
		this._main.addEventListener("close", this.destroy);
		if(silent != true && this._main.open)
			this._main.open();
		return this._main;
	},
	trim : function(value) {
		return value.replace(/^\s+|\s+$/g, "");
	},
	_readAttribute : function(viewElement, attr) {
		if(!viewElement || !viewElement.attributes)
			return null;
		var attr = viewElement.attributes.getNamedItem(attr);
		return ( attr ? attr.nodeValue : null);
	},
	destroy : function() {
		if(this._main) {
			this._main.removeEventListener("close", this.destroy);
		}
		if(this.openClose) {
			this.clr = null;
			this.callbackFunction = null;
		}
		this.options = null;
		this._viewByID = null;
		this._views.length = 0;
		this._views = null;
		this.xml = null;
	},
	_bindViewCreateFunction : function(value) {
		var ns = value.split("."), current = w, item;
		for(var i = 0, j = ns.length; i < j; i++) {
			item = ns[i];
			if(j - 1 == i) {
				item = "create" + item;
				// WebView -> createWebView
			}
			current = current[item];
		};
		return current;
	},
	_bindModule : function(value) {
		return (function(value) {
			var v = value;
			return function(options, node, context) {
				var obj = require(value);
				var ret = new obj(options, node, context);
				return ret;
			}
		})(value);
	},
	getViewCtor : function(viewObject) {
		if(viewObject.ctor)
			return viewObject.ctor;
		var module = this._readAttribute(viewObject.view, "module"), type = this._readAttribute(viewObject.view, "type"), returnValue = null;

		if(module) {
			returnValue = viewObject.ctor = this._bindModule(module);
		} else if(type) {
			returnValue = viewObject.ctor = this._bindViewCreateFunction(type);
		} else {
			if(this.clr && this.callerCustomCtor && viewObject.isRootElement) {
				returnValue = viewObject.ctor = this.callerCustomCtor;
			} else {
				returnValue = viewObject.ctor = this._bindViewCreateFunction("Ti.UI.View");
			}

		}
		return returnValue;
	},
	create : function(viewObject, buildContext) {(buildContext || ( buildContext = this._createBuildContext()));
		var ctor = this.getViewCtor(viewObject), id, className;
		var properties = _.extend({}, this._getInlineProperties(viewObject.view), this._getProperties(viewObject.view));

		if(!properties.id && ( id = this._readAttribute(viewObject.view, "id")))
			properties.id = id;
		if(!properties.className && ( className = this._readAttribute(viewObject.view, "class")))
			properties.className = className;

		var children = this.createChildren(viewObject, buildContext), childrenNode = viewObject.view.getElementsByTagName("children");

		var childrenAppendMethod = ((childrenNode.length > 0 && this._readAttribute(childrenNode.item(0), "appendMethod")) || "add");
		var instance = ctor(properties, viewObject.view, buildContext);
		this.appendChildren(children, instance, childrenAppendMethod);

		return instance;
	},
	createByID : function(id, context) {
		return this.create(this._viewByID[id]);
	},
	createChildren : function(viewObject, buildContext) {
		var me = this;
		return _(this._loadChildViews(viewObject)).map(function(childViewObject) {
			var child = me.create(childViewObject, buildContext);
			me._appendBuild(buildContext, childViewObject, child)
			return child;
		});
	},
	appendChildren : function(children, instance, appendMethod) {
		var me = this;
		_(children).each(function(child) {
			(instance.win || instance.view || instance)[appendMethod](child);
		});
	},
	find : function(id, node) {
		var me = this;
		return _(node.getElementsByTagName("view")).filter(function(cNode) {return me._readAttribute(cNode, "id") == id})[0];
	},
	_loadViews : function() {
		var coll = this.xml.getElementsByTagName("views").item(0).childNodes, retValue = [], view, id, viewObject = null;
		for(var i = 0, j = coll.length; i < j; i++) {
			view = coll.item(i);

			if(view.nodeName == "#text")
				continue;
			this._createViewObject(view, true);
			//Set 2nd Parameter "true" for initialization

		}
	},
	_appendBuild : function(context, viewObject, instance) {
		var id = this._readAttribute(viewObject.view, "id");
		if(id && instance)
			context.item["#" + id] = instance;
	},
	_createBuildContext : function() {
		return {
			node : null,
			item : {}
		};
		// item will be a object, to access like so: item[".className"], item["#id"]
	},
	_createViewObject : function(view, init) {
		var viewObject = {
			view : view,
			ctor : null,
			id : null,
			children : null,
			isRootElement : (init == true)
		};
		if(( id = this._readAttribute(view, "id"))) {
			viewObject.id = id;
		}
		if(init) {
			this._views.push(viewObject);
			if(viewObject.id) {
				this._viewByID[viewObject.id] = viewObject;
			}
		}
		return viewObject;
	},
	_loadChildViews : function(viewObject) {
		if(viewObject.children)
			return viewObject.children;
		var childrenElements = viewObject.view.getElementsByTagName("children");
		var retValue = null;
		if(childrenElements.length > 0) {

			var coll = childrenElements.item(0).childNodes, childViewObject, children = [];

			for(var i = 0, j = coll.length; i < j; i++) {
				view = coll.item(i);

				if(view.nodeName == "#text")
					continue;
				childViewObject = this._createViewObject(view);

				children.push(childViewObject);
				this._loadChildViews(childViewObject);

			}
			retValue = viewObject.children = children;

		} else {
			retValue = viewObject.children = [];
		}
		return retValue;
	},
	_getInlineProperties : function(viewElement) {
		if(viewElement.hasAttributes() && viewElement.attributes.getNamedItem("properties")) {
			var properties = viewElement.attributes.getNamedItem("properties").nodeValue, nvp = properties.split(";"), i, j, nv, name, value, props = {};

			for( i = 0, j = nvp.length; i < j; i++) {
				if(!nvp[i].length)
					continue;
				nv = nvp[i].split(":");
				name = this.trim(nv[0]);
				value = this.trim(nv[1]);
				props[name] = (map[name] ? map[name](value) : value);
			};

			return props;
		} else {
			return null;
		}
	},
	_getProperties : function(viewElement) {
		var elements = viewElement.getElementsByTagName("properties");
		if(elements.length == 0)
			return {};

		var properties = elements.item(0).childNodes;
		var props = {};

		for(var i = 0, j = properties.length; i < j; i++) {
			var node = properties.item(i);

			if(node.nodeName == "#text")
				continue;

			var name = node.getAttributes().item(0).getNodeValue();
			var value = node.childNodes.item(0).text;
			switch (node.nodeName.toLowerCase()) {
				case "string" :
					value = value.toString();
					break;
				case "int" :
					value = parseInt(value);
					break;
				case "bool" :
					(value == "true");
					break;
			}
			props[name] = value;
		};
		return props;
	}
});
instance = new Layout();

module.exports.create = instance.create;
module.exports.createByID = instance.createByID;
module.exports.find = instance.find;
module.exports.destroy = instance.destroy;
module.exports.main = instance.main;

module.exports.buildNew = function(opt, caller, ctor, ref) {
	Ti.API.log(opt);
	var layout = new Layout(opt, true, caller, ctor);
	if (ref) ref.context = _.extend({}, ref.context, layout._createBuildContext());
	var returnValue = layout.create(layout._views[0], ref.context);
	layout.destroy();
	layout = null;
	return returnValue;
};
