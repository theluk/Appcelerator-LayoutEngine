/**
 * @author theluk
 *
 * in module tools/reader
 */

(function() {

	var ctx = {};
	var instances = {};

	$.Context = Class.extend({
		init : function(options) {
			this.__root
			this.__buildchain
			this.__instances = {};
			this.__hasBuild = false;

			this.childs = [];
			this.options = options || {};
			this.parent = this.options.parent || null;
			this.reader = this.options.reader || null;

			this.isProxy = this.options.isProxy == true;
			this.data = (this.options.data && this.options.data instanceof $.ReaderData) ? this.options.data : new $.ReaderData({
				raw : this.options.data
			});
			this.data.context = this;

			this.id = _.uniqueId("_build_context");
			ctx[this.id] = {
				context : this
			};

		},
		createChild : function(options) {
			var isProxy = (options && options.proxy);
			if(isProxy)
				delete options.proxy;

			var c = new $.Context(_.extend({}, this.options, {
				data : null
			}, options, {
				parent : this
			}));
			isProxy ? (this.proxyChild = c) : this.childs.push(c);

			return c;
		},
		addBuild : function(fn, instance) {
			if(!this.__root)
				this.__root = this.root();
			if(!this.__buildchain)
				(this.__buildchain = this.__root.__buildchain = $.Context.createBuildChain(this));
			this.__buildchain.add.call(this, fn, instance);
		},
		onBeforeChainRun : function(ptr) {

		},
		onAfterChainRun : function(ptr) {
			this.__hasBuild = true;
		},
		createInstance : function(rebuild) {
			var id = _.uniqueId("_build_instance_");
			if(!this.__buildchain)
				this.__buildchain = $.Context.createBuildChain(this);

			// Executes the Building-LifeCycle, letting controls set up a build
			if(this.reader && (!this.__hasBuild || rebuild == true))
				this.reader.execute();

			// Runs the BuildChain which results in createing the UI instances etc.
			this.__buildchain.execute(id);

			return this.getInstance(id);

		},
		getInstance : function(ptr) {
			return instances[ptr][this.id];
		},
		_setInstanceInternal : function(ptr, instance) {
			var ns = (instances[ptr] || (instances[ptr] = {}));
			ns[this.id] = instance;
		},
		root : function() {
			if(this.parent)
				return this.parent.root();
			return this;
		},
		createReader : function(xml) {
			return null;
		}
	});

	$.Context.get = function(id) {
		return ctx[id].context;
	};

	$.Context.createBuildChain = function(context) {
		var context = context;
		var data = [];

		var executor = function(ptr) {
			var pointer = ptr;
			context.onBeforeChainRun();
			_.each(data, function(c) {
				c(pointer);
			});
			context.onAfterChainRun();
		};
		return {
			add : function(fn, instance) {
				var func = fn, instance = instance, context = this;

				data.push(function(ptr) {
					var tSetter = context.setInstance, tGetter = context.getInstance, tPtr = context.ptr, pointer = ptr;

					context.setInstance = function(instance) {
						$.Context.prototype._setInstanceInternal.call(context, pointer, instance);
					};

					context.ptr = pointer;

					context.getInstance = function() {
						return $.Context.prototype.getInstance.call(context, pointer);
					};

					func.apply(instance, [context].concat(_.toArray(arguments)));

					context.setInstance = tSetter;
					context.getInstance = tGetter;
					context.ptr = tPtr;
				});
			},
			execute : executor,
			destroy : function() {
				context = null;
				data.length = 0;
				data = null;
				w = null;
				instanceSetter = null;
				executor = null;
			}
		};
	};
})()