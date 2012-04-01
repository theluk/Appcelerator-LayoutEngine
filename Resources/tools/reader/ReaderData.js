/**
 * @author theluk
 */

(function() {
	
	$.ReaderData = Class.extend({
		init: function(options) {
			this.raw = (options && options.raw ? options.raw : {});
			this.context = options.context;
			this.options = options;
		},
		set: function(name, value) {
			var previous = this.get(name);
			
			if (value && _.isObject(value) && !_.isArray(value) && !_.isFunction(value)) value = _.extend({}, value);
			
			if (previous && _.isObject(value) && !_.isArray(value) && !_.isFunction(value)) {
				value = _.extend({}, previous, value);
			}
			this.raw[name] = value || previous;
		},
		match: function(name, value, proxy) {
			return (this.get(name) == value || (proxy == true && this.context.proxyChild && this.context.proxyChild.data.match(name, value, proxy)));
		},
		get: function(name) {
			return this.raw[name];
		},
		extend: function() {
			_.extend.apply(_, [this.raw].concat(_.toArray(arguments)));
		}
	});
	
})();
