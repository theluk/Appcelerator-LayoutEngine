/**
 * @author theluk
 */

(function() {

	$.ResolveReader = $.ComplexTypeReader.extend({

		init : function() {
			this._super();
			this._resolved = null;
			this._resolvedReaders = null;
		},
		beforeRead: function() {
			this._super();
			this._resolvedReaders = [];
		},
		getResolvedItemReader: function(xml) {
			return this.constructor;
		},
		afterRead : function() {
			
			this._super();
			
			var data = this.context.data;
			var res = this.resolve();
			
			if(res.any) {
				_.each(res.result, _.bind(function(current) {
					
					var Reader = this.getResolvedItemReader(current);
					var resolvedData = null;
					var reader = new Reader({
						xml : current, 
						context : this.context.createChild({
							proxy : true
						})
					});
					
					reader.read();
					this._resolvedReaders.push(reader);
				
				}, this));
				
				var result = this.validateManyGetSingle(this._resolvedReaders);
				
				try {
					
					var other  = result.context.data.get("ChildrenItemReaders");
					var me = this.context.data.get("ChildrenItemReaders");

					
					this.merge(result.context.data);
					
					me = this.context.data.get("ChildrenItemReaders");
					
					
				} catch(e) {};
				
				
				this.merge(result.context.data);
				
			}

		},
		validateManyGetSingle: function(readers) {
			var results = _(readers).chain().filter(function(r) { return r._valid == true; }).first().value();
			return results;
		},
		resolve : function(update) {
			var empty = null, results, isResolved = false;

			if(this._resolved && !(update == true))
				return this._resolved;

			var defaults = {
				any : false,
				many : false,
				result : null
			}, result = null;
			
			
			if (this.x.hasRef().value() && !(x.single( result = x.resolveRef(this.xml)) === this.xml)) {
				isResolved = true;
			}
			
			if (this.x.hasSrcRef().value() && !(x.single( result = x.resolveSrc(this.xml, this.x.attr("ref").value())) === this.xml)){ 
				isResolved = true;
			}
			
			return isResolved ? (this._resolved = {
				any : true,
				many : x.norm(result).length > 1,
				result : x.norm(result)
			}) : (this._resolved = defaults);

		}
	});

})();
