
1. 	Use the following code on any appcelerator reference site, where the properties
	of UI elements are listed. Open console, paste this code in.
	Take the results and APPEND them to the "mapsource.txt".

2. 	Launch then AppceleratorLayoutPropertiesMapper.exe 
	this little console app will make a distinct array 
	and insert it into maptarget.txt

3.	Open now maptarget.txt and replace the contents of the
	map list in ../layoutPropertiesMap.js, but replace only the map, not the functions.

___________________________________________________________________________________

Note: the current collection is made of Label, View and Window.
___________________________________________________________________________________

Copy Paste Code and place into console...
___________________________________________________________________________________

$("tr:has(td.type)", $("#properties ~ table")).map(function() {
var retValue = "map[\"" + $(".name", this).text() + "\"] = ";
switch ($(".type", this).text()) {
   case "String" : retValue+="fnString;";break;
   case "Number or String" : retValue+="fnInt;";break;
   case "Font" : retValue+="fnFont;";break;
   case "Number":retValue+="fnInt;";break;
   case "Boolean":retValue+="fnBool;";break;
   case "Point":retValue+="fnPoint;";break;
   default: retValue+="fnString;";
}
return retValue;
}).get().join("\n")

____________________________________________________________________________________