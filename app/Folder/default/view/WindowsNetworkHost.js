Ext.define('DESKTOP.Folder.default.view.WindowsNetworkHost', {
    extend: 'Ext.form.Panel',
    alias: 'widget.folderwindowsnetworkhost',
    requires: [
        'DESKTOP.Folder.default.model.WindowsNetworkHostModel',
        'DESKTOP.Folder.default.controller.WindowsNetworkHostController',
        'DESKTOP.Folder.default.view.WindowsNetworkHostSetting',
        'DESKTOP.Folder.default.view.Folderlist'
    ],
    controller: 'folderwindowsnetworkhost',
    viewModel: {
        type: 'folderwindowsnetworkhost'
    },
    itemId: 'WindowsNetworkHost',
    layout: {
        type: 'border'
    },
    height: 400,
    width: 'auto',
    frame: true,
    collapsible: true,
    autoScroll: false,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    listeners: {
        afterrender: function (me, eOpts) {
            me.getEl().setStyle({
                padding: '0px'
            });
        },
        resize: function (me, width, height, oldWidth, oldHeight, eOpts) {
            var tabContainer = me.up("appwindow").down("#tabs");
            var tabBar_height = tabContainer.getTabBar().getHeight();
            var tabSouth_height = tabContainer.down("#tabsouth").getHeight();
            var new_height = tabContainer.getHeight() - tabBar_height - tabSouth_height;
            var north_height = me.down("#item_north").getHeight();
            var new_grid_height = new_height - north_height - me.down("#center_item").getHeight();
            me.setHeight(new_height);
            me.down("#grid_host").setHeight(new_grid_height - 14);
        }
    },
    items: [{
        region: 'west',
        itemId: 'folderListObj',
        width: 200,
        cls: 'west-menu'
    }, {
        region: 'center',
        flex: 1,
        xtype: 'panel',
        layout: 'border',
        items: [{
            region: 'north',
            height: 120,
            xtype: 'panel',
            itemId: 'item_north',
            bodyPadding: 7,
            layout: {
                type: 'vbox'
            },
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                padding: '0 0 7 0',
                fieldLabel: 'Folder name',
                bind: {
                    value: '{folder_name}'
                },
                labelFontColor: 'title',
                labelFontWeight: 'bold'
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox'
                    // align: 'middle'
                },
                items: [{
                    xtype: 'panel',
                    // flex: 1,
                    width: 110,
                    height: 130,
                    itemId: 'item_polar',
                    items: [{
                        xtype: 'polar',
                        height: 90,
                        width: 90,
                        colors: ['#058be7', '#32c1c7', '#f1f1f1'],
                        border: false,
                        bind: {
                            store: '{pie}'
                        },
                        series: {
                            type: 'pie',
                            showInLegend: true,
                            tooltip: {
                                trackMouse: true,
                                renderer: function (record, data) {
                                    this.setHtml(record.get('name') + ':' + record.get('size') + 'GB');
                                }
                            },
                            subStyle: {
                                strokeStyle: ['#058be7', '#32c1c7', '#f1f1f1'],
                                lineWidth: [0, 0, 0]
                            },
                            xField: 'size'
                        }
                    }]
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'left',
                        pack: 'center'
                    },
                    items: [{
                        xtype: 'container',
                        layout: 'hbox',
                        items: [{
                            xtype: 'panel',
                            width: 200,
                            // flex: 2,
                            layout: {
                                type: 'vbox'
                            },
                            defaults: {
                                labelWidth: 100
                            },
                            items: [{
                                xtype: 'displayfield',
                                qDefault: true,
                                fieldLabel: 'Folder Size',
                                bind: {
                                    value: '{total_size} GB'
                                }
                            }, {
                                xtype: 'container',
                                layout: 'hbox',
                                items: [{
                                    xtype: 'label',
                                    html: '<div class="legendColorBox used"></div>'
                                }, {
                                    xtype: 'displayfield',
                                    qDefault: true,
                                    labelWidth: 82,
                                    fieldLabel: 'Used',
                                    bind: {
                                        value: '{used} GB'
                                    }
                                }]
                            }, {
                                xtype: 'container',
                                layout: 'hbox',
                                items: [{
                                    xtype: 'label',
                                    html: '<div class="legendColorBox snapshot"></div>'
                                }, {
                                    xtype: 'displayfield',
                                    qDefault: true,
                                    labelWidth: 82,
                                    fieldLabel: 'Snapshot',
                                    bind: {
                                        value: '{snapshot_size} GB'
                                    }
                                }]
                            }, {
                                xtype: 'container',
                                layout: 'hbox',
                                items: [{
                                    xtype: 'label',
                                    html: '<div class="legendColorBox free"></div>'
                                }, {
                                    xtype: 'displayfield',
                                    qDefault: true,
                                    labelWidth: 82,
                                    fieldLabel: 'Free',
                                    bind: {
                                        value: '{free} GB'
                                    }
                                }]
                            }]
                        }, {
                            xtype: 'panel',
                            layout: 'vbox',
                            width: 200,
                            items: [{
                                xtype: 'displayfield',
                                qDefault: true,
                                fieldLabel: 'Volume',
                                bind: {
                                    value: '{volume}'
                                }
                            }, {
                                xtype: 'displayfield',
                                qDefault: true,
                                fieldLabel: 'Pool',
                                bind: {
                                    value: '{pool}'
                                }
                            }, {
                                xtype: 'displayfield',
                                qDefault: true,
                                fieldLabel: 'Folders',
                                bind: {
                                    value: '{folders_num}'
                                }
                            }, {
                                xtype: 'displayfield',
                                qDefault: true,
                                fieldLabel: 'Files',
                                bind: {
                                    value: '{files_num}'
                                }
                            }]
                        }]
                    }]
                }]
            }]
        }, {
            region: 'center',
            xtype: 'panel',
            bodyPadding: 7,
            layout: 'vbox',
            items: [{
                xtype: 'container',
                itemId: 'center_item',
                width: '100%',
                layout: 'vbox',
                items: [
                    // {
                    //     xtype: 'displayfield',
                    //     qDefault: true,
                    //     fieldLabel: 'Network share name',
                    //     bind: {
                    //         value: '{folder_name}'
                    //     }
                    // },
                    {
                        xtype: 'toolbar',
                        qDefault: true,
                        width: '100%',
                        items: [{
                                xtype: 'label',
                                qDefault: true,
                                // text: 'Windows network host access right</br>Specify the computers which can access the shared folders via Microsoft networking.',
                                html: '<div style=""><b>Windows network host access right</b></br>Specify the computers which can access the shared folders via Microsoft networking.</div>'
                                // labelFontWeight: 'bold'
                            },
                            // {
                            //     xtype: 'label',
                            //     qDefault: true,
                            //     text: 'Specify the computers which can access the shared folders via Microsoft networking.'
                            // },
                            '->', {
                                xtype: 'button',
                                qDefault: true,
                                itemId: 'btn_add',
                                text: 'Add',
                                disabled: true,
                                // bind: {
                                //     disabled: '{!folderGrid.selection}'
                                // },
                                focusable: false, // avoid button being focused after pressed
                                listeners: {
                                    click: 'onAdd'
                                }
                            }, {
                                xtype: 'button',
                                qDefault: true,
                                text: 'Delete',
                                disabled: true,
                                bind: {
                                    disabled: '{!grid_host.selection}'
                                },
                                focusable: false, // avoid button being focused after pressed
                                listeners: {
                                    click: 'onDelete'
                                }
                            }
                        ]
                    }
                ]
            }, {
                xtype: 'gridpanel',
                qDefault: true,
                width: '100%',
                height: 200,
                reference: 'grid_host',
                itemId: 'grid_host',
                viewConfig: {
                    loadMask: false,
                    emptyText: 'No record'
                },
                bind: {
                    store: '{hostIP}'
                },
                listeners: {
                    itemdblclick: 'onDelete',
                    select: 'onHostSelect'
                },
                columns: [{
                    dataIndex: 'host',
                    sortable: false,
                    menuDisabled: true,
                    width: '100%',
                    resizable: false,
                    text: 'Allow IP address or domain'
                }]
            }]
        }]
    }]
});
