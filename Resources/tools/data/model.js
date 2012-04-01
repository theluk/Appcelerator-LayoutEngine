/**
 * @author theluk
 */

(function() {
	
	Data.Model = Class.extend(Data.Events, {
		get json() {
			var obj = {}, name, names = (this._propertyNames || []).slice();
			Ti.API.info('MODEL Calling get json');
			for(var i=0;i<names.length;i++) {
				Ti.API.info('Has Names: ' + names[i]);
			}
			while((name = names.shift())) {
				obj[name] = this[name];
			}
			return obj;
		},
		set json(value) {}
	});
	
	Data.Model.createProperties = function(names) {
		var pNames = _.isArray(names) ? names : names.split(" "), name, obj = {};
		obj._propertyNames = pNames.slice();
		while((name = pNames.shift())) {
			obj.__defineGetter__(name, function() {
				return obj["_" + name];
			});
			obj.__defineSetter__(name, function(value) {
				var pName = "_" + name, oldValue;
				if (obj[pName] == value) return;
				oldValue = obj[pName];
				obj["_" + name] = value;
				this.trigger("change", {
					oldValue : oldValue,
					newValue : value
				});
				return value;
			});
		}
		return obj;
	}
	
})();
