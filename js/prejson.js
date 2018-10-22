var appPath = "app/";
var DESKTOP_APP = loadJSON(appPath + "base_app.json");
// console.log('DESKTOP_APP: ', DESKTOP_APP);
// console.log('DESKTOP_APP.SystemSetup: ', DESKTOP_APP.SystemSetup);
DESKTOP_APP.appPath = appPath;
var APP_WINDOW = {};
APP_WINDOW.SystemSetup = loadJSON(DESKTOP_APP.SystemSetup.appWindowJson);
// console.log('APP_WINDOW.SystemSetup: ', APP_WINDOW.SystemSetup);
APP_WINDOW.StorageManagement = loadJSON(DESKTOP_APP.StorageManagement.appWindowJson);
// console.log('APP_WINDOW.StorageManagement: ', APP_WINDOW.StorageManagement);
APP_WINDOW.Folder = loadJSON(DESKTOP_APP.Folder.appWindowJson);
// console.log('APP_WINDOW.Folder: ', APP_WINDOW.Folder);
APP_WINDOW.FileManager = loadJSON(DESKTOP_APP.FileManager.appWindowJson);
// console.log('APP_WINDOW.FileManager: ', APP_WINDOW.FileManager);
APP_WINDOW.Service = loadJSON(DESKTOP_APP.Service.appWindowJson);
// console.log('APP_WINDOW.Service: ', APP_WINDOW.Service);

for (var appIndex in APP_WINDOW) {
    // console.log("APP_WINDOW index" , appIndex, APP_WINDOW[appIndex], APP_WINDOW[appIndex].tree)
    for (var treeIndex in APP_WINDOW[appIndex].tree) {
        APP_WINDOW[appIndex].tree[treeIndex].leaf = true;
        APP_WINDOW[appIndex].tree[treeIndex].text = APP_WINDOW[appIndex].tree[treeIndex].qLanguage.str;
    }
}
console.log("APP_WINDOW", APP_WINDOW);
