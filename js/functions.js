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

function graphviz(id, format, engine) {
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