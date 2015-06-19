Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function makeJSTree(map) {
	var jstree=[];
	for (var problem in map) {
		var current={};
		jstree.push(current);
		current['text']=problem;
		var cfglist=[];
		current['children']=cfglist;
		for (var cfg in map[problem]) {
			var cfgchild={};
			cfglist.push(cfgchild);
			cfgchild['text']=cfg.replace(' ','');
			var userlist=[];
			cfgchild['children']=userlist;
			for (var user in map[problem][cfg]) {
				var userchild={};
				userlist.push(userchild);
				userchild['text']=user;
				var datalist=[];
				userchild['children']=datalist;
				for (var list in map[problem][cfg][user]) {
					var data={}
					datalist.push(data);
					data['text']=list[2];
					// [user,problem,timestamp,attempted,passed,code,cfg,graphviz]
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

		if (i>=100) {
			break;
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
		map[problem][cfg][user].push([user,problem,timestamp,attempted,passed,code,cfg,graphviz]);
	}


	var size = Object.size(map);
	console.log("length of map " + size);

	return map;
};
