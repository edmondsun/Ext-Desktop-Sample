Ext.define('DESKTOP.Desktop.view.Taskbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'DESKTOP.Desktop.model.Taskbar',
        'DESKTOP.Desktop.controller.Taskbar'
    ],
    xtype: 'app-taskbar',
    controller: 'taskbar',
    viewModel: {
        type: 'taskbar'
    },
    id: 'desktopTaskbar',
    cls: 'topTaskbar',
    autoShow: true,
    layout: 'hbox',
    height: 40,
    padding: '0 20 0 20',
    margin: 0,
    items: [{
            xtype: 'button',
            cls: "topBtn",
            text: 'About',
            scale: 'medium',
            iconCls: "tb-host-menu",
            menu: {
                xtype: 'menu',
                style: 'border-radius:7px;font-size: 13px;',
                plain: true,
                items: [{
                    text: 'System setup'
                }, {
                    text: 'System update'
                }, {
                    text: 'App Center'
                }]
            }
        }, {
            xtype: 'toolbar',
            id: 'toolbarDockFunction',
            style: 'border:2px #0f0 solid;',
            height: 40,
            padding: 0,
            width: 'auto',
            defaults: {
                padding: '4 0'
            },
            items: [{
                text: 'Add button',
                handler: 'dockAddButton'
            }, {
                text: 'Add text',
                handler: 'dockAddText'
            }, {
                text: 'Add separator',
                handler: 'dockAddSeparator'
            }, {
                text: 'Add spacer',
                handler: 'dockAddFill'
            }, {
                text: 'Remove last',
                handler: 'dockRemoveLastItem'
            }, {
                text: 'Remove all',
                handler: 'dockRemoveAllItem'
            }, {
                text: 'List all',
                handler: 'dockListAllItem'
            }, {
                text: 'Shortcut slide',
                handler: 'shortcutSlide'
            }],
            listeners: {
                afterrender: function (me) {
                    me.hide();
                }
            }
        },
        '->', {
            xtype: 'button',
            cls: "topBtn",
            text: '',
            scale: 'medium',
            iconCls: "tb-search",
            handler: function () {
                var desktop = Ext.getCmp('desktop');
                desktop.getController().openSpotlight();
            }
        },
        '-', {
            xtype: 'button',
            cls: "topBtn",
            itemId: 'buttonLanguage',
            scale: 'medium',
            width: 200,
            menu: {
                xtype: 'menu',
                style: 'border-radius:7px;font-size: 13px;',
                plain: true,
                listeners: {
                    click: function (menu, item, e, eOpts) {
                        var me = this,
                            desktopTaskbar = me.up('#desktopTaskbar');
                        desktopTaskbar.getController().languageClick(menu, item);
                    }
                }
            },
            listeners: {
                afterrender: function (me, eOpts) {
                    var desktopTaskbar = me.up('#desktopTaskbar');
                    desktopTaskbar.getController().addLanguageMenu();
                }
            }
        },
        '-', {
            xtype: 'button',
            cls: "topBtn",
            text: 'User name',
            scale: 'medium',
            iconCls: "tb-user-menu",
            menu: [{
                text: 'Preference'
            }, {
                text: 'Change password'
            }, {
                text: 'Logout'
            }]
        },
        '-', {
            xtype: 'button',
            cls: "topBtn",
            text: '',
            scale: 'medium',
            iconCls: "tb-help"
        }, {
            xtype: 'button',
            cls: "topBtn",
            scale: 'medium',
            iconCls: "tb-notification"
        }
    ]
});
/* TODO: add button of mission control */
// [{
// xtype: 'button',
// cls: "topBtn",
// iconCls: "tb-multitask",
// text: '',
// scale: 'medium',
// style: 'position:absolute; left:50%; top:0;margin-left:-30px;'
// }]
