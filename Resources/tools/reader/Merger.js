/**
 * @author theluk
 */
(function() {

	var slice = Array.prototype.slice;
	var unshift = Array.prototype.unshift;

	$.Merger = $.ReaderBase.extend({

		merge : function(other) {
			var me = this.context.data.raw;
			var ot = other.raw || {};
			this.context.data.raw = _.extend({}, ot, me);
		}	
	});

})()