Ext.define('DESKTOP.Desktop.controller.Desktop', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.desktop',
    /* open the window by app's type */
    openWindow: function (buttonId, appKey, treeItemId, tabItemId, isSearch) {
        var me = this,
            meView = me.getView(),
            searchPosition = {
                app: appKey || '',
                tree: treeItemId || '',
                tab: tabItemId || '',
                runSearch: isSearch || false
            };
        var qsan_app_appkey_obj = DESKTOP_APP[appKey];
        if (qsan_app_appkey_obj.extId.length >= qsan_app_appkey_obj.maxWindowOpenNum) {
            // console.log("isMinimized", Ext.getCmp(qsan_app_appkey_obj.extId[0]).isMinimized);
            // console.log(qsan_app_appkey_obj.extId, Ext.getCmp(qsan_app_appkey_obj.extId[0]));
            var windowEl = Ext.getCmp(qsan_app_appkey_obj.extId[0]);
            if (windowEl.isMinimized) {
                windowEl.isMinimized = false;
                windowEl.show();
            } else {
                Ext.WindowManager.bringToFront(windowEl.id);
            }
            return false;
        }
        Ext.require('DESKTOP.AppWindow.AppWindow', function () {
            var appWindow = Ext.create('DESKTOP.AppWindow.AppWindow', {
                //title: DESKTOP.config.language[DESKTOP.config.language.current][qsan_app_appkey_obj.qLanguage.key] || qsan_app_appkey_obj.qLanguage.str,
                qLanguage: {
                    "title": qsan_app_appkey_obj.qLanguage
                },
                cls: APP_WINDOW[appKey].cls,
                appKey: appKey,
                searchPosition: searchPosition
            });
            /* load css */
            var cssPath = DESKTOP_APP.appPath + appKey + "/css/";
            for (var cssIndex in APP_WINDOW[appKey].css) {
                loadjscssfile(cssPath + APP_WINDOW[appKey].css[cssIndex], "css");
            }
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
            appWindow.down('#trees').addCls(APP_WINDOW[appKey].cls);
            /* tree has only one node */
            if (APP_WINDOW[appKey].tree.length == 1) {
                appWindow.down('#trees').hide();
                appWindow.down('#navswitch').setVisible(false);
            }
            Ext.getCmp('dockContainer').getController().dockAddWindowButton(appWindow);
            Ext.apply(appWindow, {
                animateTarget: "button-" + appWindow.id
            });
            qsan_app_appkey_obj.extId.push(appWindow.id);
            meView.windowOpened.push(appWindow.id);
            var container = Ext.getCmp('windowContainer'),
                position = [];
            if (meView.windowLastPosition.length === 0) {
                meView.windowLastPosition = [(container.getWidth() - appWindow.getWidth()) / 2, (container.getHeight() - appWindow.getHeight() - Ext.getCmp('dockContainer').getHeight()) / 2];
                Ext.apply(appWindow, {
                    x: meView.windowLastPosition[0],
                    y: meView.windowLastPosition[1]
                });
            } else {
                Ext.apply(appWindow, {
                    x: meView.windowLastPosition[0] + meView.windowOffset,
                    y: meView.windowLastPosition[1] + meView.windowOffset
                });
            }
            position = appWindow.getController().adjustPosition(container, appWindow, meView);
            Ext.apply(appWindow, {
                x: position[0],
                y: position[1]
            });
            meView.windowLastPosition = position;
            appWindow.show();
            Ext.WindowManager.bringToFront(appWindow.id);
            meView.hideDock = false;
        });
    },
    openSpotlight: function () {
        var $spl = Ext.ComponentQuery.query('#spotlight_modal')[0];
        if (typeof ($spl) !== 'undefined') {
            $spl.show();
        } else {
            Ext.require('DESKTOP.Spotlight.Spotlight', function () {
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
        var me = this,
            meView = me.getView();
        var qsan_app_appkey_obj = DESKTOP_APP[appKey];
        if (qsan_app_appkey_obj.extId.length >= qsan_app_appkey_obj.maxWindowOpenNum) {
            var windowEl = Ext.getCmp(qsan_app_appkey_obj.extId[0]);
            if (windowEl.isMinimized) {
                windowEl.isMinimized = false;
                windowEl.show();
            } else {
                Ext.WindowManager.bringToFront(windowEl.id);
            }
            return false;
        }
        Ext.require('DESKTOP.AppWindow2.AppWindow2', function () {
            var appWindow = Ext.create('DESKTOP.AppWindow2.AppWindow2', {
                title: DESKTOP.config.language[DESKTOP.config.language.current][qsan_app_appkey_obj.qLanguage.key] || qsan_app_appkey_obj.qLanguage.str,
                qLanguage: {
                    "title": qsan_app_appkey_obj.qLanguage
                },
                cls: APP_WINDOW[appKey].cls,
                appKey: appKey
            });
            /* load css */
            var cssPath = DESKTOP_APP.appPath + appKey + "/css/";
            for (var cssIndex in APP_WINDOW[appKey].css) {
                loadjscssfile(cssPath + APP_WINDOW[appKey].css[cssIndex], "css");
            }
            Ext.getCmp('dockContainer').getController().dockAddWindowButton(appWindow);
            Ext.apply(appWindow, {
                animateTarget: "button-" + appWindow.id
            });
            qsan_app_appkey_obj.extId.push(appWindow.id);
            meView.windowOpened.push(appWindow.id);
            var container = Ext.getCmp('windowContainer'),
                position = [];
            if (meView.windowLastPosition.length === 0) {
                meView.windowLastPosition = [(container.getWidth() - appWindow.getWidth()) / 2, (container.getHeight() - appWindow.getHeight() - Ext.getCmp('dockContainer').getHeight()) / 2];
                Ext.apply(appWindow, {
                    x: meView.windowLastPosition[0],
                    y: meView.windowLastPosition[1]
                });
            } else {
                Ext.apply(appWindow, {
                    x: meView.windowLastPosition[0] + meView.windowOffset,
                    y: meView.windowLastPosition[1] + meView.windowOffset
                });
            }
            position = appWindow.getController().adjustPosition(container, appWindow, meView);
            Ext.apply(appWindow, {
                x: position[0],
                y: position[1]
            });
            meView.windowLastPosition = position;
            appWindow.show();
            Ext.WindowManager.bringToFront(appWindow.id);
            meView.hideDock = false;
        });
    },
    openFileManager: function (appKey, buttonId) {
        var me = this,
            meView = me.getView();
        var qsan_app_appkey_obj = DESKTOP_APP[appKey];
        if (qsan_app_appkey_obj.extId.length >= qsan_app_appkey_obj.maxWindowOpenNum) {
            var windowEl = Ext.getCmp(qsan_app_appkey_obj.extId[0]);
            if (windowEl.isMinimized) {
                windowEl.isMinimized = false;
                windowEl.show();
            } else {
                Ext.WindowManager.bringToFront(windowEl.id);
            }
            return false;
        }
        Ext.require('DESKTOP.FileManager.FileManager', function () {
            var appWindow = Ext.create('DESKTOP.FileManager.FileManager', {
                title: DESKTOP.config.language[DESKTOP.config.language.current][qsan_app_appkey_obj.qLanguage.key] || qsan_app_appkey_obj.qLanguage.str,
                qLanguage: {
                    "title": qsan_app_appkey_obj.qLanguage
                },
                cls: APP_WINDOW[appKey].cls,
                appKey: appKey
            });
            /* load css */
            var cssPath = DESKTOP_APP.appPath + appKey + "/css/";
            for (var cssIndex in APP_WINDOW[appKey].css) {
                loadjscssfile(cssPath + APP_WINDOW[appKey].css[cssIndex], "css");
            }
            Ext.getCmp('dockContainer').getController().dockAddWindowButton(appWindow);
            Ext.apply(appWindow, {
                animateTarget: "button-" + appWindow.id
            });
            qsan_app_appkey_obj.extId.push(appWindow.id);
            meView.windowOpened.push(appWindow.id);
            var container = Ext.getCmp('windowContainer'),
                position = [];
            if (meView.windowLastPosition.length === 0) {
                meView.windowLastPosition = [(container.getWidth() - appWindow.getWidth()) / 2, (container.getHeight() - appWindow.getHeight() - Ext.getCmp('dockContainer').getHeight()) / 2];
                Ext.apply(appWindow, {
                    x: meView.windowLastPosition[0],
                    y: meView.windowLastPosition[1]
                });
            } else {
                Ext.apply(appWindow, {
                    x: meView.windowLastPosition[0] + meView.windowOffset,
                    y: meView.windowLastPosition[1] + meView.windowOffset
                });
            }
            position = appWindow.getController().adjustPosition(container, appWindow, meView);
            Ext.apply(appWindow, {
                x: position[0],
                y: position[1]
            });
            meView.windowLastPosition = position;
            appWindow.show();
            Ext.WindowManager.bringToFront(appWindow.id);
            meView.hideDock = false;
        });
    },
    updateWindowLastPosition: function () {
        var me = this,
            meView = me.getView();
        if (meView.windowOpened.length === 0) {
            meView.windowLastPosition = meView.defaultConfig.windowLastPosition;
        }
    },
    initQWinMgr: function () {
        var me = this,
            meView = me.getView();
        meView.qWinMgr = Ext.WindowManager;
        Ext.TaskManager.start({
            run: function () {
                var desktop = Ext.getCmp('desktop');
                dockContainer = Ext.getCmp('dockContainer');
                var monitorItems = [];
                meView.qWinMgr.eachTopDown(function (cmp) {
                    // console.log(cmp.id);
                    if (cmp.monitorOnWinMgr) {
                        monitorItems.push(cmp.id);
                    }
                });
                // console.log("monitorItems", monitorItems)
                dockContainer.getController().makeDockWindowOnTop(dockContainer, monitorItems);
            },
            interval: 100
        });
    },
    showLoadingMask: function () {
        var me = this,
            meView = me.getView();
        meView.mask("Loading", "loadingx");
    },
    hideLoadingMask: function () {
        var me = this,
            meView = me.getView();
        meView.unmask();
    }
});
