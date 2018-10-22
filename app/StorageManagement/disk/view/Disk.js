Ext.define('DESKTOP.StorageManagement.disk.view.Disk', {
    extend: 'Ext.form.Panel',
    alias: 'widget.disk',
    requires: [
        'DESKTOP.StorageManagement.disk.controller.DiskController',
        'DESKTOP.StorageManagement.disk.model.DiskModel'
    ],
    controller: 'disk',
    viewModel: {
        type: 'disk'
    },
    itemId: 'Disk',
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    listeners: {
        beforedestroy: function () {
            var pdStore = Ext.data.StoreManager.lookup('pdStore');
            var encInfostore = Ext.data.StoreManager.lookup('encInfo');
            clearInterval(pdStore.enc_status);
            clearInterval(encInfostore.enc_status);
        },
        afterrender: 'afterview'
    },
    items: [{
        xtype: 'container',
        width: 900,
        layout: 'hbox',
        items: [{
            xtype: 'container',
            itemId: 'images',
            width: 500,
            height: 190,
            layout: 'hbox',
            items: [{
                xtype: 'button',
                // qDefault: true,
                itemId: 'btnLeft',
                layout: 'absolute',
                buttonLocation: 'customize',
                width: 20,
                height: 70,
                listeners: {
                    click: 'on_leftBtn_click'
                }
            }, {
                xtype: 'container',
                style: {
                    marginLeft: '10px',
                    marginRight: '10px'
                },
                layout: 'absolute',
                itemId: 'drawing',
                width: 350,
                height: 200,
                border: true,
                items: [{
                    xtype: 'image',
                    width: 350,
                    src: 'app/StorageManagement/images/rack_24bay.png'
                }]
            }, {
                xtype: 'button',
                // qDefault: true,
                layout: 'absolute',
                buttonLocation: 'customize',
                width: 20,
                height: 70,
                itemId: 'btnRight',
                listeners: {
                    click: 'on_rightBtn_click'
                }
            }]
        }, {
            xtype: 'container',
            width: 400,
            items: [{
                xtype: 'label',
                qDefault: true,
                itemId: 'noItems',
                text: 'No available items.',
                hidden: true
            }, {
                xtype: 'container',
                itemId: 'displayField',
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    labelFontWeight: 'bold',
                    bind: {
                        value: '{pdStore2display.selection.connect_stat}'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Slot No:',
                    labelFontWeight: 'bold',
                    itemId: 'dSlot',
                    bind: {
                        value: '{pdStore2display.selection.slot}'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Drive model:',
                    labelFontWeight: 'bold',
                    bind: {
                        value: '{pdStore2display.selection.vendor} {pdStore2display.selection.serial} ( {pdStore2display.selection.rate} )'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Capacity:',
                    labelFontWeight: 'bold',
                    bind: {
                        value: '{pdStore2display.selection.size_gb} GB'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Temperature:',
                    labelFontWeight: 'bold',
                    bind: {
                        value: '{pdStore2display.selection.smart_arr.Temperature.value} ℃'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'HDD I/O Status:',
                    labelFontWeight: 'bold',
                    bind: {
                        value: '{pdStore2display.selection.health}'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Test time:',
                    labelFontWeight: 'bold',
                    bind: {
                        value: '{pdStore2display.selection.smartctl_arr.start_time}'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Test result:',
                    labelFontWeight: 'bold',
                    bind: {
                        value: '{pdStore2display.selection.smartctl_arr.status}'
                    }
                }]
            }]
        }]
    }, {
        xtype: 'gridpanel',
        qDefault: true,
        width: 900,
        bind: {
            store: '{pdStore}'
        },
        forceFit: true,
        itemId: 'info',
        maxHeight: 280,
        listeners: {
            select: 'on_grid_select'
        },
        reference: 'pdStore2display',
        columns: [{
            text: 'Status',
            dataIndex: 'connect_stat',
            width: 70,
            renderer: function (value) {
                var result = '';
                switch (value) {
                case "Online":
                    result = '<div><div style="margin:0px auto;width:10px;height:10px;background:url(app/SystemSetup/images/light_status.png) 0px -10px;"></div></div>';
                    break;
                case "Abnormal":
                    result = '<div><div style="margin:0px auto;width:10px;height:10px;background:url(app/SystemSetup/images/light_status.png) 0px -20px;"></div></div>';
                    break;
                case "Error":
                    result = '<div><div style="margin:0px auto;width:10px;height:10px;background:url(app/SystemSetup/images/light_status.png) 0px -30px;"></div></div>';
                    break;
                default:
                    result = '<div><div style="margin:0px auto;width:10px;height:10px;background:url(app/SystemSetup/images/light_status.png) 0px -40px;"></div></div>';
                    break;
                }
                return result;
            },
            menuDisabled: true,
            resizable: false,
            sortable: false
        }, {
            text: 'Slot NO.',
            dataIndex: 'slot',
            menuDisabled: true,
            resizable: false,
            sortable: false,
            width: 80
        }, {
            text: 'Type',
            dataIndex: 'type',
            menuDisabled: true,
            resizable: false,
            sortable: false,
            width: 60
        }, {
            text: 'Capacity',
            dataIndex: 'size_gb',
            menuDisabled: true,
            resizable: false,
            sortable: false,
            width: 100,
            renderer: function (val) {
                return val + " GB";
            }
        }, {
            text: 'Usage',
            dataIndex: 'usage',
            menuDisabled: true,
            resizable: false,
            sortable: false,
            width: 100
        }, {
            text: 'Vender',
            dataIndex: 'vendor',
            menuDisabled: true,
            resizable: false,
            sortable: false,
            width: 100
        }, {
            text: 'Serial no.',
            dataIndex: 'serial',
            menuDisabled: true,
            resizable: false,
            sortable: false,
            width: 120
        }, {
            text: 'Rate',
            dataIndex: 'rate',
            menuDisabled: true,
            resizable: false,
            sortable: false,
            width: 130
        }, {
            text: 'Write Cache',
            dataIndex: 'write_cache',
            resizable: false,
            menuDisabled: true,
            sortable: false,
            width: 120
        }],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'label',
                text: 'Show Drive for:'
            }, {
                xtype: 'combobox',
                qDefault: true,
                width: 100,
                bind: {
                    store: '{encInfo}'
                },
                queryMode: 'local',
                itemId: 'com_enc',
                // lastQuery:'',
                valueField: 'enc_id',
                displayField: 'enc_name',
                autoLoadOnValue: true,
                editable: false,
                listeners: {
                    select: 'onComboselect'
                }
            }, '->', {
                xtype: 'button',
                qDefault: true,
                text: 'Global spare',
                itemId: 'btnGlobal',
                disabled: true,
                handler: 'on_global_spare'
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'btnTest',
                text: 'Test',
                disabled: true,
                handler: 'on_test'
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'btnFreedisk',
                text: 'Set free disk',
                disabled: true,
                handler: 'on_set_freedisk'
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'btnReplace',
                text: 'Replace disk',
                disabled: true,
                handler: 'on_replace_disk'
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'btnTurnon',
                text: 'Turn on drive LED',
                disabled: true,
                handler: 'on_turnon_led'
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'btnTurnoff',
                text: 'Turn off drive LED',
                hidden: true,
                handler: 'on_turnoff_led'
            }]
        }]
    }]
});
