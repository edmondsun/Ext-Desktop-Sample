Ext.define('DESKTOP.AppWindow.AppWindow', {
    extend: 'DESKTOP.ux.qcustomize.window.MainWindow',
    alias: 'widget.appwindow',
    requires: [
        'DESKTOP.AppWindow.AppWindowController',
        'DESKTOP.AppWindow.AppWindowModel'
    ],
    controller: 'appwindow',
    viewModel: {
        type: 'appwindow'
    },
    config: {
        /**
         * historyTrack: false/true
         * true: skip tabchange for tabpanel
         */
        historyTrack: false,
        /**
         * history: []
         * navigation history: {'tree': itemId, 'tab': itemId}
         */
        history: [],
        /**
         * historyPosition: integer
         * history index: current history position
         */
        historyPosition: 0,
        /**
         * isMinimized: boolean
         */
        isMinimized: false
    },
    width: 1000,
    height: 550,
    resizable: false,
    layout: {
        type: 'border',
        padding: '0 0 0 0',
        border: 1
    },
    header: {
        titlePosition: 99,
        titleAlign: "center",
        style: 'padding-right:70px;'
    },
    itemId: 'appwindow',
    closable: false,
    maximizable: true,
    tools: [{
        type: 'close',
        handler: 'toolClose'
    }, {
        type: 'minimize',
        handler: 'toolMinimize'
    }],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        cls: 'app-win-tbar',
        items: [{
                xtype: 'button',
                itemId: 'historyPrev',
                buttonLocation: 'toolbar',
                iconCls: 'win-btn-prev',
                handler: 'historyPrev'
            }, {
                xtype: 'button',
                itemId: 'historyNext',
                buttonLocation: 'toolbar',
                iconCls: 'win-btn-next',
                handler: 'historyNext'
            },
            ' ', {
                xtype: 'button',
                itemId: 'navswitch',
                buttonLocation: 'toolbar',
                iconCls: 'win-btn-navswitch-collapse',
                handler: 'navswitch'
            },
            ' ', {
                itemId: 'toolbarGlobalButton',
                xtype: 'toolbar',
                cls: 'app-win-tbar-globalbutton',
                width: 300,
                layout: {
                    overflowHandler: 'menu'
                },
                padding: '0 0 0 0',
                style: 'background:transparent;border:0;'
            },
            '->', {
                xtype: 'button',
                buttonLocation: 'toolbar',
                iconCls: 'win-btn-help'
            }
        ],
        listeners: {
            afterrender: function (me, eOpts) {
                me.down('#historyPrev').setDisabled(true);
                me.down('#historyNext').setDisabled(true);
            }
        }
    }],
    items: [{
        xtype: 'treepanel',
        region: 'west',
        itemId: 'trees',
        cls: 'west-menu',
        width: 199,
        // height: 70,
        border: 1,
        lines: false,
        rootVisible: false,
        // bind: {
        // store: '{treeStore}'
        // },
        style: 'overflow:hidden;',
        listeners: {
            itemclick: 'menuClick'
        }
    }, {
        region: 'center',
        xtype: 'tabpanel',
        itemId: 'tabs',
        padding: 0,
        margin: 0,
        border: 1,
        tabBar: {
            layout: {
                pack: 'center'
            }
        },
        plain: true,
        cls: 'app-win-tabpanel',
        items: [{
            title: '_',
            html: '...'
        }],
        dockedItems: [{
            itemId: 'tabsouth',
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            hidden: true,
            items: ['->', {
                xtype: 'tbtext',
                text: ''
            }, {
                xtype: 'button',
                qLanguage: {
                    "text": {
                        "str": "Apply",
                        "key": "APPLY"
                    }
                },
                text: 'Apply',
                itemId: 'applyallbtn',
                cls: 'buttonApplyall',
                buttonType: 'primary',
                buttonLocation: 'common',
                listeners: [{
                    click: 'apply_all'
                }]
            }]
        }],
        listeners: {
            tabchange: 'onTabchange'
        }
    }],
    listeners: {
        afterlayout: {
            single: true,
            fn: function (me) {
                /* Select default item of treepanel at the first time of window layout. */
                var treeEl = me.down('#trees'),
                    treeElRootNodeObjs = treeEl.getRootNode().childNodes,
                    runSearch = typeof me.config.searchPosition != "undefined" ? me.config.searchPosition.runSearch : false,
                    selectId;
                if (runSearch === false) {
                    Ext.each(treeElRootNodeObjs, function (item, index, allItems) {
                        if (index === 0) {
                            selectId = treeEl.getStore().getNodeById(item.data.id);
                            treeEl.getSelectionModel().select(selectId);
                            me.getController().menuClick(treeEl.view, item);
                            return false;
                        }
                    });
                } else {
                    me.getController().searchPositionFn(me.config.searchPosition);
                }
            }
        },
        activate: function (me) {
            var desktop = Ext.getCmp('desktop'),
                monitorItems = [];
            if (me.isMasked() && me.qIsMasked) {
                desktop.qWinMgr.eachTopDown(function (cmp) {
                    if (cmp.monitorOnWinMgr) {
                        monitorItems.push(cmp.id);
                    }
                });
                /* If zindex of child window is higher than zindex of parent window, do nothing. */
                if (monitorItems.indexOf(me.childWindowId) < monitorItems.indexOf(me.id)) {
                    return false;
                }
                Ext.WindowManager.bringToFront(me.childWindowId);
            }
        }
    },
    qLanguageFn: function (language) {
        var me = this,
            lang = '';
        Ext.Object.each(me.qLanguage, function (key, value) {
            lang = DESKTOP.config.language[language][value.key] || value.str;
            switch (key) {
            case 'title':
                me.setTitle(lang);
                break;
            case '':
                break;
            default:
                break;
            }
        });
    }
});
