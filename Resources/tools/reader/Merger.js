/**
 * @author theluk
 */
(function() {

	var slice = Array.prototype.slice;
	var unshift = Array.prototype.unshift;

	$.Merger = $.ReaderBase.extend({

		init : function() {
			this._mergers = [];
		},
		addMerger : function(fn) {
			var me = this;
			this._mergers.unshift(function() {
				return fn.apply(me, arguments);
			});
		},
		merge : function(other) {
			var me = this.context.data.raw;
			var ot = other.raw || {};
			this.context.data.raw = _.extend({}, ot, me);
		},
		destroy : function() {

			this._mergers.length = 0;
			delete this._mergers;

			this._super();

		}
	});

})()