/**
 * @author theluk
 */

(function() {
	var Layout = require("tools/layout");
	var loader = require("tools/loader");
	var x = require("tools/functions").xml;
	
	var Wrapper = Layout.ui.ViewWrapper.extend({

		init : function() {

			this.testXml = loader.read({
				source : "ui/tabtestForSpeedTest.xml"
			}).xml;

			this.testReader = new Layout.reader.ViewReader({
				xml : x(this.testXml).getAll("view").get("#main").value()
			});

			

			this.testResultWrapper = null;

			this.resultXml = loader.read({
				source : "ui/SpeedTest.xml"
			});
			this.updateView({
				loading:true
			});
			
			var self = this;
			self.execute();
			
		},
		execute : function() {
			var result = {
				"xml" : this.runner(this.runXml),
				"native" : this.runner(this.runNative),
				"loading" : false
			};
			this.updateView(result);
		},
		updateView: function(data) {
			if(this.testResultWrapper)
				this.childWrapper.remove(this.testResultWrapper);

			var template = this.resultXml.content;
			var rXml = loader.read({
				content:template,
				data:data
			}).xml;
			var r = new Layout.reader.ViewReader({
				xml : x(rXml).getAll("view").get("#main").value()
			});
			var ptr = r.context.createInstance();
			var instance = r.context.getInstance(ptr);
			//instance.view.open();
			
			this.testResultWrapper = instance;
			this.childWrapper.add(this.testResultWrapper);
		},
		runner : function(fn, iterations) {
			iterations = iterations ? iterations : 20;
			var d = (new Date).getTime(), index = iterations;
			while(--index) {
				fn.call(this);
			}
			return ((new Date).getTime() - d) / iterations;

		},
		runXml : function() {

			var ptr = this.testReader.context.createInstance();
			this.testReader.context.removeInstance(ptr);

		},
		runNative : function() {
			var tabGroup = Ti.UI.createTabGroup();

			var tab1Window = Ti.UI.createWindow({
				backgroundColor : "red"
			});
			var tab1WindowView = Ti.UI.createView();
			var tab1WindowViewLabel = Ti.UI.createLabel({
				text : "Hallo das ist ein TEst"
			});
			tab1WindowView.add(tab1WindowViewLabel);
			tab1Window.add(tab1WindowView);

			var tab1 = Ti.UI.createTab({
				title : "Tab 1",
				window : tab1WindowView
			});

			var fnGetRow = function(index) {
				return Ti.UI.createTableViewRow({
					title : "Das ist ein weiterer Test!",
					id : "row" + index
				});
			};
			var arr = [];
			_.times(5, function(index) {
				arr.push(fnGetRow(index));
			});
			var table = Ti.UI.createTableView({
				data : arr
			});
			var tab2Window = Ti.UI.createWindow({
				backgroundColor : "blue"
			});
			tab2Window.add(table);

			var tab2 = Ti.UI.createTab({
				title : "Tab 2",
				window : tab2Window
			});

			tabGroup.addTab(tab1);
			tabGroup.addTab(tab2);

		}
	});

	module.exports = Wrapper;
	
})();

