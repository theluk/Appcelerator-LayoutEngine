/**
 * @author theluk
 */

(function() {

	var createEvent = function(name, settings) {
		if (!this.view || !UI.App) return;
		var fn = null;
		var loading = settings.hasOwnProperty("loading") ? settings.loading : null;
		
		if (settings.hasOwnProperty("open")) {
			fn = _.bind(function(data) {
				if (UI.currentApp) {
					var loadWrapper = null;
					if (loading) {
						loadWrapper = UI.currentApp.find(function(wrapper) {
							var result = wrapper.context.data.get("id") == loading.slice(1);
							return result;
						});
					}
					if (loadWrapper) loadWrapper.view.setVisible(true);
					UI.currentApp.openWindow(settings.open, data);
					if (loadWrapper) loadWrapper.view.setVisible(false);
				}	
			}, this);
		}
		
		if (!fn) return;
		this.on(name, fn);
		return fn;
	};

	UI.ViewWrapper = Class.extend({

		init : function(options) {
			this.options = options || {};
			this.context = this.options.context;
			this._delegatedEvents = {};
			this._delegatedEventsSettings = null;
			
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
		delegateEvents: function(obj) {
			this.undelegateEvents();
			this._delegatedEventsSettings = obj, self = this;
			for(name in obj) {
			 	self._delegatedEvents[name] = createEvent.call(self, name, obj[name]);
			}
		},
		find: function(fn) {
			if (fn(this)) {
				return this;
			} else {
				var value = null;
				for(var i=0;i < this.children.length;i++) {
					value = this.children[i].find(fn);
					if (value) break;		
				}
				return value;
			}
		},
		undelegateEvents : function() {
			var obj = this._delegatedEventsSettings, self = this;
			if (obj) {
				for(name in obj) {
					self.off(name, self._delegatedEvents[name]);
				}
			}
			this._delegatedEventsSettings = null;
		},
		on: function(name, fn) {
			this.view.addEventListener(name, fn);
		},
		off : function(name, fn) {
			this.view.removeEventListener(name, fn);
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
		setParent: function() {},
		destroy: function() {
			this.undelegateEvents();
			this.context = null;
			this.view = null;
			_.each(this.children, function(child){
				child.destroy();
			});
			this.children = null;
			this.options = null;
			this.ptr = null;
			
		}
		
	});

})();
