/**
 * keyword prototype for Spotlight App
 */

/* jslint browser: true */
/* global window */
function initLoadKeyWords() {
    "use strict";
    var appkeywordFiles = [],
        currentLang = DESKTOP.config.language.current,
        rootPath = "app/",
        pathToKeyWordBase = "/keyword",
        keyWordBaseFile = "/keyword_base.js",
        keyWordLangFile = "/keyword_" + currentLang + '.js';

    for (var app in APP_WINDOW) {
        Keyword.genNewAppKeyWord(app, APP_WINDOW[app]);
        appkeywordFiles.push(rootPath + app + pathToKeyWordBase + keyWordBaseFile, rootPath + app + pathToKeyWordBase + keyWordLangFile);
    }
    Keyword.loadKeywordFiles(appkeywordFiles);
}

(function(window, callback) {
    "use strict";
    window.Keyword = {
        genNewAppKeyWord: function(appKey, obj) {
            window.Keyword[appKey] = {
                name: appKey,
                qLanguage: obj.qLanguage
            };
            if (obj.tree === undefined) {
                return;
            }
            for (var i = 0; i < obj.tree.length; i++) {
                var treeObj = obj.tree[i];
                var treeId = treeObj.itemId.toString().replace("tree", "");
                window.Keyword[appKey][treeId] = {};
                window.Keyword[appKey][treeId].qLanguage = treeObj.qLanguage;
                for (var j = 0; j < treeObj.tabs.length; j++) {
                    var tabObj = treeObj.tabs[j];
                    var tabId = treeObj.tabs[j].itemId.toString().replace("tab", "");
                    window.Keyword[appKey][treeId][tabId] = {};
                    window.Keyword[appKey][treeId][tabId].qLanguage = tabObj.qLanguage;
                }
            };
        }
    };
    window.Keyword.loadKeywordFiles = function(queue) {
        require(queue, function(result) {
            for (var appKey in APP_WINDOW) {
                window.Keyword[appKey].mixedTags = window.Keyword[appKey].baseTags;
                for (var key in window.Keyword[appKey].baseTags) {
                    var index = parseInt(key),
                        base = window.Keyword[appKey].baseTags[key].tags,
                        lang = window.Keyword[appKey].langTags[key].tags;
                    window.Keyword[appKey].mixedTags[key].tags = base.concat(lang);
                }
            }
        });
    };
    window.Keyword.switchLang = function() {
        console.log("Switch Lang");
        var appkeywordFiles = [],
            currentLang = DESKTOP.config.language.current,
            rootPath = "app/",
            pathToKeyWordBase = "/keyword",
            keyWordLangFile = "/keyword_" + currentLang + '.js';
        for (var app in APP_WINDOW) {
            appkeywordFiles.push(rootPath + app + pathToKeyWordBase + keyWordLangFile);
        }
        Keyword.loadKeywordFiles(appkeywordFiles);
    };
    if (callback && typeof(callback) === "function") {
        callback();
    }
}(window, initLoadKeyWords));
