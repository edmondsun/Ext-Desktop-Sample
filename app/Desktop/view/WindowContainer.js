Ext.define('DESKTOP.Desktop.view.WindowContainer', {
    extend: 'Ext.container.Container',
    requires: [
        'DESKTOP.Desktop.model.WindowContainer',
        'DESKTOP.Desktop.controller.WindowContainer'
    ],
    xtype: 'app-windowcontainer',
    controller: 'windowcontainer',
    viewModel: {
        type: 'windowcontainer'
    },
    id: 'windowContainer',
    // style: 'background:transparent;border:5px #0f0 solid;',
    autoShow: true,
    layout: {
        type: 'fit'
    },
    listeners: {
        resize: function (me) {
            var shortcutContainer = Ext.getCmp('shortcutContainer'),
                dockContainer = Ext.getCmp('dockContainer');
            if (typeof shortcutContainer !== "undefined") {
                shortcutContainer.getController().adjustPosition();
                dockContainer.getController().toggleDockContainer();
                dockContainer.getController().resizeDockToolbar();
            }
        },
        buffer: 100
    }
});
