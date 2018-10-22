Ext.define('DESKTOP.Main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'DESKTOP.Main.MainController',
        'DESKTOP.Main.MainModel'
    ],
    xtype: 'app-main',
    id: 'main',
    controller: 'main',
    viewModel: {
        type: 'main'
    },
    layout: {
        type: 'border'
    },
    items: [{
        id: 'container_desktopTop',
        title: 'north',
        region: 'north',
        height: 40,
        xtype: 'container',
        items: [{
            xtype: 'toolbar',
            height: 40,
            padding: '0 0 0 0',
            margin: '0 0 0 0',
            style: 'background:#ccc;',
            items: [{
                xtype: 'label',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                text: 'DESKTOP 3.0'
            }, {
                xtype: 'button',
                text: 'DESKTOP 2.0',
                href: '/dashboard.php',
                hrefTarget: '_blank'
            }, {
                xtype: 'toolbar',
                width: 50,
                style: 'background: transparent;border:none;',
                overflowHandler: 'menu',
                items: [{
                    xtype: 'tbtext',
                    text: 'PageList',
                    style: 'font-weight: bold;',
                    padding: 0
                }],
                listeners: {
                    afterrender: function (me) {
                        var pageText = [],
                            pageVal = [];
                        Ext.Object.each(APP_WINDOW, function (index, item) {
                            // console.log("APP_WINDOW", index, item, item.qLanguage.str);
                            pageText[0] = item.qLanguage;
                            pageVal[0] = index;
                            pageText[1] = '';
                            pageVal[1] = '';
                            pageText[2] = '';
                            pageVal[2] = '';
                            me.addPageList(pageText, pageVal);
                            Ext.Object.each(item.tree, function (treeIndex, treeItem) {
                                // console.log("           - tree", treeIndex, treeItem, treeItem.qLanguage.str);
                                pageText[1] = treeItem.qLanguage;
                                pageVal[1] = treeItem.itemId;
                                pageText[2] = '';
                                pageVal[2] = '';
                                me.addPageList(pageText, pageVal);
                                Ext.Object.each(treeItem.tabs, function (tabIndex, tabItem) {
                                    // console.log("                      - tab", tabIndex, tabItem, tabItem.qLanguage.str);
                                    pageText[2] = tabItem.qLanguage;
                                    pageVal[2] = tabItem.itemId;
                                    me.addPageList(pageText, pageVal);
                                });
                            });
                        });
                        /* TODO: it will be removed/restored, for beta version only. */
                        me.hide();
                    }
                },
                addPageList: function (pageText, pageVal) {
                    // console.log("pageText", Ext.String.qFormat("{0} > {1} > {2}", pageText));
                    // console.log("pageVal", Ext.String.qFormat("{0} > {1} > {2}", pageVal));
                    var me = this,
                        tmp_pageText = [pageText[0], pageText[1], pageText[2]],
                        tmp_pageVal = [pageVal[0], pageVal[1], pageVal[2]],
                        emptyCount = 0,
                        textArr = [],
                        formatString = "",
                        textDisplay = "";
                    for (var i in pageText) {
                        if (pageText[i].length === 0) {
                            emptyCount++;
                        }
                    }
                    if (emptyCount == 2) {
                        me.add({
                            xtype: 'tbseparator'
                        });
                    }
                    textArr = getTextArr(tmp_pageText);
                    formatString = getFormatString(emptyCount);
                    textDisplay = Ext.String.qFormat(formatString, textArr);
                    me.add({
                        xtype: 'button',
                        // text: textDisplay,
                        qLanguage: {
                            pageText: tmp_pageText
                        },
                        handler: function () {
                            var me = this;
                            var appKey = tmp_pageVal[0],
                                treeItemId = tmp_pageVal[1],
                                tabItemId = tmp_pageVal[2];
                            Ext.getCmp('main').getController().openWindow('', appKey, treeItemId, tabItemId, true);
                        },
                        convertLanguageString: function (currentLanguage) {
                            var me = this;
                            var lang = '';
                            Ext.Object.each(me.qLanguage, function (key, value) {
                                lang = DESKTOP.config.language[currentLanguage][value.key] || value.str;
                                switch (key) {
                                case 'pageText':
                                    var textArr = getTextArr(tmp_pageText);
                                    var formatString = getFormatString(emptyCount);
                                    var textDisplay = Ext.String.qFormat(formatString, textArr);
                                    me.setText(textDisplay);
                                    break;
                                case '':
                                    break;
                                default:
                                    break;
                                }
                            });
                        }
                    });

                    function getTextArr(pageText) {
                        var textArr = [];
                        for (var i in pageText) {
                            textArr.push(qLanguageDisplay(pageText[i].key, pageText[i].str));
                        }
                        return textArr;
                    }

                    function getFormatString(emptyCount) {
                        var formatStringArr = [];
                        for (var i = 2, len = emptyCount; i >= emptyCount; i--) {
                            formatStringArr.push("{" + formatStringArr.length + "}");
                        }
                        return formatStringArr.join(" > ");
                    }
                }
            }, '->', {
                xtype: 'button',
                text: 'Spotlight',
                handler: 'openSpotlight',
                listeners: {
                    afterrender: function (me) {
                        /* TODO: it will be removed/restored, for beta version only. */
                        me.hide();
                    }
                }
            }, '->', {
                xtype: 'button',
                itemId: 'buttonLanguage',
                width: 200,
                menu: {
                    xtype: 'menu',
                    plain: true,
                    style: 'background:#fff;padding:10px;border-radius:7px',
                    listeners: {
                        click: function (menu, item, e, eOpts) {
                            var me = this;
                            var language = item.language;
                            if (item.language == "AUTO") {
                                docCookies.removeItem("client_language");
                                language = DESKTOP.config.language.detect;
                            } else {
                                docCookies.setItem("client_language", language, Infinity);
                            }
                            me.up('#buttonLanguage').setText(item.text);
                            me.changeLanguage(language);
                        }
                    },
                    addMenu: function () {
                        var me = this;
                        me.add({
                            checked: false,
                            group: 'language',
                            text: 'Auto detect',
                            qLanguage: {
                                "text": {
                                    "str": "Auto detect",
                                    "key": "AUTO_DETECT"
                                }
                            },
                            tooltip: 'Auto detect',
                            language: 'AUTO'
                        }, '-');
                        Ext.Object.each(DESKTOP.config.language.support, function (supportKey, supportValue) {
                            me.add({
                                checked: false,
                                group: 'language',
                                text: supportValue.nativeName,
                                tooltip: supportValue.language + ' ' + supportValue.browserLanguage,
                                language: supportKey
                            });
                        });
                        Ext.Object.each(me.items.items, function (key, value) {
                            if ((DESKTOP.config.language.autoDetect === true && value.language == "AUTO") ||
                                (DESKTOP.config.language.autoDetect === false && value.language == DESKTOP.config.language.current)) {
                                me.items.items[key].checked = true;
                                me.up('#buttonLanguage').setText(value.text);
                            }
                        });
                    },
                    changeLanguage: function (language) {
                        // console.log("changeLanguage", language);
                        DESKTOP.config.language.loadFile(language);
                        // console.log("changeLanguage", DESKTOP.config.language);
                        Ext.ComponentManager.each(function (key, value) {
                            if (typeof value.qLanguage !== "undefined") {
                                // console.log(value.qLanguage, key, value);
                                if (typeof value.qLanguageFn === "function") {
                                    try {
                                        value.qLanguageFn(language);
                                    } catch (err) {
                                        // console.log("value.xtype", value.xtype)
                                        // console.error("err", err);
                                    }
                                } else {
                                    // console.warn(value.qLanguage, " no qLanguageFn");
                                }
                            } else {
                                // if (typeof value.items != "undefined") {
                                // console.warn(value.id, " ", value.items.items, " no qLanguage");
                                // }
                            }
                        });
                        window.Keyword.switchLang();
                    }
                },
                listeners: {
                    afterrender: function (me, eOpts) {
                        me.down().addMenu();
                        /* TODO: it will be removed/restored, for beta version only. */
                        me.hide();
                    }
                }
            }]
        }]
    }, {
        id: 'container_desktopMiddle',
        xtype: 'panel',
        region: 'center',
        width: 100,
        split: true,
        dockedItems: [{
            itemId: 'topToolbar',
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                text: 'System Setup',
                qLanguage: {
                    "text": {
                        "str": 'System Setup',
                        "key": 'SYSTEM_SETUP'
                    }
                },
                appKey: 'SystemSetup',
                listeners: {
                    click: function (me, e, eOpts) {
                        var appKey = me.appKey;
                        var buttonId = me.id;
                        Ext.getCmp('main').getController().openWindow(buttonId, appKey);
                    }
                }
            }, {
                xtype: 'button',
                text: 'Storage Management',
                qLanguage: {
                    "text": {
                        "str": 'Storage Management',
                        "key": 'STORAGE_MANAGEMENT'
                    }
                },
                appKey: 'StorageManagement',
                listeners: {
                    click: function (me, e, eOpts) {
                        var appKey = me.appKey;
                        var buttonId = me.id;
                        Ext.getCmp('main').getController().openWindow(buttonId, appKey);
                    }
                }
            }, {
                xtype: 'button',
                text: 'Folder',
                qLanguage: {
                    "text": {
                        "str": 'Folder',
                        "key": 'FOLDER'
                    }
                },
                appKey: 'Folder',
                listeners: {
                    click: function (me, e, eOpts) {
                        var appKey = me.appKey;
                        var buttonId = me.id;
                        Ext.getCmp('main').getController().openWindow(buttonId, appKey);
                    }
                }
            }, {
                xtype: 'button',
                text: 'Service',
                qLanguage: {
                    "text": {
                        "str": 'Service',
                        "key": 'SERVICE'
                    }
                },
                appKey: 'Service',
                listeners: {
                    click: function (me, e, eOpts) {
                        var appKey = me.appKey;
                        var buttonId = me.id;
                        Ext.getCmp('main').getController().openWindow(buttonId, appKey);
                    }
                }
            }, {
                xtype: 'button',
                text: 'File manager',
                qLanguage: {
                    "text": {
                        "str": 'File manager',
                        "key": 'FILE_MANAGER'
                    }
                },
                appKey: 'FileManager',
                listeners: {
                    click: function (me, e, eOpts) {
                        var appKey = me.appKey;
                        var buttonId = me.id;
                        Ext.getCmp('main').getController().openWindow2(appKey, buttonId);
                    }
                }
            }]
        }]
    }]
});
