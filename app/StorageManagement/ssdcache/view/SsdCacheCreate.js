Ext.define('DESKTOP.StorageManagement.ssdcache.view.SsdCacheCreate', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    closeAction: 'destroy',
    controller: 'ssdcachecreate',
    requires: [
        'DESKTOP.StorageManagement.ssdcache.model.SsdCacheCreateModel',
        'DESKTOP.StorageManagement.ssdcache.controller.SsdCacheCreateController'
    ],
    viewModel: {
        type: 'ssdcachecreate'
    },
    modal: true,
    width: 640,
    height: 400,
    listeners: {
        beforedestroy: function (me) {
            if (typeof (this.store) !== "undefined" && me.getViewModel().get('reload')) {
                var win = Ext.ComponentQuery.query('#' + this.caller)[0];
                win.getViewModel().getStore(this.store).reload();
            }
        },
        afterlayout: function (me) {
            var vm = me.getViewModel();
            var counts = vm.get('render_time');
            if (counts === 0) {
                var mask = new Ext.LoadMask({
                    msg: 'Loading',
                    target: me
                });
                vm.set('mask', mask);
                vm.set('render_time', counts + 1);
                mask.show();
            } else {
                var d_mask = me.getViewModel().get('mask');
                d_mask.destroy();
            }
        }
    },
    itemId: 'ssdcacheCreate',
    items: [{
        xtype: 'container',
        qDefault: true,
        customLayout: 'vlayout',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                text: 'Pool: '
            }, {
                xtype: 'combobox',
                qDefault: true,
                itemId: 'combo_pool',
                width: 100,
                bind: {
                    store: '{pool_info}'
                },
                displayField: 'pool_name',
                valueField: 'pool_name',
                editable: false,
                queryMode: 'local',
                emptyText: 'No pools'
            }, {
                xtype: 'displayfield',
                qDefault: true,
                itemId: 'display_pool',
                value: ''
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                text: 'Cache type: '
            }, {
                xtype: 'displayfield',
                qDefault: true,
                itemId: 'display_cacheType',
                value: '{this.view.op}'
            }, {
                xtype: 'combobox',
                qDefault: true,
                itemId: 'combo_cacheType',
                width: 100,
                value: 'Read',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['type', 'value'],
                    data: [{
                        'type': 'Read',
                        'value': 'Read'
                    }, {
                        'type': 'Write',
                        'value': 'Write'
                    }]
                }),
                queryMode: 'local',
                valueField: 'value',
                displayField: 'type',
                listeners: {
                    change: 'on_cacheType_change'
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'gridpanel',
                qDefault: true,
                itemId: 'grid_ssd',
                reference: 'grid_ssd',
                hidden: true,
                maxHeight: 200,
                forceFit: true,
                width: '100%',
                listeners: {
                    afterlayout: 'after_grid_layout'
                },
                bind: {
                    store: '{SSD_info}'
                },
                columns: [{
                    xtype: 'checkcolumn',
                    qDefault: true,
                    resizable: false,
                    dataIndex: 'selection',
                    menuDisabled: true,
                    sortable: false,
                    width: 40,
                    renderer: function (val, me, rec) {
                        return (new Ext.ux.CheckColumn()).renderer(val);
                    },
                    listeners: {
                        checkchange: 'on_ssdCheckChange'
                    }
                }, {
                    text: 'Status',
                    dataIndex: 'status',
                    resizable: false,
                    width: 80,
                    menuDisabled: true,
                    sortable: false,
                    renderer: function (value) {
                        var result = '';
                        switch (value) {
                        case "Good":
                            result = '<div><div style="margin:0px auto;width:10px;height:10px;background:url(app/SystemSetup/images/light_status.png) 0px -10px;"></div></div>';
                            break;
                        case "Reserved":
                            result = '<div><div style="margin:0px auto;width:10px;height:10px;background:url(app/SystemSetup/images/light_status.png) 0px -20px;"></div></div>';
                            break;
                        default:
                            result = '<div><div style="margin:0px auto;width:10px;height:10px;background:url(app/SystemSetup/images/light_status.png) 0px -40px;"></div></div>';
                            break;
                        }
                        return result;
                    }
                }, {
                    text: 'Slot No.',
                    dataIndex: 'slot',
                    width: 80,
                    resizable: false,
                    menuDisabled: true
                }, {
                    text: 'Drive',
                    dataIndex: 'size_gb',
                    renderer: function (val) {
                        return val + ' GB';
                    },
                    width: 80,
                    resizable: false,
                    menuDisabled: true
                }, {
                    text: 'Type',
                    dataIndex: 'type',
                    resizable: false,
                    width: 80,
                    menuDisabled: true
                }, {
                    text: 'Vender',
                    dataIndex: 'vendor',
                    resizable: false,
                    width: 80,
                    menuDisabled: true
                }, {
                    text: 'Rate',
                    dataIndex: 'rate',
                    resizable: false,
                    width: 120,
                    menuDisabled: true
                }]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            itemId: 'con_RaiType',
            hidden: true,
            items: [{
                xtype: 'label',
                text: 'RAID Type: '
            }, {
                xtype: 'combobox',
                qDefault: true,
                itemId: 'combo_raidType',
                store: Ext.create('Ext.data.Store', {
                    fields: ['raid_type', 'raid_level'],
                    data: [{
                        'raid_type': 'RAID 0',
                        'raid_level': '0'
                    }, {
                        'raid_type': 'RAID 1',
                        'raid_level': '1'
                    }]
                }),
                width: 150,
                // flex: 1,
                editable: false,
                queryMode: 'local',
                value: 0,
                // emptyText: "No disk selected",
                name: 'raid_level',
                valueField: 'raid_level',
                displayField: 'raid_type'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                hidden: true,
                text: 'No available disks have been found.',
                itemId: 'label_noAvail'
            }]
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        listeners: {
            click: function (me) {
                me.up('window').getViewModel().set('reload', false);
                me.up('window').destroy();
            }
        }
    }, {
        text: 'Confirm',
        buttonType: 'primary',
        itemId: 'btn_confirm'
    }]
});
