/**
 * @author theluk
 */

UI.currentApp = null;

AppInstances = [];
AppInstancesByID = {};

UI.App = Class.extend({
	
	init: function(options) {
		if (UI.currentApp) throw "only one UI.App per Application (per Context) please!";
		UI.currentApp = this;
		
		_.bindAll(this, "releaseCurrent");
		
		this.options = _.defaults(options, {
			source: "ui/layout.xml",
			openOnLaunch : true,
			launchViewID : "#main"
		});
		
		this.loader = require("tools/loader");
		
		this.x = x((this.xml = this.loader.read({source:this.options.source}).xml));
		this.mainViews = this.x.section("views").children("view");
		
		
		if (this.options.openOnLaunch) {
			this.launch();
		}
	},
	find: function(fn) {
		return this.getCurrentWrapper().find(fn);
	},
	getCurrentWrapper: function() {
		var instance = AppInstances[AppInstances.length-1];
		return instance.reader.context.getInstance(instance.ptr);
	},
	launch: function() {
		this.openWindow(this.options.launchViewID);
	},
	openWindow: function(id) {
		
		if (AppInstancesByID[id]) {
			var cache = AppInstancesByID[id];
			cache.wrapper.view.open();
			return;
		}
		
		this.releaseCurrent();
		
		var reader = new $.ViewReader({xml : this.mainViews.get(id).value()});
		
		var ptr = reader.context.createInstance();
		var currentInstance = reader.context.getInstance(ptr);
		
		var instRef = {
			reader: reader,
			ptr : ptr,
			wrapper : currentInstance
		};
		AppInstances.push(instRef);
		AppInstancesByID[id] = instRef;
		
		currentInstance.view.open();
		//currentInstance.on("close", this.releaseCurrent);
		
	},
	
	releaseCurrent: function(destroyInstance) {
		if(AppInstances.length < 2) return;
		
		var current = AppInstances.pop();
		delete AppInstancesByID[current.reader.context.get("id")];
		
		if (current.ptr) {
						
			current.reader.context.removeInstance(current.ptr);
			
		}
	}
	
});


