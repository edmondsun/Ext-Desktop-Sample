Ext.define('DESKTOP.Main.MainController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'Ext.window.MessageBox'
    ],
    alias: 'controller.main',
    /* open the window by app's type */
    openWindow: function (buttonId, appKey, treeItemId, tabItemId, isSearch) {
        var searchPosition = {
            app: appKey || '',
            tree: treeItemId || '',
            tab: tabItemId || '',
            runSearch: isSearch || false
        };
        var qsan_app_appkey_obj = DESKTOP_APP[appKey];
        if (qsan_app_appkey_obj.extId.length >= qsan_app_appkey_obj.maxWindowOpenNum) {
            return false;
        }
        Ext.require('DESKTOP.AppWindow.AppWindow', function () {
            var appWindow = Ext.create('DESKTOP.AppWindow.AppWindow', {
                title: DESKTOP.config.language[DESKTOP.config.language.current][qsan_app_appkey_obj.qLanguage.key] || qsan_app_appkey_obj.qLanguage.str,
                qLanguage: {
                    "title": qsan_app_appkey_obj.qLanguage
                },
                animateTarget: buttonId,
                appKey: appKey,
                searchPosition: searchPosition
            });
            appWindow.down('#trees').setStore(Ext.create('Ext.data.TreeStore', {
                type: 'tree',
                root: {
                    text: "My Root",
                    expanded: true,
                    // fields: [{
                    // name: 'text',
                    // mapping: 'defaultName'
                    // mapping: 'iconCls'
                    // }],
                    children: APP_WINDOW[appKey].tree
                },
                listeners: {
                    load: function (store, operation, eOpts) {}
                }
            }));
            // console.log("appWindow.down('#trees')", appWindow.down('#trees'));
            appWindow.down('#trees').addCls(APP_WINDOW[appKey].cls);
            qsan_app_appkey_obj.extId.push(appWindow.id);
            // appWindow.down('#trees').setScrollable(false);
            if (APP_WINDOW[appKey].tree.length == 1) {
                appWindow.down('#trees').hide();
                appWindow.down('#navswitch').setVisible(false);
            }
            appWindow.show();
        });
    },
    openSpotlight: function() {
        var $spl = Ext.ComponentQuery.query('#spotlight_modal')[0];
        if (typeof($spl) !== 'undefined') {
            $spl.show();
        } else {
            Ext.require('DESKTOP.Spotlight.Spotlight', function() {
                // console.log("Create SPL");
                var spl = Ext.create('DESKTOP.Spotlight.Spotlight', {});
                spl.show();
                // console.log("Show SPL");
                // console.log(spl.getViewModel() );
                // console.log(spl.getController() );
            });
        }
    },
    openWindow2: function (appKey, buttonId) {
        Ext.require('DESKTOP.AppWindow2.AppWindow2', function () {
            var appWindow = Ext.create('DESKTOP.AppWindow2.AppWindow2', {
                title: appKey,
                qLanguage: {
                    "title": appKey
                },
                animateTarget: buttonId,
                appKey: appKey
            });
            // qsan_app_appkey_obj.extId.push(appWindow.id);
            appWindow.show();
        });
    }
});
