Ext.define('DESKTOP.Spotlight.SpotlightController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.spotlight',
    init: function () {},
    escapeRegExp: function (string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    },
    onSearchKeyup: function (self, e, eOpts) {
        // TODO: refactor item with tpl (icons)
        /* searchResArr is an Object Array for qLanguage
         * searchResArr is an Array for openWindow function
         */
        var searchResArr = [],
            searchResIDArr = [],
            checkDupArr = [];
        var appMenu = this.getView().down('#app_search_result');
        appMenu.removeAll();
        var searchText = this.escapeRegExp(self.getValue().trim());
        if (searchText !== "") {
            var searchTextRegX = null;
            var menu = null,
                tab = null;
            for (var app in Keyword) {
                if (Keyword[app].hasOwnProperty('name')) {
                    var appTags = Keyword[app].mixedTags;
                    var appKey = app;
                    Ext.each(appTags, function (obj, index, self) {
                        Ext.each(obj.tags, function (item, index) {
                            searchTextRegX = new RegExp("(" + "^" + searchText + ")", "gi");
                            var result = searchTextRegX.test(item);
                            if (result === true) {
                                if (typeof (obj.index) === 'undefined') { // Search App name
                                    if (checkDupArr.indexOf([appKey].join()) === -1) { // Duplicate checck
                                        checkDupArr.push([appKey]);
                                        searchResIDArr.push([appKey]);
                                        searchResArr.push([Keyword[appKey].qLanguage]);
                                    }
                                } else { // Search menu and tabs
                                    var indexingArr = obj.index;
                                    console.log(item, appKey, indexingArr);
                                    if (checkDupArr.indexOf([appKey].concat(indexingArr).join()) === -1) { // Duplicate checck
                                        checkDupArr.push([appKey].concat(indexingArr).join());
                                        searchResIDArr.push([appKey].concat(indexingArr));
                                        menu = indexingArr[0];
                                        if (indexingArr.length > 1) { // tab
                                            tab = indexingArr[1];
                                            searchResArr.push([Keyword[appKey].qLanguage, Keyword[appKey][menu].qLanguage, Keyword[appKey][menu][tab].qLanguage]);
                                        } else { // menu
                                            searchResArr.push([Keyword[appKey].qLanguage, Keyword[appKey][menu].qLanguage]);
                                        }
                                    }
                                }
                            }
                        });
                    });
                }
            }
        }
        checkDupArr = []; //
        // console.log(searchResArr);
        for (var i = 0; i < searchResIDArr.length; i++) {
            // Remove duplicate results if app has only one tab
            if ((searchResIDArr[i][1] === searchResIDArr[i][2]) && searchResIDArr[i].length > 1) {
                console.log("one tab");
                continue;
            }
            var treeId = (typeof (searchResIDArr[i][1]) === 'undefined') ? "" : "tree" + searchResIDArr[i][1];
            var tabId = (typeof (searchResIDArr[i][2]) === 'undefined') ? "" : "tab" + searchResIDArr[i][2];
            var mItem = {
                xtype: 'menuitem',
                app: searchResIDArr[i][0],
                tree: treeId,
                tab: tabId,
                qLanguage: {
                    pageText: searchResArr[i]
                },
                listeners: {
                    click: function () {
                        var me = this;
                        Ext.getCmp('desktop').getController().openWindow('', me.app, me.tree, me.tab, true);
                    }
                },
                convertLanguageString: function (currentLanguage) {
                    var me = this;
                    var lang = '';
                    Ext.Object.each(me.qLanguage, function (key, value) {
                        lang = DESKTOP.config.language[currentLanguage][value.key] || value.str;
                        switch (key) {
                        case 'pageText':
                            var textArr = getTextArr(me.qLanguage.pageText);
                            var formatString = getFormatString(me.qLanguage.pageText.length);
                            var textDisplay = Ext.String.qFormat(formatString, textArr);
                            me.setText(textDisplay);
                            break;
                        case '':
                            break;
                        default:
                            break;
                        }
                    });

                    function getTextArr(pageText) {
                        var textArr = [];
                        for (var i in pageText) {
                            textArr.push(qLanguageDisplay(pageText[i].key, pageText[i].str));
                        }
                        console.log(textArr);
                        return textArr;
                    }

                    function getFormatString(indexCount) {
                        var formatStringArr = [];
                        for (var i = 0; i < indexCount; i++) {
                            formatStringArr.push("{" + i + "}");
                        }
                        return formatStringArr.join(" > ");
                    }
                }
            };
            appMenu.add(mItem);
        }
    }
});
