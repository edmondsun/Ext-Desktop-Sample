// TODO: Handover extend to Evan
Ext.define('DESKTOP.ux.form.field.Switch', {
    extend: 'Ext.form.field.Checkbox',
    alias: 'widget.toogle_switch',
    cls: 'toogle_switch'
});
// End of  Handover extend to Evan

Ext.define('DESKTOP.StorageManagement.pool.view.Pool', {
    extend: 'Ext.form.Panel',
    alias: 'widget.pool',
    requires: [
        'DESKTOP.StorageManagement.pool.controller.PoolController',
        'DESKTOP.StorageManagement.pool.model.PoolModel'
    ],
    controller: 'pool',
    viewModel: {
        type: 'pool'
    },
    itemId: 'Pool',
    frame: true,
    collapsible: true,
    autoScrool: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    viewConfig: {
        markDirty: false
    },
    listeners: {
        afterrender: 'afterview',
        beforedestroy: function (form) {
            Ext.TaskManager.stopAll();
        }
    },
    items: [{
        xtype: 'label',
        qDefault: true,
        text: 'Pool information',
        width: '100%'
    }, {
        xtype: 'container',
        qDefault: true,
        padding: '0 0 0 0',
        width: 800, //changeable
        layout: 'hbox',
        items: [{
            xtype: 'container',
            qDefault: true,
            padding: '0 0 0 0',
            flex: 1,
            items: [{
                xtype: 'polar',
                qDefault: true,
                itemId: 'pool_polar_chart',
                width: 100,
                height: 100,
                padding: 0,
                bodyPadding: 0,
                insetPadding: 0,
                innerPadding: 0,
                border: false,
                colors: ['#058be7', '#32c1c7', '#f1f1f1'],
                bind: {
                    store: '{pie}'
                },
                interactions: [],
                series: [{
                    type: 'pie',
                    angleField: 'capacity',
                    subStyle: {
                        strokeStyle: ['#058be7', '#32c1c7', '#f1f1f1'],
                        lineWidth: [0, 0, 0]
                    },
                    tooltip: {
                        trackMouse: true,
                        style: 'background: #fff',
                        renderer: function(storeItem, item) {
                            this.setHtml(storeItem.get('item') + ': ' + storeItem.get('capacity') + 'GB');
                        }
                    }
                }]
            }, {
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Total size:',
                name: 'pool_total_size',
                itemId: 'pool_total_size',
                bind: {
                    value: '{vm_pool_size} GB'
                }
            }]
        }, {
            xtype: 'form',
            flex: 1,
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Folders:',
                name: 'vol_used_size',
                bind: {
                    value: '{foldersUsedGB}GB'
                }
            }, {
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'iSCSI:',
                name: 'lun_used_size',
                bind: {
                    value: '{iSCSIUsedGB}GB'
                }
            }, {
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Free:',
                name: 'free_size',
                bind: {
                    value: '{availableGB}GB'
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            padding: '0 0 0 0',
            // width : 300,
            flex: 3,
            items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: '',
                    name: 'pool_name',
                    itemId: 'pool_name',
                    bind: {
                        value: '{vm_pool_name}'
                    }
                }, {
                    xtype: 'treepanel',
                    qDefault: true,
                    width: '100%',
                    height: 100,
                    rootVisible: false,
                    bind: {
                        store: '{pool_composition}'
                    },
                    handler: function() {
                        console.log("this.getLoader()");
                        console.log(this.getLoader());
                        this.getLoader().load(this.root);
                    }
                }, {
                    xtype: 'progressbarmultislider',
                    width: '100%',
                    progressbarConfig: {
                        itemId: 'pool_used_percent_bar',
                        bind: {
                            value: '{vm_pool_used_bar}'
                        }
                    },
                    multisliderConfig: {
                        itemId: 'capacity_notification_thumb', 
                        bind: {
                            // values: '{vm_pool_threshold}'
                            // values: [80, 90]
                        },
                        listeners: {
                            // change: 'onDrag',
                            // changecomplete: 'onDrag',
                            dragend: 'onDrag',
                            afterrender: 'unSetDirty'
                        }
                    }
                }, {
                    xtype: 'container',
                    qDefault: true,
                    padding: '0 0 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'begin'
                    },
                    items: [{
                        xtype: 'toogle_switch',
                        boxLabel: 'Send notification',
                        boxLabelAlign: 'before',
                        itemId: 'notification',
                        name: 'notification',
                        margin: '0 0 0 0',
                        bind: {
                            value: '{vm_pool_usage_alert}'
                        },
                        listeners: {
                            change: 'toogleNotification',
                            afterrender: 'unSetDirty'
                        }
                    }]
                }, {
                    xtype: 'container',
                    qDefault: true,
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    padding: '0',
                    items: [{
                        xtype: 'displayfield',
                        qDefault: true,
                        fieldLabel: 'Used:',
                        name: 'pool_used_space_percent',
                        itemId: 'pool_used_space_percent',
                        bind: {
                            value: '{vm_pool_used_percent}%'
                        },
                        flex: 1,
                        defaults: {
                            labelWidth: 40
                        }
                    }, {
                        xtype: 'displayfield',
                        qDefault: true,
                        fieldLabel: 'Available:',
                        name: 'pool_available_space_percent',
                        itemId: 'pool_available_space_percent',
                        bind: {
                            value: '{vm_pool_avl_percent}%'
                        },
                        flex: 1,
                        defaults: {
                            labelWidth: 40
                        }
                    }, {
                        xtype: 'label',
                        qDefault: true,
                        text: 'Information',
                        margin: '0 0 0 0',
                        flex: 1,
                        rtl: true,
                        defaults: {
                            labelWidth: 40
                        }
                    }, {
                        xtype: 'label',
                        qDefault: true,
                        text: 'Warning',
                        margin: '0 0 0 0',
                        flex: 1,
                        rtl: true,
                        defaults: {
                            labelWidth: 40
                        }
                    }]
                }
            ]
        }]
    }, {
        xtype: 'grid',
        qDefault: true,
        width: '600',
        forceFit: true,
        itemId: 'poolInfo',
        bind: {
            store: '{poolInfo}'
        },
        viewConfig: {
            loadMask: false,
            markDirty: false
        },
        listeners: {
            //rowclick: 'onPoolRowClick',
            select: 'selectPoolRow'
        },
        columns: [{
            text: 'Status',
            dataIndex: 'status',
            sortable: false,
            hideable: false,
            renderer: function(value) {
                var status = value.toLowerCase();
                switch (status) {
                    case "online":
                        status = '<div style="text-align:center"><div style="margin:0px auto; width:15px;height:15px;background:url(app/StorageManagement/images/status_s.png) 0px 0px;"></div></div>';
                        break;
                    case "degrade":
                        status = '<div style="text-align:center"><div style="margin:0px auto; width:15px;height:15px;background:url(app/StorageManagement/images/status_s.png) 0px -15px;"></div></div>';
                        break;
                    case "degraded":
                        status = '<div style="text-align:center"><div style="margin:0px auto; width:15px;height:15px;background:url(app/StorageManagement/images/status_s.png) 0px -15px;"></div></div>';
                        break;
                    case "rebuilding":
                        status = '<div style="text-align:center"><div style="margin:0px auto; width:15px;height:15px;background:url(app/StorageManagement/images/status_s.png) 0px -15px;"></div></div>';
                        break;
                    case "scrubbing":
                        status = '<div style="text-align:center"><div style="margin:0px auto; width:15px;height:15px;background:url(app/StorageManagement/images/status_s.png) 0px -15px;"></div></div>';
                        break;
                    case "importing":
                        status = '<div style="text-align:center"><div style="margin:0px auto; width:15px;height:15px;background:url(app/StorageManagement/images/status_s.png) 0px -15px;"></div></div>';
                        break;
                    case "failed":
                        status = '<div style="text-align:center"><div style="margin:0px auto; width:15px;height:15px;background:url(app/StorageManagement/images/status_s.png) 0px -30px;"></div></div>';
                        break;
                    case "locked":
                        status = '<div style="text-align:center"><div style="margin:0px auto; width:15px;height:15px;background:url(app/StorageManagement/images/status_s.png) 0px -30px;"></div></div>';
                        break;
                    default:
                        status = value;
                        break;
                }
                if(status === null){
                    return '';
                }else{
                    return status;
                }
            }
        }, {
            text: 'Encryption',
            dataIndex: 'encrypt_type',
            sortable: false
        }, {
            text: 'Pool name',
            dataIndex: 'pool_name',
            sortable: false,
            hideable: false
        }, {
            text: 'Total(GB)',
            dataIndex: 'total_gb',
            sortable: false
        }, {
            text: 'Used(GB)',
            dataIndex: 'used_gb',
            sortable: false
        }, {
            text: 'Free(GB)',
            dataIndex: 'free_gb',
            sortable: false
        }, {
            text: 'Dedup',
            dataIndex: 'dedup',
            sortable: false,
            renderer: function(value) {
                if (typeof(value) === 'boolean') {
                    if (value === true) {
                        return 'Yes';
                    } else {
                        return 'No';
                    }
                } else {
                    return value;
                }
            }
        }, {
            text: 'Spare disk',
            dataIndex: 'has_spare',
            sortable: false,
            renderer: function(value) {
                if (typeof(value) === 'boolean') {
                    if (value === true) {
                        return 'Yes';
                    } else {
                        return 'No';
                    }
                }
            }
        }, {
            text: 'Write Cache',
            dataIndex: 'pd_prop_write_cache',
            sortable: false,
            renderer: function(value) {
                if (typeof(value) === 'boolean') {
                    if (value === true) {
                        return 'Yes';
                    } else {
                        return 'No';
                    }
                }
            }
        }],

        dockedItems: [{
            xtype: 'toolbar',
            qDefault: true,
            dock: 'top',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Pool list'
            }, '->', {
                xtype: 'button',
                qDefault: true,
                itemId: 'pool_expand',
                text: 'Expand',
                handler: '',
                listeners: {
                    click: 'onExpandPool'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'pool_edit',
                text: 'Edit',
                handler: '',
                listeners: {
                    click: 'onEditPool'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'pool_unlock',
                text: 'Unlock',
                handler: '',
                listeners: {
                    click: 'onUnlock'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'pool_porting',
                importValue: 'Import',
                exportValue: 'Export',
                exportBool: false,
                text: 'Import',
                disabled: true,
                handler: '',
                listeners: {
                    click: 'onPort'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'pool_scrub',
                text: 'Scrub',
                handler: '',
                listeners: {
                    click: 'onScrubPool'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'pool_delete',
                text: 'Delete',
                handler: '',
                listeners: {
                    click: 'onDelete'
                }
            }]
        }]
    }]
});
