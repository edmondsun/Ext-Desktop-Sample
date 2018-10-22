Ext.define('DESKTOP.StorageManagement.volume.view.Volume', {
    extend: 'Ext.form.Panel',
    alias: 'widget.volume',
    requires: [
        'DESKTOP.StorageManagement.volume.model.VolumeModel',
        'DESKTOP.StorageManagement.volume.controller.VolumeController',
		'Ext.slider.Single'
    ],
    controller: 'volume',
    viewModel: {
        type: 'volume'
    },
    layout: {
        type: 'border'
    },
    width: 740,
    height: 470,
    collapsible: true,
    waitMsgTarget: true,
    itemId: 'Volume',
    items: [{
        region: 'north',
        height: 270,
        style: {
            borderBottom: '1px solid #ccc'
        },
        items: [{
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'container',
                customLayout: 'vlayout',
                width: 200,
                items: [{
                    xtype: 'label',
                    itemId: 'vol_name',
                    bind: {
                        text: '{VolumeName}'
                    },
                    style : {
                        'font-weight': 'bold',
                        'textAlign': 'left',
                        'font-size': '14px'
                    }
                },{
                    xtype: 'checkbox',
                    itemId: 'notify_enable',
                    boxLabel: 'Notification',
                    style: {
                        'padding': '15px 0px'
                    },
                    bind: {
                        value: '{Notify}'
                    },
                    listeners: {
                        change: 'onNotifyChange'
                    }
                }]     
            },{
                xtype: 'container',
                width: 400,
                style: {
                    'padding': '35px 10px'
                },
                items: [{
                    xtype: 'container',
                    customLayout: 'vlayout',
                    items: [{
                        xtype: 'container',
                        padding: '0 0 0 50',
                        items: [{
                            xtype: 'container',
                            customLayout: 'hlayout',
                            items: [{
                                xtype: 'panel',
                                width: 120,
                                height: 120,
                                layout: 'fit',
                                items: [{
                                    xtype: 'polar',
                                    colors: ['#058BE7', '#F1F1F1'],
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
                                                var me = this;
                                                me.setHtml(record.get('name') + ': ' + record.get('capacity') + 'GB');
                                            }
                                        },
                                        subStyle: {
                                            strokeStyle: ['#058BE7', '#F1F1F1'],
                                            lineWidth: [0, 0]
                                        },
                                        xField: 'capacity'
                                    }
                                }]
                            },{
                                xtype: 'container',
                                customLayout: 'vlayout',
                                style: {
                                    'padding': '45px 0px'
                                },
                                width: 200,
                                items: [{
                                    xtype: 'container',
                                    padding: '0 0 0 50',
                                    items: [{
                                        xtype: 'displayfield',
                                        fieldLabel: '??Used ',
                                        bind: {
                                            value: '{UsedGB}GB'
                                        }
                                    },{
                                        xtype: 'displayfield',
                                        fieldLabel: '??Free ',
                                        bind: {
                                            value: '{FreeGB}GB'
                                        }
                                    }]
                                }]  
                            }]
                        },{
                            xtype: 'displayfield',
                            itemId: 'capacity',
                            fieldLabel: 'Total Size: ',
                            bind: {
                                value: '{TotalSize}GB'
                            },
                            style : {
                              'textAlign': 'center'
                            }
                        }]
                    },{
                        // x: 0,
                        // y: 0,
                        // xtype: 'progressbar',
                        // width: 300,
                        // height: 10,
                        // value: 0.03,
                        // listeners: {
                        //     update: function (obj, loadScripts, callback, me) {
                        //         obj.text = '';
                        //         return me;
                        //     }
                        // }
                    },{
                        x: 0,
                        y: 0,
                        itemId: 'capacity_notification',
                        // name: 'capacity_notification',
                        xtype: 'multislider',
                        width: 300,
                        listeners: {
                            change: 'onSliderChange'
                        },
                        minValue: 0,
                        maxValue: 100,
                        values: [0, 50],
                        bind: {
                            value: '{NotifyThreshold}'
                        }
                    },{
                        xtype: 'container',
                        style: {
                            'padding': '15px 0px'
                        },
                        customLayout: 'hlayout',
                        items: [{
                            xtype: 'displayfield',
                            fieldLabel: 'Used:',
                            bind: {
                                value: '{UsedPer}%'
                            }
                        },{
                            xtype: 'displayfield',
                            fieldLabel: 'Available:',
                            bind: {
                                value: '{FreePer}%'
                            }
                        },{
                            xtype: 'displayfield',
                            fieldLabel: 'Information:',
                            itemId: 'vol_info',
                            bind: {
                                value: '{Info}%'
                            }
                        },{
                            xtype: 'displayfield',
                            fieldLabel: 'Warning:',
                            itemId: 'vol_warn',
                            bind: {
                                value: '{Warn}%'
                            }
                        }]
                    }]
                }]
            }]
        }]
    }, {
        region: 'west',
        width: 150,
        items: [{
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                text: 'Pool',
                style : {
                    'font-weight': 'bold',
                    'textAlign': 'left',
                    'font-size': '14px'
                }
            }]
        }, {
            xtype: 'treepanel',
            itemId: 'tree_pool',
            rootVisible: false,
            reference: 'tree_pool',
            useArrows: true,
            listeners: {
                itemclick: 'onPoolTreeClick'
            }
        }]
    }, {
        region: 'center',
        style: {
            borderLeft: '1px solid #ccc'
        },
        items: [{
            xtype: 'toolbar',
            qDefault: true,
            width: '100%',
            items: [{
                xtype: 'container',
                customLayout: 'vlayout',
                width: 150,
                items: [{
                    xtype: 'label',
                    text: 'The volume of Pool1',
                    style : {
                        'font-weight': 'bold',
                        'textAlign': 'left',
                        'font-size': '14px'
                    }
                }]
            },{
                xtype: 'button',
                text: 'Expand',
                handler: 'onExpand',
                itemId: 'expand_button',
                disabled: true
            }, {
                xtype: 'button',
                text: 'Delete',
                handler: 'onDelete',
                itemId: 'delete_button',
                disabled: true
            }]
        },{
            xtype: 'treepanel',
            maxHeight: 130,
            itemId: 'tree_volume',
            rootVisible: false,
            reference: 'tree_volume',
            listeners: {
                itemclick: 'onVolumeTreeClick'
            }
        }]
    }]
});
