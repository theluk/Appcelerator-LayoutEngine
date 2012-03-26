/**
 * @author theluk
 */

(function() {
	
	$.PropertiesReader = $.Reader.extend({
		
		init: function(options) {
			this._super(options);
			this.containerElement = options.container;
			Ti.API.info("Initialized PropertiesReader");
			
		},
		getItemReaderOptions: function(xml) {
			return {
				context:this.context.createChild(),
				container : this,
				xml: xml
			};
		},
		merge: function(other) {
			this.context.data.set("properties", other.get("properties"));
		},
		afterRead:function() {
			this._super();
			var props = this.context.data.get("properties");
			for(name in props) {
				Ti.API.info("propertyReader Source: " + name + " " + props[name]);
			}
			if (this.containerElement) {
				props = this.containerElement.context.data.get("properties");
				for(name in props) {
					Ti.API.info("propertyReader Before Target: " + name + " " + props[name]);
				}
				this.containerElement.context.data.set("properties", this.context.data.get("properties"));
				for(name in props) {
					Ti.API.info("propertyReader Target: " + name + " " + props[name]);
				}
			}
		},
		getItemReaderType : function() {
			return $.PropertyItemReader;
		}
		
	});
	
	$.PropertyItemReader = $.Reader.extend({
		
		init:function(options) {
			this._super();
			this.containerElement = this.options.container;
		},
		
		onRead: function() {
			this._super();
			
			var c, view, nodeName = this.context.data.get("nodeName");
			if ((c = this.containerElement)) {
				
				if ((view = this.x.children("view").get().value())) {
					
					var reader = new $.ViewReader({
						context: c.context.createChild(),
						xml: view
					});
					reader.read();
					this.context.data.set("ViewInProperty",{reader:reader, propertyName:nodeName});
					
				} else {
					var o = {};
					o[nodeName] = this.x.mapStyle(nodeName).value();
					c.context.data.set("properties", o);	
				}
			}
		},
		
		afterBuild: function() {
			
			var item = this.context.data.get("ViewInProperty");
			if (item) {
				item.reader.build();
				this.context.addBuild(function() {
					var instance = item.reader.context.getInstance(this.context.ptr);
					var o = {};
					o[item.propertyName] = instance.getView();
					instance.setParent(this.containerElement);
					
					var setter = "set" + item.propertyName.slice(0, 1).toUpperCase() + item.propertyName.slice(1);
					this.containerElement.containerElement.context.getInstance(this.context.ptr).view[setter](instance.getView());
					
					//Ti.API.info("Setting PropertyName " + item.propertyName + " to " + instance.view);
					//this.containerElement.context.data.set("properties", o);
					//Ti.API.info("-- hasNewValue = " + this.containerElement.context.data.get("properties").window);
				}, this);
			}
			
		}
		
	});
	
})();
