/**
 * @author theluk
 */

(function() {
	
	$.PropertiesReader = $.Reader.extend({
		
		init: function(options) {
			this._super();
			this.containerElement = options.container;
		},
		getItemReaderOptions: function() {
			return {
				context:this.context.createChild(),
				container : this.containerElement
			};
		},
		getItemReaderType : function() {
			return $.PropertyItemReader;
		}
		
	});
	
	var isViewElement = function(xml) {
		if ($.ViewReader) return $.ViewReader.canRead(xml);
		return xml.nodeName == "view";
	}
	
	$.PropertyItemReader = $.Reader.extend({
		
		init:function(options) {
			this._super();
			this.containerElement = this.options.container;
		},
		
		onRead: function() {
			var c, view, nodeName = this.context.data.get("nodeName");
			if ((c = this.containerElement)) {
				
				if ((view = this.x.children("view").get().value())) {
					
					var reader = new $.ViewReader({
						context: this.containerElement.context.createChild(),
						xml: view
					});
					reader.read();
					this.context.data.set("ViewInProperty", reader);
					
				} else {
					var o = {};
					o[nodeName] = this.x.mapStyle(nodeName);
					this.containerElement.context.data.set("properties", o);	
				}
			}
		},
		
		afterBuild: function() {
			var reader = this.context.data.get("ViewInProperty");
			if (reader) {
				
			}
		}
		
	});
	
})();
