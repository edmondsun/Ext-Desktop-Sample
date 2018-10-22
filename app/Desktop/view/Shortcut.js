Ext.define('DESKTOP.Desktop.view.Shortcut', {
    extend: 'Ext.container.Container',
    requires: [
        'DESKTOP.Desktop.model.Shortcut',
        'DESKTOP.Desktop.controller.Shortcut'
    ],
    xtype: 'app-shortcut',
    controller: 'shortcut',
    viewModel: {
        type: 'shortcut'
    },
    id: 'shortcutContainer',
    cls: 'shortcutContainer',
    floating: false,
    monitorOnWinMgr: true,
    autoShow: false,
    focusOnToFront: false,
    focusable: false,
    draggable: false,
    resizable: false,
    frame: false,
    height: 450,
    width: 950,
    // style: 'border:5px #ff0 solid;',
    style: 'border: none;',
    constrain: true,
    items: [{
        xtype: 'dataview',
        bind: {
            store: "{shortcut}"
        },
        tpl: [
            '<tpl for=".">',
            '<div class="shortcut-wrap">',
            '<div class="shortcut-img" id="{appKey}"><img src="{icon}" title="{name}"></div>',
            '<span class="shortcut-text">{name}</span>',
            '</div>',
            '</tpl>',
            '<div class="x-clear"></div>'
        ],
        itemSelector: 'div.shortcut-img',
        prepareData: function (data) {
            Ext.apply(data, {
                name: DESKTOP_APP[data.item[0]].qLanguage.str,
                icon: DESKTOP_APP[data.item[0]].icon,
                desc: DESKTOP_APP[data.item[0]].descriptionIndex,
                appKey: data.item[0]
            });
            return data;
        },
        listeners: {
            itemclick: function (view, record, item, index, e, eOpts) {
                // console.log("shortcut", view);
                var desktop = Ext.getCmp('desktop'),
                    windowContainer = Ext.getCmp('windowContainer'),
                    dockContainer = Ext.getCmp('dockContainer'),
                    buttonId,
                    appKey;
                buttonId = appKey = record.data.appKey;
                if (desktop.hideDock) {
                    desktop.hideDock = !desktop.hideDock;
                    windowContainer.getController().toggleWindowContainer();
                    dockContainer.getController().toggleDockContainer();
                }
                if (appKey == "FileManager") {
                    // Ext.getCmp('desktop').getController().openWindow2(buttonId, appKey);
                    Ext.getCmp('desktop').getController().openFileManager(buttonId, appKey);
                } else {
                    Ext.getCmp('desktop').getController().openWindow(buttonId, appKey);
                }
            },
            itemcontextmenu: function (me, record, item, index, e, eOpts) {
                e.stopEvent();
                console.log("right click", me, record, item);
                var shortcutContainer = Ext.getCmp('shortcutContainer');
                var menu = me.menu;
                if (!menu) {
                    menu = shortcutContainer.getController().shortcut("createMenu", me);
                }
                menu.showAt(e.getXY());
            }
        }
    }]
});
