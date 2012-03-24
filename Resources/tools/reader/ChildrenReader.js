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
		
		getItemReaderType: function() {
			return $.ViewReader;
		},
		
		getItemReaderOptions: function() {
			return {
				context:this.context.createChild(),
				container : this.containerElement
			};
		},
		appendInstance: function(instance) {
			var i = this.containerElement.context.getInstance(this.context.ptr);
			// i is a viewwrapper, viewwrapper should implement add(instance, addMethod)
			i.add(instance, this.context.data.get("appendMethod"));
		}
		
	});
	
	
})();
