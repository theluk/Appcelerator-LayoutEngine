/**
 * @author theluk
 */

(function() {
	
	$.ReaderBase = Class.extend({

		init : function(options) {
			var def = this.initDefaults(options), 
				options = _.extend({}, def.options, (options || {})), 
				self = this;

			_.each(def.importOptions, function(value) {
				self[value] = options[value];
			});
			
			if (!this.xml) throw "ReaderBase: XML was not specified!";
			
			this.options = options;

			if(!this.context.reader)
				this.context.reader = this;

			this.x = x(this.xml).single().leave();
			this._creationStage = [];

			this._valid = true;

		},
		initDefaults : function(options) {
			return {
				importOptions : ["xml", "context"],
				options : {
					context : new $.Context(options.data ? {data:options.data} : null)
				}
			};
		},
		getNew : function(options) {
			options = _.extend({}, (this.options || {}), (options || {}));
			return new this.constructor(options);
		},
		callIf : function() {
			var name = _.toArray(arguments)[0];
			if(this[name] && _.isFunction(this[name])) {
				this[name].apply(this, Array.prototype.slice(_.toArray(arguments), 1));
			}
		},
		callUntil : function(name) {
			//name = for example beforeBuild, so we need to call "beforeRead" - "afterRead" if not called already;
			if(_.indexOf(this._creationStage, name) > -1)
				return;
			var arr = _.without($.ReaderBase.Stages, this._creationStage);
			var current = null, self = this;
			while(( current = arr.shift()) && current != name && this._valid == true) {
				self.callIf(current);
				self._creationStage.push(current);
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
	
	$.ReaderBase.Stages = ["beforeRead", "onRead", "beforeChildren", "onChildren", "afterChildren", "afterRead", "checkValid", "beforeBuild", "beforeParentBuild", "onBuild", "onBuildChildren", "afterBuild"];
	
	_.each($.ReaderBase.Stages, function(fnName) {
		if (fnName == "beforeRead") return;
		$.ReaderBase.prototype[fnName] = function() {};
	});

})();
