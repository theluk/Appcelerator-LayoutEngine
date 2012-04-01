/**
 * @author theluk
 */


(function() {
	
	Data.Events = {
		_eventHandlers : [],
		_resolveEventName : function(name) {
			if (!this.__event_id) this.__event_id = _.uniqueId("__event__");
			return this.__event_id + name; 
		},
		on : function(name, fn) {
			this._eventHandlers.push({name : name, fn : fn});
			Ti.App.addEventListener(this._resolveEventName(name), fn);
		},
		off : function(name, fn) {
			if (name == "all" && typeof(fn) == "undefined") {
				var handler;
				while((handler = this._eventHandlers.shift())) {
					Ti.App.removeEventListener(this._resolveEventName(handler.name), handler.fn);
				}
				return;
			}
			var match = _.find(this._eventHandlers, function(h) { return h.name == name && h.fn == fn; });
			var index = _.indexOf(this._eventHandlers, match);
			if (index) this._eventHandlers.splice(index, 1);
			Ti.App.removeEventListener(this._resolveEventName(name), fn);
		},
		trigger : function(name, data) {
			Ti.App.fireEvent(this._resolveEventName(name), _.defaults(data, {source:this, eventName:name}));
		}
	}
	
})();
