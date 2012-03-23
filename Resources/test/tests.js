(function() {
	Ti.include('/test/lib/jasmine.js');
	Ti.include('/test/lib/jasmine-titanium.js');
	
	TiJasmineReporter = new jasmine.TitaniumReporter();
	
	// Include all the test files
	Ti.include('/test/tests_main.js');

	jasmine.getEnv().addReporter(TiJasmineReporter);
	jasmine.getEnv().execute();
})();
