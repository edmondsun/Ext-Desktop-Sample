Ext.define('DESKTOP.Desktop.view.Desktop', {
    extend: 'Ext.container.Viewport',
    requires: [
        'DESKTOP.Desktop.model.Desktop',
        'DESKTOP.Desktop.controller.Desktop',
        'DESKTOP.AppWindow.AppWindow'
    ],
    xtype: 'app-desktop',
    controller: 'desktop',
    viewModel: {
        type: 'desktop'
    },
    id: 'desktop',
    layout: {
        type: 'border'
    },
    config: {
        windowOpened: [],
        windowLastPosition: [],
        windowOffset: 35,
        dockButtonSize: 80,
        dockButtonMinSize: 40,
        dockButtonDivide: 5,
        dockMargin: 40,
        hideDock: false,
        hideDockOffset: 16,
        qWinMgr: {}
    },
    items: [{
        xtype: 'container',
        id: 'desktopNorth',
        region: 'north',
        height: 40,
        padding: 0,
        margin: 0
    }, {
        xtype: 'container',
        id: 'desktopCenter',
        region: 'center',
        padding: 0,
        margin: 0,
        // style: 'background:transparent;border:5px #f00 solid;',
        layout: {
            type: 'fit'
        }
    }],
    listeners: {
        afterlayout: {
            single: true,
            fn: function (me) {
                var desktop = me,
                    desktopNorth = Ext.getCmp('desktopNorth'),
                    desktopCenter = Ext.getCmp('desktopCenter');
                desktop.getController().showLoadingMask();
                var requireClass = [
                    'DESKTOP.Desktop.view.Taskbar',
                    'DESKTOP.Desktop.view.WindowContainer',
                    'DESKTOP.Desktop.view.Shortcut',
                    'DESKTOP.Desktop.view.Dock'
                ];
                Ext.require(requireClass, function () {
                    /* ADD Taskbar */
                    desktopNorth.add(Ext.create('DESKTOP.Desktop.view.Taskbar'));
                    /* ADD WindowContainer */
                    desktopCenter.add(Ext.create('DESKTOP.Desktop.view.WindowContainer'));
                    var windowContainer = Ext.getCmp('windowContainer');
                    /* ADD Shortcut */
                    var shortcut = Ext.create('DESKTOP.Desktop.view.Shortcut', {
                        renderTo: 'windowContainer'
                    });
                    shortcut.setPosition((windowContainer.getWidth() - shortcut.getWidth()) / 2, (windowContainer.getHeight() - shortcut.getHeight()) / 2 - desktopNorth.getHeight());
                    shortcut.show();
                    /* ADD Dock */
                    var dockContainerSize = desktop.defaultConfig.dockButtonMinSize + 2,
                        toolbarDockSize = desktop.defaultConfig.dockButtonMinSize,
                        dockMinHeight = desktop.dockButtonMinSize,
                        baseIconSize = desktop.defaultConfig.dockButtonSize;
                    Ext.create('DESKTOP.Desktop.view.Dock', {
                        dockContainerSize: dockContainerSize,
                        toolbarDockSize: toolbarDockSize,
                        dockMinHeight: dockMinHeight,
                        baseIconSize: baseIconSize,
                        minHeight: dockMinHeight,
                        minWidth: dockContainerSize
                    }).show();
                    /* INIT window manager */
                    desktop.getController().initQWinMgr();
                    Ext.defer(function () {
                        desktop.getController().hideLoadingMask();
                    }, 0);
                });
            }
        }
    }
});
