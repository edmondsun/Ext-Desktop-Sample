var DESKTOP_APP = loadJSON("app/base_app.json");
console.log('DESKTOP_APP: ', DESKTOP_APP);
console.log('DESKTOP_APP.SystemSetup: ', DESKTOP_APP.SystemSetup);

var APP_WINDOW = {};
APP_WINDOW.SYSTEM_SETUP = loadJSON(DESKTOP_APP.SystemSetup.appWindowJson);
console.log('APP_WINDOW.SYSTEM_SETUP: ', APP_WINDOW.SYSTEM_SETUP);

APP_WINDOW.STORAGE_MANAGEMENT = loadJSON(DESKTOP_APP.StorageManagement.appWindowJson);
console.log('APP_WINDOW.STORAGE_MANAGEMENT: ', APP_WINDOW.STORAGE_MANAGEMENT);

APP_WINDOW.FOLDER = loadJSON(DESKTOP_APP.Folder.appWindowJson);
console.log('APP_WINDOW.FOLDER: ', APP_WINDOW.FOLDER);

for (var appIndex in APP_WINDOW) {
    // console.log("APP_WINDOW index" , appIndex, APP_WINDOW[appIndex], APP_WINDOW[appIndex].tree)
    for (var treeIndex in APP_WINDOW[appIndex].tree) {
        APP_WINDOW[appIndex].tree[treeIndex].leaf = true;
        APP_WINDOW[appIndex].tree[treeIndex].text = APP_WINDOW[appIndex].tree[treeIndex].defaultName;
    }
}

console.log("APP_WINDOW", APP_WINDOW);

// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
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
