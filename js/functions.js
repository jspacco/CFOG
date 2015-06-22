function getFileFromServer(url, doneCallback) {
	// TODO: put into a separate set of utility functions
    var xhr;

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handleStateChange;
    xhr.open("GET", url, true);
    xhr.send();

    function handleStateChange() {
        if (xhr.readyState === 4) {
            doneCallback(xhr.status == 200 ? xhr.responseText : null);
        }
    }
}

function mygraphviz(text) {
    text=text.replace('\\n', '\n');
    var svg=Viz(text, "svg", "dot");
    var container = document.getElementById('graphviz');
    container.innerHTML=svg;
}

function graphviz2(id, format, engine) {
    var result;
    try {
        result = Viz(src(id), format, engine);
        if (format === "svg") {
            return result;
        } else {
            return inspect(result);
        }
    } catch(e) {
      return inspect(e.toString());
    }
}

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}