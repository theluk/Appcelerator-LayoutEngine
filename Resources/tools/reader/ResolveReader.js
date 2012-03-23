/**
 * @author theluk
 */

(function() {

	$.ResolveReader = $.ComplexTypeReader.extend({

		init : function() {
			this._super();
			this._resolved = null;
		},
		afterRead : function() {
			
			this._super();

			var data = this.context.data;
			var res = this.resolve();
			
			if(res.any) {
				var Reader = (this.context.createReader() || this.constructor);
				var resolvedData = null;
				var reader = new Reader({
					xml : res.result,
					context : this.context.createChild({
						proxy : true
					})
				}).read();

				this.merge(data, reader.context.data);
			}

		},
		resolve : function(update) {
			var empty = null, results;

			if(this._resolved && !(update == true))
				return this._resolved;

			var defaults = {
				any : false,
				many : false,
				result : null
			}, result = null, shouldResolve = (this.x.hasRef() || this.x.hasSrc());

			if(!shouldResolve || 
				(( result = x.resolveRef(current)) === current) || 
					(( result = x.resolveSrc(current)) === current))
						return (this._resolved = defaults);

			return (this._resolved = {
				any : true,
				many : x.norm(result).length > 1,
				result : result
			});

		}
	});

})();
