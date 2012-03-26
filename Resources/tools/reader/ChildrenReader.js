/**
 * @author theluk
 */

(function() {
	
	$.ChildrenReader = $.Reader.extend({
		
		init: function() {
			this._super();
			this.containerElement = this.options.container;
			
		},
		
		onRead: function() {
			this._super();
			var appendMethod = this.x.attr("appendMethod").value() || "add";
			this.context.data.set("appendMethod", appendMethod);
		},
		
		getItemReaderType: function(xml) {
			if (!xml || xml.nodeName != "view") return;
			return $.ViewReader;
		},
		
		getItemReaderOptions: function(xml) {
			return {
				context:this.context.createChild(),
				xml:xml
			};
		},
		onChildren: function() {
			this._super();
			
			var children = this.context.data.get("ChildrenItemReaders");
		},
		onBuildChildren: function() {
			var children = this.context.data.get("ChildrenItemReaders");
			
			this._super();
		},
		appendInstance: function(instance) {
			var i = this.containerElement.context.getInstance(this.context.ptr);
			if (!i && this.containerElement.context.isProxy) {
				i = this.containerElement.context.parent.getInstance(this.context.ptr);
			}
			// i is a viewwrapper, viewwrapper should implement add(instance, addMethod)
			i.add(instance.context.getInstance(this.context.ptr), this.context.data.get("appendMethod"));
		}
		
	});
	
	
})();
