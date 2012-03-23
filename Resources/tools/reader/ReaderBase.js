/**
 * @author theluk
 */

(function() {
	var stages = ["beforeRead", "onRead", "beforeChildren", "onChildren", "afterChildren", "afterRead", "checkValid", "beforeBuild", "onBuild", "onBuildChildren", "afterBuild"];

	$.ReaderBase = Class.extend({

		init : function(options) {
			var def = this.initDefaults(), options = _.extend({}, def.options, options), self = this;

			_.each(def.importOptions, function(value) {
				self[value] = options[value];
			});
			this.options = options;

			if(!this.context.reader)
				this.context.reader = this;

			this.x = x(this.xml).single().leave();
			this._creationStage = [];

			this._valid = true;

		},
		initDefaults : function() {
			return {
				importOptions : ["xml", "context"],
				options : {
					context : new Context
				}
			};
		},
		getNew : function(options) {
			options = _.extend({}, (this.options || {}), (options || {}));
			return new this.constructor(options);
		},
		callIf : function() {
			var name = arguments[0];
			if(this[name] && _.isFunction(this[name])) {
				this[name].call(this, Array.prototype.slice(_.toArray(arguments), 1));
			}
		},
		callUntil : function(name) {
			//name = for example beforeBuild, so we need to call "beforeRead" - "afterRead" if not called already;
			if(_.indexOf(this._creationStage, name) > -1)
				return;
			var arr = _.without(stages, this._creationStage);
			var current = null;
			while(( current = arr.shift()) && current != name && this._valid == true) {
				this.callIf(name);
				this._creationStage.push(name);
			}
		},
		beforeRead : function() {
			this.context.data.set("nodeName", this.x.value().nodeName);
			this.context.data.set("nodeType", this.x.value().nodeType);
		},
		read : function() {
			this.callUntil("beforeBuild");
		},
		readChildren : function() {
			this.callUntil("afterRead");
		},
		build : function() {
			this.callUntil();
		},
		execute : function() {
			this._creationStage.length = 0;
			this.callUntil();
		},
		
		destroy : function() {
			delete this.options;
			delete this.context;
			delete this.xml;
			this.x.destroy(false);
			delete this.x;

		}
	});

})();
