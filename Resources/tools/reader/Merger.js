/**
 * @author theluk
 */
(function() {

	var slice = Array.prototype.slice;
	var unshift = Array.prototype.unshift;

	$.Merger = $.ReaderBase.extend({

		getMergeTarget: function() {
			return this.context.data;
		},
		getDeepMergeProperties: function() {
			return [];
		},
		merge : function(other) {
			
			var me = this.getMergeTarget();
			var ot = _.extend({}, other.raw) || {};
			
			
			var deep = this.getDeepMergeProperties();
			for(var i = 0;i < deep.length;i++) {
				if (ot.hasOwnProperty(deep[i])) {
					me.raw[deep[i]] = _.extend({}, ot[deep[i]], me.raw[deep[i]]);
					delete ot[deep[i]];
				}
			}
			me.raw = _.extend({}, ot, me.raw);
			
		}	
		
	});

})();
/*
for(name in me.raw) {
				Ti.API.info("Merge Source " + name + " " + me.raw[name]);
			}
			
			for(name in ot) {
				Ti.API.info("Merge Target " + name + " " + ot[name]);
			}
			for(name in me.raw) {
				Ti.API.info("Merge Result " + name + " " + me.raw[name]);
			}*/
			