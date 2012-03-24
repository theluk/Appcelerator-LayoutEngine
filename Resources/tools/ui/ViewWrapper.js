/**
 * @author theluk
 */

 (function() {
 
 	$.ViewWrapper = Class.extend({
 		
 		init: function(options) {
 			this.options = options || {};
 			var viewInstance = this.options.viewType ? new this.options.viewType(this.options.data.properties) : null;
 			this.view = (this.options.view ? this.options.view : viewInstance);
 			if (!this.view && this.createView) this.createView(this.options.data.properties);
 		}
 		
 	});
 	
 	
 
 })();