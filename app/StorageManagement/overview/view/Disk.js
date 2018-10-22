Ext.define('DESKTOP.StorageManagement.overview.view.Disk', {
    extend: 'Ext.form.Panel',
    alias: 'widget.overviewdisk',
    requires: [
        'DESKTOP.StorageManagement.overview.controller.DiskController',
        'DESKTOP.StorageManagement.overview.model.DiskModel'
    ],
    controller: 'overviewdisk',
    viewModel: {
        type: 'overviewdisk'
    },
    itemId: 'Disk',
    width: 'auto',
    height: 480,
    waitMsgTarget: true,
    layout: {
        type: 'border'
    },
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
        region: 'south',
        xtype: 'panel',
        // scrollable: true,
        // split: true, // enable resizing
        border: 1,
        margin: '0 0 0 0',
        height: 170,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'panel',
            width: 200,
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Information'
            }]
        }, {
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            width: 400,
            items: [{
                xtype: 'panel',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    itemId: 'dStatus',
                    value: '',
                    flex: 1
                }, {
                    xtype: 'panel',
                    qDefault: true,
                    flex: 1,
                    items: [{
                        xtype: 'button',
                        qDefault: true,
                        itemId: 'btnTest',
                        style: 'float: right;',
                        text: 'Test',
                        listeners: {
                            click: 'on_test'
                        }
                    }]
                }]
            }, {
                xtype: 'panel',
                qDefault: true,
                itemId: 'displayField',
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Slot No:',
                    itemId: 'dSlot',
                    value: ''
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Drive model:',
                    itemId: 'dDrive',
                    value: ''
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Capacity:',
                    itemId: 'dCapc',
                    value: ''
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Temperature:',
                    itemId: 'dTemp',
                    value: ''
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'HDD I/O Status:',
                    itemId: 'dHdd',
                    value: ''
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Test time:',
                    itemId: 'dTestTime',
                    value: ''
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Test result:',
                    itemId: 'dTResult',
                    value: ''
                }]
            }]
        }]
    }, {
        region: 'west',
        xtype: 'panel',
        border: 1,
        width: 250,
        layout: {
            type: 'vbox'
        },
        defaults: { // defaults are applied to items, not the container
            width: 250
            // scrollable:true
        },
        items: [{
            xtype: 'label',
            qDefault: true,
            text: 'Device'
        }, {
            xtype: 'combobox',
            qDefault: true,
            itemId: 'com_enc',
            width: 130,
            bind: {
                store: '{encInfo}'
            },
            queryMode: 'local',
            valueField: 'enc_id',
            displayField: 'enc_name',
            autoLoadOnValue: true,
            editable: false,
            listeners: {
                select: 'onComboselect'
            }
        }, {
            xtype: 'treepanel',
            qDefault: true,
            // width: 300,
            itemId: 'tree',
            height: 180,
            layout: {
                type: 'fit'
            },
            rootVisible: true,
            // bind: {
            //     store: '{disk_composition}'
            // },
            listeners: {
                itemclick: function (treepanel, record, item, index, e, eOpts) {
                    var slot = "#" + 'disk_bay' + (record.data.slot - 1);
                    treepanel.up('form').down(slot).el.fireEvent('click');
                }
            }
        }]
    }, {
        region: 'center', // center region is required, no width/height specified
        xtype: 'panel',
        border: 1,
        margin: '0 0 0 0',
        items: [{
            xtype: 'container',
            itemId: 'images',
            style: {
                marginTop: '50px'
            },
            width: 500,
            height: 300,
            layout: 'hbox',
            // layout: 'absolute',
            items: [{
                xtype: 'button',
                itemId: 'btnLeft',
                layout: 'absolute',
                buttonLocation: 'customize',
                width: 30,
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
                buttonLocation: 'customize',
                width: 30,
                height: 70,
                itemId: 'btnRight',
                listeners: {
                    click: 'on_rightBtn_click'
                }
            }]
        }]
    }]
});
