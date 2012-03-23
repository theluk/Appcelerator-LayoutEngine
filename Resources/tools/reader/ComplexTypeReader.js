/**
 * @author theluk
 */

(function() {
	
	
	
	$.ComplexTypeReader = $.Merger.extend({
		
		init: function() {
			this._super();
		},
		
		getItemReader: function(xml) {
			if (!xml || xml.nodeType == "#text") return null;
			var ctor = this.getItemReaderType() || $.Reader;
			return new ctor({
				context: this.context.createChild()
			});
		},
		getItemReaderOptions : function() {
			return {
				context: this.context.createChild()
			};
		},
		getItemReaderType: function(xml) {
			return null;
		},
		onChildren: function() {
			var children = [];
			
			this.x.single().children().each(_.bind(function(el) {
				var reader = this.getItemReader(xml);
				if (reader) {
					children.push(reader);
					reader.read();
				}
			}, this));
			
			this.context.data.set("ChildrenItemReaders", children);
			
			this._super();
		},
		appendChild: function(child) {
			
		},
		onBuildChildren : function() {
			
			var children = this.context.data.get("ChildrenItemReaders");
			if (children && children.length > 0) {
				_.each(children, _.bind(function(child) {
					child.build();
					this.context.addBuild(function() {
						
					}, this);
				}, this));
			}
			
			this._super();
		}
		
	});
	
})();
