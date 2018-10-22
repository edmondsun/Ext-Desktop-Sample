/**
 * Dynamically loading an external JavaScript or CSS file
 * source: http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
 */
/*
[Sample]
loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
loadjscssfile("javascript.php", "js") //dynamically load "javascript.php" as a JavaScript file
loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css file
 */
function loadjscssfile(filename, filetype) {
    // Preventing Cached AJAX Requests
    filename = appendTimestamp(filename);
    var fileref;
    if (filetype == "js") { //if filename is a external JavaScript file
        fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    } else if (filetype == "css") { //if filename is an external CSS file
        fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    /**
     * Load and execute javascript code SYNCHRONOUSLY
     * source: http://stackoverflow.com/questions/6074833/load-and-execute-javascript-code-synchronously
     */
    /* This attribute makes browser Firefox v40.0.3 loading slow on Mac OS X, so it will not be adopted. */
    // fileref.async = false;
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}
/**
 * How to include JSON data in javascript synchronously without parsing?
 * source: http://stackoverflow.com/questions/4116992/how-to-include-json-data-in-javascript-synchronously-without-parsing
 * NOTE: This code works in modern browsers only - IE8, FF, Chrome, Opera, Safari.
 */
// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
    // Preventing Cached AJAX Requests
    filePath = appendTimestamp(filePath);
    // Load json file;
    var json = loadTextFileAjaxSync(filePath, "application/json");
    // Parse json
    return JSON.parse(json);
}
// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    if (mimeType !== null) {
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType(mimeType);
        }
    }
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        return xmlhttp.responseText;
    } else {
        // TODO Throw exception
        return null;
    }
}
/**
 * AJAX Tips and Tricks
 * Preventing Cached AJAX Requests
 * source: http://www.informit.com/articles/article.aspx?p=669599
 */
function appendTimestamp(filename) {
    var timestamp = new Date().getTime();
    var uniqueURI = '';
    if (filename.length !== 0) {
        uniqueURI = filename + (filename.indexOf("?") > 0 ? "&" : "?");
    }
    uniqueURI += "_ts=" + timestamp;
    return uniqueURI;
}
/**
 * Load js, css by headSource.json
 */
function addHeadSouce(filename) {
    var headSourceObj = loadJSON(filename);
    for (var index in headSourceObj) {
        // console.log(index, headSourceObj, headSourceObj[index]);
        var filetype = index;
        switch (filetype) {
        case "css":
            for (var cssIndex in headSourceObj[filetype]) {
                loadjscssfile(headSourceObj[filetype][cssIndex], filetype);
            }
            break;
        case "js":
            var jsArr = [];
            for (var jsIndex in headSourceObj[filetype]) {
                jsArr.push(jsIndex);
            }
            requireQueue(jsArr, function () {});
            break;
        default:
            break;
        }
    }
}
/**
 * Load files in specific order with RequireJs
 * source: http://stackoverflow.com/questions/11581611/load-files-in-specific-order-with-requirejs
 */
/*
[Sample]
requireQueue([
    'app',
    'apps/home/initialize',
    'apps/entities/initialize',
    'apps/cti/initialize'
], function (App) {
    App.start();
});
 */
function requireQueue(modules, callback) {
    function load(queue, results) {
        if (queue.length) {
            require.config({
                urlArgs: appendTimestamp('')
            });
            require([queue.shift()], function (result) {
                results.push(result);
                load(queue, results);
            });
        } else {
            callback.apply(null, results);
        }
    }
    load(modules, []);
}
addHeadSouce("js/headSource.json");
