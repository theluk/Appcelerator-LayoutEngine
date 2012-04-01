(function() {

	// To learn how to write Jasmine tests, please read Jasmine documentation:
	// https://github.com/pivotal/jasmine/wiki

	Ti.include("../tools/layoutPropertiesMap.js");
		
	var _ = require("lib/underscore");
	var Class = require("lib/base");
	
	describe("Array Extension", function() {
		
		it("should work", function() {
			Array.extend = Class.extend;
			var Data = require("tools/layout").data;
			
			var MyArray = Array.extend(Data.Events, {
				init: function() {
					this.splice.apply(this, [0, this.length].concat(_.toArray(arguments)));
				},
				add : function() {
					this.push.apply(this, arguments);
				},
				toString : function() {
					return this.join(",");
				},
				toArray : function() {
					return this.slice();
				},
				push : function() {
					var newLength = this._super();
					this.trigger("length", {length:newLength});
				}
			});
			
			var myArray = new MyArray("test1", "test2");
			
			myArray.add("test3");
			var newLength = 0;
			myArray.on("length", function(data) {
				newLength = data.length;
			})
			
			expect(myArray.toArray()).toEqual(new Array("test1", "test2", "test3"));
			
			myArray.add("test4");
			expect(newLength).toEqual(4);
			
			
		});
		
	});
	
	describe("Data Model", function() {
		
		var data = require("tools/layout").data;
		
		it("should work", function() {
			
			var Item = data.Model.extend(data.Model.createProperties("test value"));
			var item = new Item();
			expect(item._propertyNames).toEqual(["test", "value"]);
			
			var called = false;
			var fnChange = function(data) {
				called = data;
			};
			item.on("change", fnChange);
		
			expect(called).toBeFalsy();
			
			item.test = "depp";
			
			expect(called).toEqual({
				source: item,
				eventName: "change",
				oldValue : undefined,
				newValue : "depp"
			});
			Ti.API.info('BEFORE CALLING item.json');
			expect(item.json).toEqual({
				test : "depp",
				value : undefined
			});
			
			
			called = false;
			item.off("change", fnChange);
			item.test = "depp2";
			
			expect(called).toBeFalsy();
			
			item.on("change", fnChange);
			item.test="depp";
			expect(called).toEqual({
				source: item,
				eventName: "change",
				oldValue : "depp2",
				newValue : "depp"
			});
			called = false;
			item.off("all");
			item.test="depp43";
			expect(called).toBeFalsy();
			
			
		});
		
	});
	
	describe("Javaascript Getters and Setters", function() {
		
		it("should work", function() {
			
			var Person = Class.extend({
			    init: function(options) {
			        this.firstName = options.firstName;
			        this.lastName = options.lastName;
			    },
			    get fullname() {
			        return this.firstName + " " + this.lastName;
			    },
			    get message() {
			        return "Person: " + this.fullname;
			    }
			});
			
			var Employee = Person.extend({
			    init: function(options) {
			        this._super();
			        this.department = options.department;
			    },
			    get message() {
			        return this._super() + " Department: " + this.department;
			    }
			});
			
			var person = new Person({
			    firstName : "Mike",
			    lastName : "Miller"
			});
			
			expect(person.message).toEqual("Person: Mike Miller");
			
			var employee = new Employee({
			    firstName : "Mike",
			    lastName: "Miller",
			    department: "Sales"
			});
			
			expect(employee.message).toEqual("Person: Mike Miller Department: Sales");
			expect(employee["message"]).toEqual("Person: Mike Miller Department: Sales");
			
			
		});
		
		it("Should extend properly", function() {
			
			var O = Class.extend({
				init: function() {
					Ti.API.info('TEST: O calling init');
					this.value = "hallo";
				},
				get value() {
					return this._value + "!";
				},
				set value(val) {
					this._value = val;
				}
			});
			
			var o = new O;
			expect(o.value).toEqual("hallo!");
			
			var O2 = O.extend({
				get value() {
					return this._super() + " 2";
				}
			});
			
			var o2 = new O2;
			expect(o2.value).toEqual("hallo! 2");
			
			O2.override("value", {get: function() {return this._super() + "!!!"}});
			
			o2 = new O2;
			expect(o2.value).toEqual("hallo! 2!!!");
			
			
		})
		
		it("Should work", function() {
			
			var O = function() {
				this._value = "hallo";
				this.value2 = "null";
			};
			
			O.prototype = {
				get value() {
					return this._value;
				},
				set value(val) {
					this._value = val + " via setter...";
				}
			};
			
			var o = new O;
			expect(o.value).toEqual("hallo");
			o.value = "Hi"
			expect(o.value).toEqual("Hi via setter...");
			
			var O2 = function() {}
			var g = O.prototype.__lookupGetter__("value"), s = O.prototype.__lookupSetter__("value");
			var g2 = O.prototype.__lookupGetter__("value2"), s2 = O.prototype.__lookupSetter__("value2");
			
			expect(g).toBeDefined();
			expect(s).toBeDefined();
			
			expect(g2).toBeUndefined();
			expect(s2).toBeUndefined();
			
		});
		
	});
		
	describe("Reader", function() {
		var reader = require("tools/layout").reader;
		var x = require("tools/functions").xml;
		var loader = require("tools/loader");
		var xml = loader.read().xml;
		
		it("Event Binding 1", function() {
			
			var xml = loader.read({
				source: "ui/layoutViewReader.xml"
			}).xml;
			
			var base = new reader.ViewReader({
				xml : x(xml).getAll("view").get("#win").value()
			});
			
			base.read();
			
			var events = base.context.data.get("eventSettings");
			expect(events).toEqual({
				"click" : {
					"open" : "#main" 
				},
				"change" : {	
					"set" : "null"
				} 
			});
			
		});
		
		it("Build Chain", function() {
			
			var xml = loader.read({
				source: "ui/layoutViewReader.xml"
			}).xml;
			
			var base = new reader.ViewReader({
				xml : x(xml).getAll("view").get("#test").value()
			});
			
			var iId = base.context.createInstance();
			var instance = base.context.getInstance(iId).view;
			
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
				top:"10",
				bottom:"20"
			});
			
			base = new reader.ViewReader({
				xml: x(xml).getAll("view").get("#test2").value()
			});
			base.read();
			
			expect(base.context.data.get("properties")).toEqual({
				backgroundColor:"red",
				top:"10",
				bottom:"20"
			});
			
			base = new reader.ViewReader({
				xml: x(xml).getAll("view").get("#test3").value()
			});
			base.read();
			expect(base.context.data.get("properties")).toEqual({
				backgroundColor:"white",
				top:"1"
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
			
			expect(base._creationStage.length).toEqual(12);
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
				top:"34 px"
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
