Ext.define('DESKTOP.Desktop.controller.WindowContainer', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.windowcontainer',
    toggleWindowContainer: function () {
        var me = this,
            meView = me.getView(),
            desktop = Ext.getCmp('desktop'),
            windowContainer = Ext.getCmp('windowContainer'),
            dockContainer = Ext.getCmp('dockContainer'),
            dockContainerSize = dockContainer.getHeight();
        windowContainer.setMargin({
            bottom: desktop.hideDock ? desktop.hideDockOffset : dockContainerSize
        });
        me.handleResize();
    },
    handleResize: function () {
        var me = this,
            meView = me.getView(),
            desktop = Ext.getCmp('desktop');
        if (typeof desktop.qWinMgr.id == "undefined") {
            return false;
        }
        desktop.qWinMgr.eachTopDown(function (cmp) {
            if (cmp.id == "dockContainer" ||
                cmp.id == "shortcutContainer" ||
                cmp.id == "dockToggleButton" ||
                strncmp(cmp.id, "appwindow", 9) === 0 && cmp.id.indexOf("-ghost") !== -1) {
                return true;
            }
            me.dockPatch("winToolMax", cmp);
            me.dockPatch("winPosition", cmp);
        });
    },
    dockPatch: function (type, window) {
        var win = Ext.getCmp(window.id);
        var me = this,
            meView = me.getView(),
            desktop = Ext.getCmp('desktop');
        container = Ext.getCmp('dockContainer'),
            containerSize = container.getSize(),
            containerPosition = container.getPosition(),
            windowContainer = Ext.getCmp('windowContainer'),
            dock = Ext.getCmp('dockContainer');
        switch (type) {
        case "winToolMax":
            if (win.maximized) {
                Ext.apply(win, {
                    animateTarget: ""
                });
                win.toggleMaximize();
                win.toggleMaximize();
                Ext.apply(win, {
                    animateTarget: "button-" + win.id
                });
            }
            break;
        case "winToolMin":
            break;
        case "winPosition":
            var index = 0;
            var position = window.getController().adjustPosition(windowContainer, window, desktop, false);
            window.setPosition(position);
            desktop.windowLastPosition = position;
            break;
        default:
            break;
        }
    }
});
