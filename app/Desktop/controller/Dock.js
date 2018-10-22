Ext.define('DESKTOP.Desktop.controller.Dock', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dock',
    resizeDockContainer: function () {
        var me = this,
            meView = me.getView(),
            dockToggleButton = Ext.getCmp('dockToggleButton');
        if (typeof dockToggleButton !== "undefined") {
            dockToggleButton.anchorTo('dockContainer', 't-t');
            me.resizeDockToolbar();
        }
    },
    resizeDockToolbar: function () {
        var me = this,
            meView = me.getView();
        var desktop = Ext.getCmp('desktop'),
            windowContainer = Ext.getCmp('windowContainer'),
            dockContainer = Ext.getCmp('dockContainer'),
            toolbarDock = Ext.getCmp('toolbarDock');
        if (typeof toolbarDock === "undefined") {
            return false;
        }
        var toolbarWidth,
            buttonWidth,
            toolbarMaxWidth = desktop.defaultConfig.dockButtonSize * Ext.getCmp('toolbarDock').items.items.length;
        var widthObj = {
            desktop: Ext.getCmp('desktop').getWidth(),
            dockContainer: Ext.getCmp('dockContainer').getWidth(),
            toolbarDock: Ext.getCmp('toolbarDock').getWidth()
        };
        toolbarWidth = widthObj.desktop - desktop.dockMargin * 2 - 2;
        buttonWidth = toolbarWidth / Ext.getCmp('toolbarDock').items.items.length;
        buttonWidth = parseInt(buttonWidth / desktop.dockButtonDivide, 10) * desktop.dockButtonDivide;
        buttonWidth = buttonWidth > desktop.defaultConfig.dockButtonSize ? desktop.defaultConfig.dockButtonSize : buttonWidth;
        if (buttonWidth < desktop.dockButtonMinSize) {
            desktop.dockButtonSize = buttonWidth = desktop.dockButtonMinSize;
        }
        Ext.getCmp('toolbarDock').setMaxWidth(toolbarWidth);
        Ext.Object.each(Ext.getCmp('toolbarDock').items.items, function (key, value) {
            // console.log(key, value);
            if (value.getWidth() == buttonWidth) {
                return true;
            }
            if (value.xtype == "button") {
                Ext.getCmp(value.id).setSize(buttonWidth, buttonWidth);
            } else {
                Ext.getCmp(value.id).setSize(Ext.getCmp(value.id).getSize()[0], buttonWidth);
            }
        });
        windowContainer.getController().toggleWindowContainer();
        me.toggleDockContainer();
    },
    toggleDockContainer: function (runAnimate) {
        var desktop = Ext.getCmp('desktop'),
            windowContainer = Ext.getCmp('windowContainer'),
            dockContainer = Ext.getCmp('dockContainer');
        var animate = {
            duration: 100
        };
        dockContainer.anchorTo(Ext.getCmp('desktop'), 'b-b', [0, dockContainer.getHeight() - windowContainer.margin$.bottom], animate);
    },
    /* add button of running window on dock. resize dock window after adding button */
    dockAddWindowButton: function (appWindow) {
        var me = this,
            meView = me.getView(),
            toolbarDock = Ext.getCmp('toolbarDock'),
            buttonId = "button-" + appWindow.id,
            text = Ext.String.format('<img src="{0}" class="dock-item-image" />', DESKTOP_APP[appWindow.appKey].icon) + '<div class="dock-dot dock-dot-running"></div>';
        itemSize = me.dockGetFirstItemSize();
        var item = {
            xtype: 'button',
            id: buttonId,
            cls: 'dock-item',
            text: text,
            draggable: false,
            height: itemSize.height,
            width: itemSize.width,
            tooltip: appWindow.qLanguage.title.str,
            appWindow: appWindow,
            handler: function () {
                appWindow.getController().toggleDisplay();
            },
            listeners: {
                afterrender: function (me) {
                    /* TODO: contextmenu */
                    // console.log("button el", me.getEl());
                    me.on("contextmenu", function (e) {
                        // console.log(e, el);
                    });
                    // console.log("button el", me);
                }
            }
        };
        toolbarDock.add(item);
    },
    dockRemoveItem: function (appWindow) {
        var me = this,
            desktop = Ext.getCmp('desktop'),
            toolbarDock = Ext.getCmp('toolbarDock');
        Ext.Object.each(toolbarDock.items.items, function (key, item) {
            if (item.id == "button-" + appWindow.id) {
                toolbarDock.remove(item);
            }
        });
        desktop.getController().updateWindowLastPosition();
    },
    makeDockWindowOnTop: function (dockContainer, monitorItems) {
        var me = this,
            meView = me.getView();
        if (monitorItems[0] !== "dockContainer") {
            Ext.WindowManager.bringToFront(dockContainer.id);
        }
        // me.toggleDockContainer(false);
    },
    dockGetFirstItemSize: function () {
        var toolbarDock = Ext.getCmp('toolbarDock');
        var itemSize = {};
        Ext.Object.each(toolbarDock.items.items, function (key, value) {
            if (typeof value.getSize() !== "undefined") {
                itemSize = value.getSize();
            }
        });
        return itemSize;
    }
});
