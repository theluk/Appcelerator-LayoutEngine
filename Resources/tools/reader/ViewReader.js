/**
 * @author theluk
 */

(function() {
	
	var readTypeNs = function(value) {
		var ns = value.split("."), current = this, item;
		for(var i = 0, j = ns.length; i < j; i++) {
			item = ns[i];
			if(j - 1 == i) {
				item = "create" + item;
				// WebView -> createWebView
			}
			current = current[item];
		};
		return current
	}
	
	$.ViewReader = $.Reader.extend({
		
		init:function() {
			this._super();
			
		},
		
		onRead: function() {
			
			var o = this.x.allAttr("type module id").value();
			var d = this.context.data;
			
			if (o.type) d.set("Type", readTypeNs(o.type));
			if (o.module) d.set("Module", require(o.module));
			
			d.set("id", o.id);
			d.set("properties", x.attr("properties").parseInlineProperties().value());
			
		},
		
		onBuild : function() {
			var d = this.context.data;
			this.context.addBuild(function() {
				var attributes = {
					data:this.context.data
				};
				if (d.get("Type")) {
					attributes.viewType = d.get("Type");
				}
				
				var InstanceType = (d.get("Module") || UI.ViewWrapper);
				var instance = new InstanceType(attributes);
				
				this.context.setInstance(instance);
			});	
			
		},
		
		getItemReaderType:function(xml){
			switch(xml.nodeName) {
				case "children" : 
					return $.ChildrenReader; 
					break;
				case "properties" :
					return $.PropertiesReader;
					break;
			}
		},
		
		getItemReaderOptions: function() {
			return {
				context : this.context.createChild(),
				container: this
			};
		}
		
	});
	
})();
