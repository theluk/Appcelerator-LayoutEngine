//_ = require("lib/underscore");

//Ti.include("/test/tests.js");

var Layout = require("tools/layout");
var x = require("tools/functions").xml;
var loader = require("tools/loader");
var _ = require("lib/underscore");

var xml = loader.read({
	source:"ui/layoutDepTest.xml"
}).xml;

var reader = new Layout.reader.ViewReader({
	xml: x(xml).getAll("view").get("#main").value()	
});

var ptr = reader.context.createInstance();
var wrapper = reader.context.getInstance(ptr);

wrapper.view.open();

/*var xml = loader.read({
	source : "ui/tabtestForSpeedTest.xml"
}).xml;

var reader = new Layout.reader.ViewReader({
	xml : x(xml).getAll("view").get("#main").value()
});

var fnCreateXml = function() {
	var ptr = reader.context.createInstance();
	reader.context.removeInstance(ptr);
};

var fnCreateNative = function() {
	
	var tabGroup = Ti.UI.createTabGroup();
	
	var tab1Window = Ti.UI.createWindow({
		backgroundColor:"red"
	});
	var tab1WindowView = Ti.UI.createView();
	var tab1WindowViewLabel = Ti.UI.createLabel({text:"Hallo das ist ein TEst"});
	tab1WindowView.add(tab1WindowViewLabel);
	tab1Window.add(tab1WindowView);
	
	var tab1 = Ti.UI.createTab({
		title:"Tab 1",
		window:tab1WindowView
	});
	
	var fnGetRow = function(index) {
		return Ti.UI.createTableViewRow({title:"Das ist ein weiterer Test!", id:"row"+index});
	};
	var arr = [];
	_.times(5, function(index) {
		arr.push(fnGetRow(index));
	});
	
	var table = Ti.UI.createTableView({
		data: arr
	});
	var tab2Window = Ti.UI.createWindow({
		backgroundColor:"blue"
	});
	tab2Window.add(table);
	
	var tab2 = Ti.UI.createTab({
		title:"Tab 2",
		window:tab2Window
	});
	
	tabGroup.addTab(tab1);
	tabGroup.addTab(tab2);
	
}


var fnRun = function(fn) {
	var d = (new Date).getTime(), index=50;
	while(--index) {
		fn();
	}
	return ((new Date).getTime() - d) / 50;
}

//fnCreateXml();

var result = {
	"native" : fnRun(fnCreateNative),
	"xml" : fnRun(fnCreateXml)
};

var rXml = loader.read({
	source : "ui/SpeedTest.xml",
	data: result
}).xml;

var r = new Layout.reader.ViewReader({
	xml : x(rXml).getAll("view").get("#main").value()
});
var d = (new Date).getTime();
var ptr = r.context.createInstance();
var instance = r.context.getInstance(ptr);
instance.view.open();
var result = ((new Date).getTime() - d);
Ti.API.info("--- Loadingtime " + (result));
*/

/*var tabGroup = reader.context.getInstance(ptr);

 var tab1 = _(tabGroup.children).find(function(el) { return el.view.id = "tab1"; });
 var tab2 = _(tabGroup.children).find(function(el) { return el.view.id = "tab2"; });

 if (!tab1 || !tab2) throw "no tabs";

 if (!tab1.view.window) throw "1 no tab";
 if (!tab2.view.window) throw "2 no tab";

 tabGroup.view.open();
 */