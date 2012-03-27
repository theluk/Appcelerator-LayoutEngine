/**
 * @author theluk
 */

(function() {

	//var plattforms = ["android", "iphone", "ipad", "tablet", "plattform"];

	var validateDependency = function(properties, data) {
		if(properties.plattform) {
			if(data.plattform != properties.plattform)
				return false;
		}
		if(properties.minHeight || properties.minWidth) {
			var minHeight = properties.minHeight || 0, minWidth = properties.minWidth || 0;
			if(data.height < parseInt(minHeight) || data.width < parseInt(minWidth))
				return false;
		}
		if(properties.maxHeight || properties.maxWidth) {
			var maxHeight = properties.maxHeight || 9999, maxWidth = properties.maxWidth || 9999;
			if(data.height > parseInt(maxHeight) || data.width > parseInt(maxWidth))
				return false;
		}
		return true;
	};

	$.PlattformDependencyReader = $.ResolveReader.extend({

		beforeRead : function() {
			
			this._super();
			
			var dependencySettings = this.x.attr("needs").parseInlineProperties().value();
			this.context.data.set("dependency", dependencySettings);
			
		},
		afterRead : function() {

			this._super();

			if(this.context.data.get("dependency")) {

				var data = {
					height : Ti.Platform.displayCaps.getPlatformHeight(),
					width : Ti.Platform.displayCaps.getPlatformWidth(),
					plattform : Ti.Platform.osname
				};

				this._valid = validateDependency(this.context.data.get("dependency"), data);

			}
			
		}
	});
})();
