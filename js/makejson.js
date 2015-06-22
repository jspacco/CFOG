// Simple node.js driver to put the JS data into
// the 
require('./functions.js');
var makemap=require('./makemap.js');
var fs=require('fs');

fs.readFile('../data/esubs.tsv', 'utf8', function (err,text) {
	if (err) {
		return console.log(err);
	}
	var map=makemap.makeJSTree(makemap.readSubs(text));
	fs.writeFile('../data/esubs.json', JSON.stringify(map), function (err) {
		if (err) throw err;
		console.log('Saved to file!');
	});
});