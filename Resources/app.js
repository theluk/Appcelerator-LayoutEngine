//_ = require("lib/underscore");

//Ti.include("/test/tests.js");

var Layout = require("tools/layout");
var x = require("tools/functions").xml;
var loader = require("tools/loader");
var _ = require("lib/underscore");

var xml = loader.read({
	source: "ui/tabtest.xml"
}).xml;

var reader = new Layout.reader.ViewReader({
	xml: x(xml).getAll("view").get("#main").value()
});

var ptr = reader.context.createInstance();

var tabGroup = reader.context.getInstance(ptr);

var tab1 = _(tabGroup.children).find(function(el) { return el.view.id = "tab1"; });
var tab2 = _(tabGroup.children).find(function(el) { return el.view.id = "tab2"; });

if (!tab1 || !tab2) throw "no tabs";

if (!tab1.view.window) throw "1 no tab";
if (!tab2.view.window) throw "2 no tab";


tabGroup.view.open();
