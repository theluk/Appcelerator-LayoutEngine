/**
 * @author theluk
 */

(function() {

	UI.ViewWrapper = Class.extend({

		init : function(options) {
			this.options = options || {};
			this.context = this.options.context;
			if(!this.context)
				throw "UI.ViewWrapper needs 'Context' in init";

			//Ti.API.info("--- Init ViewWrapper");
			//Ti.API.info("--- ViewWrapper viewType: " + this.options.viewType.toString());
			// viewType = Ti.UI.createView; dont create with "new" keyword;
			var viewInstance = this.options.viewType ? this.options.viewType(this.options.context.data.get("properties")) : null;
			var props = this.options.context.data.get("properties") || {};

			this.view = (this.options.view ? this.options.view : viewInstance);
			this.children = [];
			this.ptr = (this.options.ptr)

			if(!this.view && this.createView)
				this.view = this.createView(this.options.context.data.get("properties"));

			if(!this.view)
				throw "Could not create ViewWrapper, view is null...";
		},
		getView : function() {
			return this.view;
		},
		_viewWrapper : function(value) {
			var result = ( value instanceof UI.ViewWrapper ? value : new UI.ViewWrapper({ view : value}));
			if(!result)
				throw "UI.ViewWrapper._viewWrapper: value must be Ti.UI.View or Layout.UI.ViewWrapper";
			return result;
		},
		/**
		 * @instance : the ViewWrapper or an Ti.UI.View
		 * @method : "add", "addTab", "addAnythingelse"
		 */
		add : function(instance, method) {
			var otherWrapper = this._viewWrapper(instance);
			this.children.push(otherWrapper);
			this.view[method || "add"](otherWrapper.view);
		},
		remove : function(instance, method) {
			var match = _.isNumber(instance) ? this.children[instance] : null;
			if(!match) {
				var matches = _.filter(this.children, function(i) {
					return i.view === instance;
				});
				if(matches.length > 0)
					match = matches[0];
			}
			if(!match && instance instanceof UI.ViewWrapper) {
				var index = _.indexOf(this.children, instance);
				if(index < 0 || (this.children.length - 1) < index)
					throw "UI.ViewWrapper.remove : UI.ViewWrapper not found in Children Collection";
				match = this.children[index];
			}
			if(!match)
				throw "UI.ViewWrapper remove: Input was not a valid child";

			this.children.splice(_.indexOf(this.children, match), 1);
			this.view[method || "remove"](match.view);
		},
		setParent: function() {}
		
	});

})();
