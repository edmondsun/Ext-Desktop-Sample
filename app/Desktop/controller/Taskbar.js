Ext.define('DESKTOP.Desktop.controller.Taskbar', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.taskbar',
    dockAddButton: function () {
        var me = this,
            meView = me.getView(),
            desktop = Ext.getCmp('desktop'),
            dockContainer = Ext.getCmp('dockContainer'),
            toolbarDock = Ext.getCmp('toolbarDock'),
            text = Ext.String.format('<img src="{0}" class="dock-item-image" />', 'img/app_replace.png') + '<div class="dock-dot dock-dot-running"></div>',
            itemSize = dockContainer.getController().dockGetFirstItemSize();
        var item = {
            xtype: 'button',
            height: itemSize.height,
            width: itemSize.width,
            cls: 'dock-item',
            text: text,
            draggable: false
        };
        toolbarDock.add(item);
    },
    dockAddText: function () {
        var toolbarDock = Ext.getCmp('toolbarDock'),
            text = Ext.getCmp('toolbarDock').items.length;
        toolbarDock.add(text.toString());
    },
    dockAddSeparator: function () {
        var toolbarDock = Ext.getCmp('toolbarDock');
        toolbarDock.add('-');
    },
    dockAddFill: function () {
        var toolbarDock = Ext.getCmp('toolbarDock');
        toolbarDock.add('->');
    },
    dockRemoveLastItem: function () {
        var toolbarDock = Ext.getCmp('toolbarDock');
        toolbarDock.remove(toolbarDock.items.last());
    },
    dockRemoveAllItem: function () {
        var toolbarDock = Ext.getCmp('toolbarDock');
        toolbarDock.removeAll();
    },
    dockListAllItem: function () {
        var toolbarDock = Ext.getCmp('toolbarDock');
        // console.log("toolbarDock", toolbarDock.items.items)
        Ext.Object.each(toolbarDock.items.items, function (key, item) {
            // console.log(key, item);
        });
    },
    shortcutSlide: function () {
        var shortcutContainer = Ext.getCmp('shortcutContainer');
        var duration = 1000;
        shortcutContainer.getEl().slideOut('l', {
            easing: 'easeOut',
            duration: duration,
            remove: false,
            useDisplay: false,
            callback: function () {
                shortcutContainer.setVisible(false);
                shortcutContainer.doLayout();
                runSlideIn();
            }
        });

        function runSlideIn() {
            shortcutContainer.setVisible(true);
            shortcutContainer.getEl().slideIn('r', {
                easing: 'easeOut',
                duration: duration,
                callback: function () {
                    shortcutContainer.doLayout();
                }
            });
        }
    },
    languageClick: function (menu, item) {
        var me = this,
            meView = me.getView(),
            language = item.language;
        // console.log(menu, item);
        if (item.language == "AUTO") {
            docCookies.removeItem("client_language");
            language = DESKTOP.config.language.detect;
        } else {
            docCookies.setItem("client_language", language, Infinity);
        }
        meView.down('#buttonLanguage').setText(item.text);
        me.changeLanguage(language);
    },
    addLanguageMenu: function () {
        var me = this;
        meView = me.getView(),
            languageMenu = meView.down('#buttonLanguage').menu;
        languageMenu.add({
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
            languageMenu.add({
                checked: false,
                group: 'language',
                text: supportValue.nativeName,
                tooltip: supportValue.language + ' ' + supportValue.browserLanguage,
                language: supportKey
            });
        });
        Ext.Object.each(languageMenu.items.items, function (key, value) {
            if ((DESKTOP.config.language.autoDetect === true && value.language == "AUTO") ||
                (DESKTOP.config.language.autoDetect === false && value.language == DESKTOP.config.language.current)) {
                languageMenu.items.items[key].checked = true;
                languageMenu.up('#buttonLanguage').setText(value.text);
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
});
