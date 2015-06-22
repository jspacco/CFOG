Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function makeJSTree(map) {
	// (???) may need to use hasOwnProperty() with for-in loops in JS
	// http://stackoverflow.com/questions/684672/loop-through-javascript-object

	var jstree=[];
	for (var problem in map) {
		var current={};
		jstree.push(current);
		current['text']='PROB: '+problem;
		var cfglist=[];
		current['children']=cfglist;
		for (var cfg in map[problem]) {
			var cfgchild={};
			cfglist.push(cfgchild);
			//cfgchild['text']='CFOG: '+cfg.replace(' ','')+ ' GRAPHVIZ: '+gvizmap[cfg];
			cfgchild['text']='CFOG: '+cfg.replace(' ','');
			var userlist=[];
			cfgchild['children']=userlist;
			for (var user in map[problem][cfg]) {
				var userchild={};
				userlist.push(userchild);
				userchild['text']='USER: '+user;
				var datalist=[];
				userchild['children']=datalist;

				tmp = map[problem][cfg][user];
				for (var i=0; i<tmp.length; i++) {
					var list=tmp[i];
					user=list[0];
					problem=list[1];
					timestamp=list[2];
					attempted=list[3];
					passed=list[4];
					code=list[5];
					cfg=list[6];
					graphviz=list[7].replace(/\\n/g, '\n');
					cfgchild['data']=[graphviz];
					var data={}
					data['text']='TIME: '+timestamp;
					datalist.push(data);
					data['data']=[code.replace(/\\n/g, '\n'), graphviz, passed, attempted];
				}
			}
		}
	}
	return jstree;
}




function readSubs(text) {
	var map={};
	var lines=text.split("\n");
	for (var i=0; i<lines.length; i++) {
		var line=lines[i];
		if (line.length==0) {
			continue;
		}

		if (i>=100) {
			//break;
		}

		//console.log(line);
		tokens=line.split("\t");
		user=tokens[0];
		problem=tokens[1];
		timestamp=tokens[2];
		attempted=tokens[3];
		passed=tokens[4];
		code=tokens[5];
		cfg=tokens[6];
		graphviz=tokens[7];

		if (!(problem in map)) {
			map[problem] = {};
		}
		if (!(cfg in map[problem])) {
			map[problem][cfg] = {};
		}
		if (!(user in map[problem][cfg])) {
			map[problem][cfg][user] = []
		}
		lst=[user,problem,timestamp,attempted,passed,code,cfg,graphviz];
		map[problem][cfg][user].push(lst);
	}


	//var size = Object.size(map);
	//console.log("length of map " + size);
	//return {"map" : map, "gvizmap" : gvizmap};
	return map;
};

if (typeof module!='undefined') {
    // module!=undefined is our proxy for running in node.js
    // rather than in the browser
    module.exports.readSubs=readSubs;
    module.exports.makeJSTree=makeJSTree;
}
