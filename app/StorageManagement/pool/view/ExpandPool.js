Ext.define('DESKTOP.StorageManagement.pool.view.ExpandPool', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    alias: 'view.expandpool',
    requires: [
        'DESKTOP.StorageManagement.lib.raidTool',
        'DESKTOP.StorageManagement.pool.model.EncModel'
    ],
    modal: true,
    width: 800,
    height: 600,
    bodyPadding: 20,
    closeAction: 'destroy',
    title: 'Expand Pool',
    viewModel: {
        type: 'enc'
    },
    controller: 'pool',
    itemId: 'ExpandPool',
    // listeners: {
            
    // },
    dockedItems: [{
        xtype: 'toolbar',
        qDefault: true,
        dock: 'bottom',
        items: ['->', {
            xtype: 'button',
            qDefault: true,
            text: 'Cancel',
            listeners: {
                click: function() {
                    this.up('window').close();
                }
            }
        }, {
            xtype: 'button',
            qDefault: true,
            text: 'Confirm',
            listeners: {
                click: 'onExpandPoolConfirm'
            }
        }]
    }],
    items: [{
        xtype: 'form',
        qDefault: true,
        width: '100%',
        fieldDefaults: {
            labelWidth: 150,
            msgTarget: 'qtip'
        },
        waitMsgTarget: true,
        items: [{
            xtype: 'label',
            qDefault: true,
            text: 'Pool information',
            width: '100%'
        }, {
            
        }, {
            xtype: 'container',
            qDefault: true,
            padding: '0 0 0 0',
            width: '100%',
            layout: 'hbox',
            items: [{
                xtype: 'container',
                qDefault: true,
                padding: '0 0 0 0',
                flex: 1,
                items:[{
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
                    colors : ['#058be7', '#32c1c7', '#f1f1f1'],
                    bind: {
                        store: '{pie_for_expand}'
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
                                this.setHtml(storeItem.get('item') + ': ' + storeItem.get('capacity') + 'GB' );
                            }
                        }
                    }]
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Total size:',
                    name: 'pool_total_size',
                    itemId: 'total_size',
                    value: ''
                }]
            }, {
                xtype: 'form',
                qDefault: true,
                flex: 1,
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    itemId: 'foldersUsedGB',
                    fieldLabel: 'Folders:',
                    name: 'vol_used_size',
                    value: ''
                    
                },{
                    xtype: 'displayfield',
                    qDefault: true,
                    itemId: 'iSCSIUsedGB',
                    fieldLabel: 'iSCSI:',
                    name: 'lun_used_size',
                    value: ''
                },{
                    xtype: 'displayfield',
                    qDefault: true,
                    itemId: 'availableGB',
                    fieldLabel: 'Free:',
                    name: 'free_size',
                    value: ''
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                padding: '0 0 0 0',
                flex: 2,
                items:[{
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: '',
                    name: 'pool_name',
                    itemId: 'pool_name',
                    value: ''
                }, {
                    xtype: 'treepanel',
                    qDefault: true,
                    width: 400,
                    height: 100,
                    rootVisible: false,
                    bind: {
                        store: '{pool_composition_for_expand}'
                    },
                    handler: function () { 
                        console.log("this.getLoader()"); 
                        console.log(this.getLoader()); 
                        this.getLoader().load(this.root); 
                    }
                }]
            }] 
        }, {
            xtype: 'label',
            qDefault: true,
            text: 'Add another raid type to expand the pool'
        }, {
            xtype: 'combobox',
            qDefault: true,
            itemId: 'enclosurecb',
            editable: false,
            fieldLabel: 'Unit',
            bind: {
                store: '{enclosure_expand}'
            },
            queryMode: 'local',
            valueField: 'enc_id',
            displayField: 'enc_name',
            listeners: {
                select: 'onCreatePoolEnCBSelect'
            }
        }, {
            xtype: 'grid',
            qDefault: true,
            forceFit: true,
            height: 150,
            itemId: 'info',
            bind: {
                store: '{enclosure_grid}'
            },
            viewConfig: {
                loadMask: false,
                markDirty: false
            },
            columns: [{
                xtype: 'checkcolumn',
                qDefault: true,
                //text: 'Choose',
                dataIndex: 'seletion',
                sortable: false,
                renderer: function(val, m, rec) {
                    if (rec.get('info') === '')
                        return '';
                    else
                        return (new Ext.ux.CheckColumn()).renderer(val);
                },
                listeners: {
                    checkchange: 'onCreatePoolGridSelect'
                }
            }, {
                text: 'Slot No.',
                dataIndex: 'slot',
                sortable: false
            }, {
                text: 'Size(GB)',
                dataIndex: 'size_gb',
                sortable: false
            }, {
                text: 'Health',
                dataIndex: 'health',
                sortable: false
            }, {
                text: 'Type',
                dataIndex: 'type',
                sortable: false
            }, {
                text: 'Vendor',
                dataIndex: 'vendor',
                sortable: false
            }, {
                text: 'Rate',
                dataIndex: 'rate',
                sortable: false
            }]
        }, {
            xtype: 'combobox',
            qDefault: true,
            flex: 1,
            editable: false,
            fieldLabel: 'RAID type',
            itemId: 'raidtypecb',
            bind: {
                store: '{RAID_type}'
            },
            queryMode: 'local',
            name: 'raid_level',
            valueField: 'raid_level',
            displayField: 'raid_type',
            listeners: {
                select: 'onCreatePoolRaidCBSelect'
            }
        }, {
            xtype: 'displayfield',
            qDefault: true,
            flex: 1,
            fieldLabel: 'Estimated capacity:',
            bind: {
                value: '{total_cap} GB'
            }
        }]
    }]
});
