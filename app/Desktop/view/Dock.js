Ext.define('DESKTOP.Desktop.view.Dock', {
    extend: 'Ext.window.Window',
    requires: [
        'DESKTOP.Desktop.model.Dock',
        'DESKTOP.Desktop.controller.Dock'
    ],
    xtype: 'app-dock',
    controller: 'dock',
    viewModel: {
        type: 'dock'
    },
    id: 'dockContainer',
    cls: 'dockContainer',
    monitorOnWinMgr: true,
    autoShow: false,
    focusOnToFront: false,
    focusable: false,
    draggable: false,
    header: false,
    resizable: false,
    margin: 0,
    border: 0,
    // style: 'border: 1px #f0f solid !important;',
    listeners: {
        afterrender: function (me) {
            var desktop = Ext.getCmp('desktop');
            me.add({
                xtype: 'toolbar',
                id: 'toolbarDock',
                overflowHandler: 'scroller',
                padding: 0,
                margin: 0,
                minHeight: me.dockMinHeight,
                minWidth: me.toolbarDockSize,
                cls: 'toolbarDock',
                autoShow: true,
                defaults: {
                    padding: 0,
                    margin: 0
                },
                items: [{
                    xtype: 'button',
                    height: me.baseIconSize,
                    width: me.baseIconSize,
                    id: 'button-' + 'Apps',
                    cls: 'dock-item',
                    text: Ext.String.format('<img src="{0}" class="dock-item-image" />', 'img/app_all.png') + '<div class="dock-dot"></div>',
                    handler: function () {
                        /* TODO: create fn openAppsWindow() for apps */
                    }
                }],
                listeners: {
                    afterlayout: function (me) {
                        var dockContainer = Ext.getCmp('dockContainer');
                        Ext.getCmp('windowContainer').setMargin({
                            bottom: dockContainer.getHeight()
                        });
                        dockContainer.anchorTo(Ext.getCmp('desktop'), 'b-b');
                        var btn = Ext.create('Ext.Button', {
                            id: 'dockToggleButton',
                            cls: 'dock-toggle-button',
                            monitorOnWinMgr: false,
                            enableToggle: true,
                            renderTo: 'dockContainer',
                            width: 30,
                            height: 8,
                            padding: 0,
                            margin: 0,
                            autoShow: true,
                            floating: true,
                            toggleHandler: function (me, state) {
                                var desktop = Ext.getCmp('desktop'),
                                    windowContainer = Ext.getCmp('windowContainer'),
                                    dockContainer = Ext.getCmp('dockContainer');
                                desktop.hideDock = !desktop.hideDock;
                                windowContainer.getController().toggleWindowContainer();
                                dockContainer.getController().toggleDockContainer();
                            }
                        });
                        btn.anchorTo('dockContainer', 't-t');
                    },
                    single: true,
                    delay: 1
                }
            });
        },
        resize: {
            buffer: 100,
            fn: function (me) {
                me.getController().resizeDockContainer();
            }
        }
    }
});
