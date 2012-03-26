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
			_.times(i, function() {str+="-";});
			current = current[item];
		};
		return current;
	};
	
	$.ViewReader = $.Reader.extend({
				
		onRead: function() {
			
			var o = this.x.allAttr("type module id").value();
			var d = this.context.data;
			
			if (o.type) d.set("Type", readTypeNs(o.type));
			if (o.module) d.set("Module", require(o.module));
			
			d.set("id", o.id);
			d.set("properties", this.x.attr("properties").parseInlineProperties().value());
			
		},
		getDeepMergeProperties: function() {
			return this._super().concat(["properties", "children"]);
		},
		onBuild : function() {
			var d = this.context.data;
			var self = this;
			var attributes = {
				context:this.context
			};
			if (d.get("Type")) {
				attributes.viewType = d.get("Type");
			}
			
			var InstanceType = (d.get("Module") || UI.ViewWrapper);
			this.context.addBuild(function() {
				var instance = new InstanceType(attributes);
				this.context.setInstance(instance);
			});	
			
		},
		getChildrenReaderType: function() {
			return $.ChildrenReader;
		},
		getPropertiesReaderType: function() {
			return $.PropertiesReader;
		},
		getItemReaderType:function(xml){
			switch(xml.nodeName) {
				case "children" : 
					return this.getChildrenReaderType(); 
					break;
				case "properties" :
					return this.getPropertiesReaderType();
					break;
			}
		},
		
		getItemReaderOptions: function(xml) {
			return {
				context : this.context.createChild(),
				container: this,
				xml:xml
			};
		}
		
	});
	
})();
