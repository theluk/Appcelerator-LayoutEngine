(function() {
	
	Ti.include("/tools/layoutPropertiesMap.js");
	
	var _ = require("lib/underscore");
	
	var options = {
		log : function(value) {
			Ti.API.info(value);
		},
		loader : require("tools/loader"),
		getMap : function() {
			return map;
		}
	};
	
	function trim (str) {
		var	str = str.replace(/^\s\s*/, ''),
			ws = /\s/,
			i = str.length;
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	}

	var x = function(data) {
		return new ctor(data);
	},
	norm = x.norm = function(node) {
		if (node instanceof Ti.XML.Document) node = node.documentElement;
		var coll = ((!node || typeof(node) == "undefined")  ? [] : node);
		if (_.isFunction(coll.item) && !_.isArray(coll)) {
			var result = [];
			for (var i = 0;i < coll.length;i++) {
				result.push(coll.item(i));
			}
			return result;
		}
		return _.toArray(_.flatten((!_.isArray(coll) && !_.isArguments(coll)) ? [coll] : coll));
	}, 
	attr = x.attr = function(node, name, value) {
		if(value) {
			single(node).setAttribute(name, value);
		} else {
			return hasAttr(node, name) ? single(node).getAttribute(name) : null;
		}
	}, 
	allAttr = x.allAttr = function(node, values) {
		var obj = {}, vals = (values || "").split(" "), value;
		node = single(node);
		while(value = vals.shift()) {
			(hasAttr(node, value) && (obj[value] = attr(node, value)));
		}
		return obj;
	},
	get = x.get = function(node, tagName) {
		if (_.isNumber(tagName) || arguments.length == 1) {
			return norm(node)[(tagName || 0)];
		} else if(_.isFunction(tagName)) {
			return x.filter(node, tagName);
		} else if(tagName.slice(0, 1) == "#") {
			var f = x.filter(node, function(node) {
				if (x.hasAttr(node, "id")) {
					return (x.attr(node, "id") == tagName.slice(1));
				}
			});
			return (f.length > 0 ? f[0] : null);
		} else if(tagName.length > 0) {
			return x.filter(node, function(node) {
				return (node.nodeName == tagName);
			});
		}
	}, 
	getAll = x.getAll = x.all = function(node, tagName) {
		return single(node).getElementsByTagName(tagName);
	},
	getDocAll = x.getDocAll = function(node, tagName) {
		return getAll(docElement(node), tagName);
	},
	children = x.children = function(node, filter) {
		var children = norm(single(node).getChildNodes());
		if (filter) {
			if (!_.isFunction(filter)) {
				return get(children, filter);
			} else {
				return x.filter(children, filter, this);
			}
		}
		return children;
	},
	parent = x.parent = function(node) {
		return single(node).getParentNode();
	},
	section = x.section = function(node, value) {
		if (!value || !_.isString(value)) return node;
		var currentNode = single(node);
		_.each(value.split(" "), function(sectionName) {
			currentNode = get(children(currentNode, sectionName));
		});
		return currentNode;
	},
	hasAttr = x.hasAttr = function(node, name) {
		return single(node).hasAttribute(name);
	}, 
	hasRef = x.hasRef = function(node) {
		return hasAttr(single(node), "ref");
	}, 
	hasSrc = x.hasSrcRef = function(node) {
		return hasAttr(single(node), "src");
	},
	clone = x.clone = function(node, deep) {
		return single(node).cloneNode((typeof (deep) == "undefined") ? false : deep);
	},
	owner = x.owner = function(node) {
		return single(node).getOwnerDocument();
	},
	docElement = x.docElement = function(node) {
		return owner(single(node)) ? owner(single(node)).getDocumentElement() : null;
	},
	single = x.single = function(node) {
		//node = norm(node);
		//return get(node);
		return x.first(node);
	},
	resolveSrc = x.resolveSrc = function(node, id) {
		node = single(node);
		if (!hasSrc(node)) return [node];
		var path = x.attr(node, "src");
		if (!options.loader) throw("XML Loader needed...");
		var xml = options.loader.read({source:path}).xml;
		var elements = null;	
		var all = getAll(xml.documentElement, node.nodeName);
		if (id) {
			elements = x.filter(all, function(el) { return el && el.nodeName != "#text" && x.attr(el, "id") == id; });
		} else {
			elements = all;
		}
		return elements.length > 0 ? elements : [node];
	}
	resolveRef = x.resolveRef = function(node) {
		node = single(node);
		if (!hasRef(node) || !docElement(node) || node.nodeName == "#text") return [node];
		var id = x.attr(node, "ref"),
			nodeName = node.nodeName,
			elements = x.filter(getDocAll(node, nodeName), function(el) { return el && el.nodeName != "#text" && x.attr(el, "id") == id; });
		
	 	return elements.length > 0 ? elements : [node];
	},
	text = x.text = function(text) {
		//1.normalize text if empty
		//2.if not text search for obj.getText and assign if found
		((!text && (text = "")) || !_.isString(text) && (text = single(text)) &&
			(text.getText && (text = text.getText())) || (text.nodeValue && (text = text.nodeValue)));
		return text;
	},
	parseInlineProperties = x.parseInlineProperties = function(text, defaults, _map) {
		(defaults || (defaults = {}));
		var regx = /(.+?)\:(.+?)\;/g, props = {}, match = null, name, value, map = _map || options.getMap();
		text = x.text(text);
		while ((match = regx.exec(text))) {
			name = trim(match[1]);
			value = trim(match[2]);
			props[name] = (map[name] ? map[name](value) : value);
		}
		return props;
	},
	
	mapStyle = x.mapStyle = function(text, pname) {
		text = x.text(text);
		var map = options.getMap() || {};
		return map[pname] ? map[pname](text) : text;
	},
	
	canMapStyle = x.canMapStyle = function(text, pname) {
		return map[pname];
	}
	
	methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

	_.each(methods, function(method) {
		x[method] = function(node) {
			return _[method].apply(_, [norm(node)].concat(Array.prototype.slice.call(_.toArray(arguments), 1)));
		};
	});
	
	
	var ctor = function(data, parent, lastArgs /*internal use */) {
		this.wrapper = data;
		this._last = (typeof(parent) == "undefined" ? null : parent);
		this._lastArgs = (typeof(lastArgs) == "undefined" ? null : lastArgs);
	};
	
	var AddMethod = function(name) {
		ctor.prototype[name] = function() {
			var data = x[name].apply(this, [this.wrapper].concat(_.toArray(arguments)));
			return new ctor(data, this, [name].concat(_.toArray(arguments)));
		};
	};
	
	for (name in x) {
		if (_.isFunction(x[name])) AddMethod(name);
	}
		
	ctor.prototype.value = function() {
		return this.wrapper;
	};
	ctor.prototype.into = function(refObject) {
		// Check if on creation of this instance there where previos chaing methods.
		if (this._lastArgs && this._lastArgs.length > 0 && refObject && _.isObject(refObject)){
			// hasAttr("value") == true --> {hasAttrValue:"true"}
			(refObject)[this._lastArgs.length > 1 ? 
				(this._lastArgs[0] + this._lastArgs[1].slice(0, 1).toUpperCase() + this._lastArgs[1].slice(1)) 
					: this._lastArgs[0]] = this.wrapper;
		}
		return this;
	};
	ctor.prototype.end = function() {
		var last = this._last;
		this.destroy(false); //destroy only this
		return last;
	};
	
	ctor.prototype.leave = function() {
		(this._last && this._last.destroy());
		this._last = null;	
		return this;
	};
	ctor.prototype.reset = function() {
		var value = this.wrapper;
		if (this._last) {
			this._last.reset();
			this.destroy(false)
		}
		return value;
	};
	ctor.prototype.destroy = function(deep) {
		var value = this.wrapper;
		if (deep != false && this._last) this._last.destroy();
		delete this._last;
		delete this._lastArgs;
		delete this.wrapper;
		delete this;
		return value;
	};

	
	
	module.exports.xml = x;
	
})();
