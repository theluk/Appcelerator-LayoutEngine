(function() {

	// To learn how to write Jasmine tests, please read Jasmine documentation:
	// https://github.com/pivotal/jasmine/wiki

	Ti.include("../tools/layoutPropertiesMap.js");

	describe("Reader", function() {
		var reader = require("tools/layout").reader;
		var x = require("tools/functions").xml;
		var loader = require("tools/loader");
		var xml = loader.read().xml;
		
		it("Build Chain", function() {
			
			var xml = loader.read({
				source: "ui/layoutViewReader.xml"
			}).xml;
			
			var base = new reader.ViewReader({
				xml : x(xml).getAll("view").get("#test").value()
			});
			
			var iId = base.context.createInstance();
			var instance = base.context.getInstance(iId);
			
			expect(instance instanceof Ti.UI.View).toBeTruthy();
			
		});
		
		it("ViewReader", function() {
			
			var xml = loader.read({
				source: "ui/layoutViewReader.xml"
			}).xml;
			
			var base = new reader.ViewReader({
				xml : x(xml).getAll("view").get("#test").value()
			});
			
			base.read();
			
			expect(base.context.data.get("Type")).toBeDefined();
			expect(base.context.data.get("properties")).toEqual({
				backgroundColor:"red",
				top:10,
				bottom:20
			});
			
			base = new reader.ViewReader({
				xml: x(xml).getAll("view").get("#test2").value()
			});
			base.read();
			
			expect(base.context.data.get("properties")).toEqual({
				backgroundColor:"red",
				top:10,
				bottom:20
			});
			
			base = new reader.ViewReader({
				xml: x(xml).getAll("view").get("#test3").value()
			});
			base.read();
			expect(base.context.data.get("properties")).toEqual({
				backgroundColor:"white",
				top:1
			});
			
			base.build();
			
		});
		
		it("Dependency Resolver 2", function() {
			
			var xml = loader.read({
				source : "ui/layoutDependency.xml"
			}).xml;
			
			var Base = reader.PlattformDependencyReader.extend({
				onRead: function() {
					if (this.x.hasAttr("test").value()) {
						this.context.data.set("test", this.x.attr("test").value());
					}
				}
			});
			
			var base = new Base({
				xml: x(xml).getAll("view").get("#test7").value()
			});	
			
			base.read();
			
			expect(base.context.data.get("test")).toEqual("valid");
			
		});
		
		it("Dependency Resolver", function() {
			
			var xml = loader.read({
				source : "ui/layoutDependency.xml"
			}).xml;
			
			var base;
			var fnGetReader = function(id) {
				base = new reader.PlattformDependencyReader({
					xml: x(xml).getAll("view").get("#" + id).value()
				});	
			};
			fnGetReader("test");
			base.read();
			expect(base._valid).toBeTruthy();
			
			fnGetReader("test2");
			base.read();
			expect(base._valid).toBeFalsy();
			
			fnGetReader("test3");
			base.read();
			expect(base._valid).toBeTruthy();
			
			fnGetReader("test4");
			base.read();
			expect(base._valid).toBeFalsy();
			
			fnGetReader("test5");
			base.read();
			expect(base._valid).toBeTruthy();
			
			fnGetReader("test6");
			base.read();
			expect(base._valid).toBeFalsy();
			
			
		});
		
		it("Resolver", function() {
			
			var xml = loader.read({
				source:"ui/layoutResolver_1.xml"
			}).xml;
			
			var Base = reader.ResolveReader.extend({
				onRead: function() {
					if(this.x.hasAttr("attr").value()) { 
						this.context.data.set("attr1", parseInt(this.x.attr("attr").value()));
					}
					if(this.x.hasAttr("properties").value()) {
						this.context.data.set("properties", this.x.attr("properties").value());
					}
				}
			});
			
			var base = new Base({
				xml: x(xml).section("views view").single().destroy()
			});
			base.read();
			expect(base.context.data.get("attr1")).toEqual(1);
			expect(base.context.data.get("properties")).toEqual("blablabla");
			
		});
		
		it("ComplexTypeReader",function() {
			var xml = loader.read({
				source:"ui/layoutComplexTypeReader.xml"
			}).xml;
			
			var base = new reader.ComplexTypeReader({
				xml: x(xml).getAll("test").single().value()
			});
			
			base.read();
			
			var child = base.context.data.get("ChildrenItemReaders")[0];
			expect(child.context.data.get("nodeName")).toEqual("child");
			
			var innerChild = child.context.data.get("ChildrenItemReaders")[0];
			expect(innerChild.context.data.get("nodeName")).toEqual("child");
			
			base.build();
			
			expect(child._creationStage).toEqual(reader.ReaderBase.Stages);
			expect(innerChild._creationStage).toEqual(reader.ReaderBase.Stages);
			
			
		});
		
		it("Merger", function() {
			
			var data = new reader.ReaderData({
				raw: {
					id : "test",
					value : "test1",
					props : {
						value1:"value",
						value2:"value"
					}
				}
			});
			
			var base = new reader.Merger({
				xml: x(xml).getAll("view").get("#main").destroy(),
				data: data
			});
			
			var data2 = new reader.ReaderData({
				raw: {
					value:"test2",
					custom:"test4"
				}
			});
			
			base.merge(data2);
			
			expect(base.context.data.raw).toEqual({
				id : "test",
				value : "test1",
				props : {
					value1:"value",
					value2:"value"
				},
				custom:"test4"
			});
			
		});
		
		it("ReaderBase Data", function() {
			
			var data = new reader.ReaderData({
				raw: {
					id : "test",
					value : "test1",
					props : {
						value1:"value",
						value2:"value"
					}
				}
			});
			
			var base = new reader.ReaderBase({
				xml: x(xml).getAll("view").get("#main").destroy(),
				data: data
			});
			
			expect(base.context.data).toBe(data);
			
			base.destroy();
			
			data = {test:"test"};
			
			base = new reader.ReaderBase({
				xml: x(xml).getAll("view").get("#main").destroy(),
				data: data
			});
			
			expect(base.context.data instanceof reader.ReaderData).toBeTruthy();
			expect(base.context.data.get("test")).toEqual("test");
			
		});
		
		it("ReaderBase", function() {
			
			var base = new reader.ReaderBase({
				xml: x(xml).getAll("view").get("#main").destroy()
			});
			
			base.execute();
			
			expect(base._creationStage.length).toEqual(11);
			expect(base.xml).toBeDefined();
			expect(base.context).toBeDefined();
			expect(base.context.data.get("nodeName")).toEqual("view");
			expect(base.context.reader).toBe(base);
			
			expect(reader.Context.get(base.context.id)).toBeDefined(base.context);
			
			base.destroy();
			
			
			
		});
		
		it("ReaderData", function() {
			var data = new reader.ReaderData({
				raw: {
					id : "test",
					value : "test1",
					props : {
						value1:"value",
						value2:"value"
					}
				}
			});
			
			expect(data.get("id")).toEqual("test");
			data.set("id", "newtest");
			expect(data.get("id")).toEqual("newtest");
			
			data.set("props", {
				value2:"newValue",
				value3:"newValue"
			});
			expect(data.get("props")).toEqual({
				value1:"value",
				value2:"newValue",
				value3:"newValue"
			});
				
		});
				
	});

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
			expect(xBase).toBe(x(xBase).resolveSrc().single().destroy());			
		});
			
		it("Function: resolveRef", function() {
			var xBase = x(xml.documentElement).getAll("view").get("#main").destroy();
			expect(xBase).toBe(x(xBase).resolveRef().single().destroy());
			
			var xEl = x(xml.documentElement)
							.getAll("view")
							.filter(function(item) {
								return x.hasRef(item);
							});
			expect(xEl.value().length > 0).toBeTruthy();
							
			var resolved = xEl.resolveRef();
			
			expect(resolved.single().attr("id").value()).toEqual("justTesting");
			
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
