/**
 * @author theluk
 */

(function() {
	
	
	
	$.ComplexTypeReader = $.Merger.extend({
		
		init: function() {
			this._super();
			this._itemReaderType = $.ComplexTypeReader;
		},
		
		getItemReader: function(xml) {
			if (!xml || xml.nodeName == "#text") return null;
			var ctor = this.getItemReaderType(xml) || $.Reader;
			return new ctor(this.getItemReaderOptions(xml));
		},
		getItemReaderOptions : function(xml) {
			return {
				context: this.context.createChild(),
				xml: xml
			};
		},
		getItemReaderType: function(xml) {
			return this._itemReaderType;
		},
		setItemReaderType: function(value) {
			this._itemReaderType = value;
		},
		onChildren: function() {
			
			this._super();
			
			var children = [];
			
			this.x.children().each(_.bind(function(el) {
				Ti.API.info("ComplexTypeReader: Trying Read Child " + el.nodeName);
				var reader = this.getItemReader(el);
				if (reader) {
					Ti.API.info("Child Element Read : " + el.nodeName);
					children.push(reader);
					reader.read();
					Ti.API.info("Child Element Finish Read");
				}
			}, this));
			this.context.data.set("ChildrenItemReaders", children);
			
		},
		appendInstance: function(child) {
			var instance = this.context.getInstance();
			// instance.add(child);
		},
		onBuildChildren : function() {
			
			
			var children = this.context.data.get("ChildrenItemReaders");
			if (children && children.length > 0) {
				_.each(children, _.bind(function(child) {
					child.build();
						
					this.context.addBuild(function() {
						var ptr = this.context.ptr;
						var instance = child.context.getInstance(ptr);
						this.appendChild(child);
					}, this);
				
				}, this));
			}
			this._super();
			
		}
		
	});
	
})();
