/**
 * @author theluk
 */

(function() {

	/**
	 * "Ti.UI.View" -> Ti.UI.createView
	 */
	var readTypeNs = function(value) {
		var ns = value.split("."), current = this, item;
		for(var i = 0, j = ns.length; i < j; i++) {
			item = ns[i];
			if(j - 1 == i) {
				item = "create" + item;
			}
			var str = "";
			_.times(i, function() {
				str += "-";
			});
			current = current[item];
		};
		return current;
	};

	$.ViewReader = $.Reader.extend({

		onRead : function() {

			var o = this.x.allAttr("type module id cache").value();
			var d = this.context.data;
			
			if (o.cache) 
				d.set("cache", o.cache == "true" ? true : false);
			
			if(o.type) {
				d.set("Type", readTypeNs(o.type));
				d.set("typeName", o.type);
			}
			if(o.module)
				d.set("module", o.module);

			d.set("id", o.id);
			d.set("properties", this.x.attr("properties").parseInlineProperties().value());

			this.readEvents();

		},
		readEvents : function() {

			var attrs = x(this.xml.attributes).norm();

			var attrNames = attrs.filter(function(el) {
				return el && el.nodeName.slice(0, 2) == "on" && el.nodeName.length > 2;
			}).map(function(el) {
				return el ? el.nodeName : null;
			}).compact().destroy();

			var o = attrNames.length > 0 ? {} : null, self = this;

			_.each(attrNames, function(name) {
				var actions = self.x.attr(name).parseInlineProperties().value();
				var eventName = name.slice(2).toLowerCase();
				o[eventName] = actions;
			});
			if(o) {
				this.context.data.set("eventSettings", o);
			}

		},
		getDeepMergeProperties : function() {
			return this._super().concat(["properties", "children"]);
		},
		onBuild : function() {
			var d = this.context.data;
			var self = this;
			var attributes = {
				context : this.context
			};
			if(d.get("Type")) {
				attributes.viewType = d.get("Type");
			} else {
				attributes.viewType = Ti.UI.createView;
			}

			this.context.addBuild(function() {
				attributes.ptr = this.context.ptr;
				var InstanceType = (d.get("module") ? require(d.get("module")) : UI.ViewWrapper);
				var instance = new InstanceType(attributes);
				this.context.setInstance(instance);
			});
		},
		afterBuild : function() {

			var ev = this.context.data.get("eventSettings");
			if(ev) {
				this.context.addBuild(function() {
					var wrapper = this.context.getInstance();
					if(wrapper && wrapper.delegateEvents) {
						wrapper.delegateEvents(ev);
					}
				});
			}
			
			this.context.addBuild(function() {
				var wrapper = this.context.getInstance();
				if (wrapper && wrapper.loaded) wrapper.loaded();
			});
			
		},
		getChildrenReaderType : function() {
			return $.ChildrenReader;
		},
		getPropertiesReaderType : function() {
			return $.PropertiesReader;
		},
		getItemReaderType : function(xml) {
			switch(xml.nodeName) {
				case "children" :
					return this.getChildrenReaderType();
					break;
				case "properties" :
					return this.getPropertiesReaderType();
					break;
			}
		},
		getItemReaderOptions : function(xml) {
			return {
				context : this.context.createChild(),
				container : this,
				xml : xml
			};
		}
	});

})();
