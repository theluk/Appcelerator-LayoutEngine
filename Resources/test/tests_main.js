(function() {

	// To learn how to write Jasmine tests, please read Jasmine documentation:
	// https://github.com/pivotal/jasmine/wiki

	Ti.include("../tools/layoutPropertiesMap.js");

	describe("XmlFunctions", function() {
		
		var x = require("tools/functions").xml;
		var loader = require("tools/loader");
		var xml = loader.read().xml;
		
		it("Ti.xml.parse any string", function() {
			
			var xml3 = loader.read({
				content: "<string><test id=\"bla\"><%=test%></test></string>",
				data : {test:"Fuck youuuu"}
			}).xml;
			
			expect(x(xml3).children("test").text().destroy()).toEqual("Fuck youuuu");
			expect(x(xml3).children("test").attr("id").destroy()).toEqual("bla");
			expect(xml3.documentElement.getText()).toEqual("Fuck youuuu");
			
			var xml2 = Ti.XML.parseString("<string></string>");
			expect(xml2.documentElement.tagName).toEqual("string");
			
		});
		
		it("Function: allAttr", function() {
			var refObj = x(xml.documentElement).getAll("view").get("#main") 	// main window...
								.allAttr("properties id module notExistentAttribute")
								.destroy(); 									// destroys...
			expect(refObj).toEqual({
				properties : "title:Welcome!;backgroundColor:red;fullscreen:true;exitOnClose:true;className:habrada;",
				id:"main",
				module:"ui/mainWindow"
			});	
		});
		
		it("Chain Function: Into", function() {
			
			var refObj = {};
			x(xml.documentElement).getAll("view").get("#main") 	// main window...
				.attr("properties").into(refObj) 				// puts properties into refObject
				.end() 											// goes back to #main
				.attr("id").into(refObj)						// puts id inot refObje
				.end()											// goes back to main
				.hasAttr("value").into(refObj)					// puts hasAttr into refObj
				.destroy(); 									// destroys...
				
			expect(refObj).toEqual({
				attrProperties : "title:Welcome!;backgroundColor:red;fullscreen:true;exitOnClose:true;className:habrada;",
				attrId:"main",
				hasAttrValue:false
			});
			
		});
		
		it("Function: Sections", function() {
			
			var content = x(xml.documentElement).section("abstract views view").attr("id").destroy();
			expect(content).toEqual("justTesting");
			
		});
		
		it("Function: parseStyle", function() {
			var content = x(xml.documentElement).getAll("view").get("#main").attr("properties").parseInlineProperties().destroy();
			
			expect(content).toEqual({
				title:"Welcome!",
				backgroundColor:"red",
				fullscreen:true,
				exitOnClose:true,
				className:"habrada"
			});
			
			content = x(xml.documentElement).getAll("styles").get().parseInlineProperties().destroy();
			expect(content).toEqual({
				backgroundColor:"red",
				title:"Hallo wie gehts dir",
				top:34
			});	
			
			content = x(null).parseInlineProperties().destroy();
			expect(content).toEqual({});
			
			content = null;
		});
		
		it("Function: src", function() {
			var attrValue = x(xml.documentElement).getAll("view").get("#myRefItem").resolveSrc().attr("testAttr").destroy();
			expect(attrValue).toEqual("myAttrSrc");
			
			var xBase = x(xml.documentElement).getAll("view").get("#main").destroy();
			expect(xBase).toBe(x(xBase).resolveSrc().destroy());
			
		});
			
		it("Function: resolveRef", function() {
			var xBase = x(xml.documentElement).getAll("view").get("#main").destroy();
			expect(xBase).toBe(x(xBase).resolveRef().destroy());
			
			var xEl = x(xml.documentElement)
							.getAll("view")
							.filter(function(item) {
								return x.hasRef(item);
							});
			expect(xEl.value().length > 0).toBeTruthy();
							
			var resolved = xEl.resolveRef();
			
			expect(resolved.attr("id").value()).toEqual("justTesting");
			
			resolved = null;
			xEl.destroy();
			xEl = null;
					
		});
			
		it("Function: get", function() {
			
			var	views = x.children(xml.documentElement, "views");
			expect(_.isArray(x.single(views))).toBeFalsy();
			
			var children = x.getAll(views, "view");
			
			var	xEl = x(children);
			
			expect(xEl.attr("id").value()).toEqual("main");
			expect(xEl.get(0).value()).toBeDefined();
			expect(xEl.get(1).value()).toBeDefined();
			
			expect(xEl.get("#nothingSpecial").attr("id").value()).toEqual("nothingSpecial");
								
			/*expect(xEl.end().get("view")
				.filter(function(item) {
					return x.hasAttr(item, "id");
				})
				.map(function(item) {
					return x.attr(item, "id");
				}).value()).toEqual(["main", "nothingSpecial"]);
			*/
			views = null;
			children = null;
			xEl.destroy();
			xEl = null;
			
		});
		
		it("Function: norm()", function() {
			expect(x.norm("test")).toEqual(["test"]);
			expect(x.norm([["norm"]])).toEqual(["norm"]);
			expect(_.isArray(x.norm()) && x.norm().length == 0).toBeTruthy();
			expect(x.norm({test:"hallo"})).toEqual([{test:"hallo"}]);
			var fnTest = function(collection) {
				expect(x.norm(arguments)).toEqual(["das", "ist", "ein", "test"]);
			};
			fnTest("das", "ist", "ein", "test");
			
		});
	
		it("destroy, reset", function() {
			
			var xEl = x(xml).norm().leave(); 
			var	views = xEl.getAll("view");
			var	main = views.get("#main");
			var	module = main.attr("module").reset();
			
			expect(xEl.wrapper).toBeDefined();
			expect(views.wrapper).toBeUndefined();
			expect(main.wrapper).toBeUndefined();
			expect(module).toEqual("ui/mainWindow");
			
			
		});
	
	});

	describe("Base.js", function() {

		it("should have created a Class Object with multiple props", function() {
			var Class = require("lib/base");
			var MyClass = Class.extend({
				test : 1
			}, {
				test2 : 2,
				testFn: function() {
					return this.test;
				}
			});
			var myClass = new MyClass();
			expect(myClass.test).toEqual(1);
			expect(myClass.test2).toEqual(2);
			expect(myClass.testFn()).toEqual(1);
		});
	});
	
	describe("PropertiesMaper", function() {

		it("should convert", function() {
			expect(map.font("Helvetica italic bold 24px")).toEqual({
				fontFamily : "Helvetica",
				fontStyle : "italic",
				fontWeight : "bold",
				fontSize : 24
			});
			expect(map.anchorPoint("23x24")).toEqual({
				x : 23,
				y : 24
			});
		});
	});
	
	describe("Loader", function() {

		it("should load successfully", function() {

			var loader = require("tools/loader");

			var result = loader.read();
			expect(result.xml).toBeDefined();
			expect(result.template).toBeDefined();
			expect(result.content).toBeDefined();
			result = loader.read({
				source : "ui/layout2.xml",
				data : {
					name : "Das ist ein TEst!!!"
				}
			});
			expect(result.content).toMatch(/Das ist ein TEst\!\!\!/g);
			result = loader.read({
				template : result.template,
				data : {
					name : "ein Zweiter Test Juhuuu"
				}
			});
			expect(result.content).toMatch(/ein Zweiter Test Juhuuu/g);
			result = loader.read({
				content : result.content
			});

			expect(result.content).toMatch(/ein Zweiter Test Juhuuu/g);
			result = null;
			loader = null;
		});
	});

})();
