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
			var ctor = this.getItemReaderType(xml);
			if (!ctor) return; // throw "ComplexTypeReader.getItemReader : Ctor is undefined";
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
				var reader = this.getItemReader(el);
				if (reader) {
					children.push(reader);
					reader.read();
				}
			}, this));
			if (children.length > 0) this.context.data.set("ChildrenItemReaders", children);
		},
		onBuildChildren : function() {
			var children = this.context.data.get("ChildrenItemReaders");
			
			if (children && children.length > 0) {
				_.each(children, _.bind(function(child) {

					child.build();
					if (!child._valid) return;
					if (this.appendInstance) this.context.addBuild(function() {
						this.appendInstance(child, this.context.ptr);
					}, this);
				
				}, this));
			}
			this._super();
			
		}
		
	});
	
})();
