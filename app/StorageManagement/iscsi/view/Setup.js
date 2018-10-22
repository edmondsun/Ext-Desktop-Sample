Ext.define('DESKTOP.StorageManagement.iscsi.view.Setup', {
    extend: 'Ext.form.Panel',
    alias: 'widget.iscsisetup',
    itemId: 'Setup',
    requires: [
        'DESKTOP.StorageManagement.iscsi.controller.SetupController',
        'DESKTOP.StorageManagement.iscsi.model.SetupModel'
    ],
    controller: 'iscsisetup',
    viewModel: {
        type: 'iscsisetup'
    },
    width: 'auto',
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'panel',
        border: 1,
        width: 350,
        items: [{
            xtype: 'label',
            text: 'Target',
            labelFontColor: 'title',
            labelFontWeight: 'bold'
        }, {
            xtype: 'container',
            layout: 'hbox',
            items: [{
                itemId: 'tarEdit',
                xtype: 'button',
                text: 'Edit',
                handler: 'onTargetEdit',
                disabled: true
                // bind: {
                //     disabled: '{!tree_target.selection.name}'
                // }
            }, {
                itemId: 'tarDel',
                xtype: 'button',
                text: 'Delete',
                handler: 'onTargetDelete',
                disabled: true
                // bind: {
                //     disabled: '{!tree_target.selection.lun_name}'
                // }       
            }, {
                itemId: 'tarUnMap',
                xtype: 'button',
                text: 'Unmap',
                handler: 'onUnmap',
                bind: {
                    disabled: '{!tree_target.selection.lun_name}'
                }       
            }]
        }, {
            xtype: 'treepanel',
            itemId: 'target_name',
            iemdId: 'tree_target',
            rootVisible: false,
            reference: 'tree_target',
            height: 500,
            useArrows: true,
            listeners: {
                itemclick: function (tree, record) {
                    Ext.ComponentQuery.query('#grid_unmappedLun')[0].getSelectionModel().deselectAll();
                },
                select: 'tarSelected'
            }
        }]
    }, {
        xtype: 'container',
        width: 600,
        items: [{
            xtype: 'container',
            items: [{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                itemId: 'info_lun',
                hidden: true,
                items: [{
                    xtype: 'container',
                    layout: 'vbox',
                    width: 200,
                    items: [{
                        xtype: 'label',
                        text: 'LUN',
                        labelFontColor: 'title',
                        labelFontWeight: 'bold'
                    }, {
                        xtype: 'image',
                        width: 120,
                        height: 120,
                        src: 'app/StorageManagement/images/lun.png'
                    }, {
                        xtype: 'displayfield',
                        itemId: 'dLunname',
                        bind: {
                            value: '{lun_name}' 
                        }
                    }]
                }, {
                    xtype: 'container',
                    width: '100%',
                    defaults: {
                        labelWidth: 110
                    },
                    items: [{
                        xtype: 'displayfield',
                        fieldLabel: 'Type ',
                        labelFontWeight: 'bold',
                        itemId: 'dType',
                        bind: {
                            value: '{lun_type}'
                        }
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: 'Capacity ',
                        labelFontWeight: 'bold',
                        itemId: 'dCap',
                        bind: {
                            value: '{lun_capacity} GB'
                        }
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: 'Used ',
                        labelFontWeight: 'bold',
                        itemId: 'dUsed',
                        bind: {
                            value: '{lun_used} GB'
                        }
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: 'Available ',
                        labelFontWeight: 'bold',
                        itemId: 'dAvai',
                        bind: {
                            value: '{lun_available} GB'
                        }
                    }, {
                        // xtype: 'displayfield',
                        // fieldLabel: 'Target on the lun ',
                        // labelFontWeight: 'bold',
                        // itemId: 'dTarget',
                        // bind: {
                        //     hidden: '{!unmapped2display.selection.target_id}',
                        //     value: '{unmapped2display.selection.target_id}'
                        // }
                    }]
                }]
            }, {
                xtype: 'fieldcontainer',
                itemId: 'info_target',
                layout: 'hbox',
                items: [{
                    xtype: 'container',
                    width: 200,
                    layout: 'vbox',
                    items: [{
                        xtype: 'label',
                        text: 'Target',
                        labelFontColor: 'title',
                        labelFontWeight: 'bold'
                    }, {
                        xtype: 'image',
                        width: 120,
                        height: 120,
                        src: 'app/StorageManagement/images/target.png'
                    }, {
                        itemId: 'target_num_name',
                        xtype: 'displayfield',
                        bind: {
                            value: '{tree_target.selection.text}'
                        }
                    }, {
                        itemId: 'target_on_off',
                        xtype: 'checkbox',
                        boxLabel: 'on',
                        style : {
                            'textAlign': 'center'
                        }
                    }]
                }, {
                    xtype: 'container',
                    width: '100%',
                    items: [{
                        xtype: 'displayfield',
                        fieldLabel: 'IQN ',
                        labelFontWeight: 'bold',
                        itemId: 'd_iqn',
                        bind: {
                            value: '{tar_iqn}'
                        }
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: 'CHAP ',
                        labelFontWeight: 'bold',
                        itemId: 'd_chap',
                        value: ''
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: 'Mutual CHAP ',
                        labelFontWeight: 'bold',
                        itemId: 'd_mutchap',
                        value: ''
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: 'Attached LUN ',
                        labelFontWeight: 'bold',
                        itemId: 'd_attlun',
                        value: ''
                    }]
                }]
            }]
        },{
            xtype: 'grid',
            width: '100%',
            dock: 'top',
            maxHeight: 150,
            columnWidth: 0.2,
            itemId: 'grid_masking',
            reference: 'grid_masking',
            bind: {
                store: '{maskLun}'
            },
            listeners: {
                select: 'maskSelected'
            },
            columns: [{
                text: 'Policy name',
                dataIndex: 'name',
                width: 100,
                sortable: false,
                hideable: false,
                menuDisabled: true
            }, {
                text: 'Initiator IQN',
                dataIndex: 'host',
                width: 180,
                sortable: false,
                menuDisabled: true
            }, {
                itemId: 'mask_read',
                text: 'Read only',
                dataIndex: 'ro_status',
                sortable: false,
                menuDisabled: true,
                xtype: 'checkcolumn',
                inputValue: 1,
                uncheckedValue: 0
            }, {
                itemId: 'mask_read_write',
                text: 'Read/Write',
                dataIndex: 'rw_status',
                sortable: false,
                menuDisabled: true,
                xtype: 'checkcolumn',
                inputValue: 1,
                uncheckedValue: 0
            }, {
                itemId: 'mask_write',
                text: 'Deny',
                dataIndex: 'deny_status',
                width: 100,
                sortable: false,
                menuDisabled: true,
                xtype: 'checkcolumn',
                inputValue: 1,
                uncheckedValue: 0
            }],
            dockedItems: [{
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'label',
                    text: 'LUN Masking',
                    labelFontColor: 'title',
                    labelFontWeight: 'bold'
                }, {
                    xtype: 'tbfill'
                }, {
                    xtype: 'button',
                    itemId: 'mask_add_btn',
                    text: 'Add',
                    handler: 'onMaskAdd'
                }, {
                    xtype: 'button',
                    itemId: 'mask_edit_btn',
                    text: 'Edit',
                    handler: 'onMaskEdit'
                    // bind: {
                    //     disabled: '{!grid_masking.selection}'
                    // }       
                }, {
                    xtype: 'button',
                    itemId: 'mask_del_btn',
                    text: 'Delete',
                    handler: 'onMaskDelete',
                    disabled: true
                    // bind: {
                    //     disabled: '{!grid_masking.selection}'
                    // }       
                }]
            }]
        }, {
            xtype: 'container',
            customLayout: 'splitter'
        }, {
            xtype: 'grid',
            dock: 'top',
            itemId: 'grid_unmappedLun',
            reference: 'unmapped2display',
            maxHeight: 280,
            width: '100%',
            listeners: {
                select: 'lunSelected'
            },
            bind: {
                store: '{unmappedLun}'
            },
            columns: [{
                text: 'LUN name',
                dataIndex: 'lun_name',
                sortable: false,
                hideable: false,
                menuDisabled: true
            }, {
                text: 'Capacity',
                dataIndex: 'volsize_gb',
                sortable: false,
                menuDisabled: true
            }, {
                text: 'Used',
                dataIndex: 'used_gb',
                sortable: false,
                menuDisabled: true
            }, {
                text: 'Available',
                dataIndex: 'avail_gb',
                sortable: false,
                menuDisabled: true
            }, {
                text: 'Pool',
                width: 180,
                dataIndex: 'pool_name',
                sortable: false,
                menuDisabled: true
            }],
            dockedItems: [{
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'label',
                    text: 'Un-Mapped LUN',
                    labelFontColor: 'title',
                    labelFontWeight: 'bold'
                }, {
                    xtype: 'tbfill'
                }, {
                    itemId: 'lun_edit',
                    xtype: 'button',
                    text: 'Edit',
                    handler: 'onLUNEdit'
                }, {
                    itemId: 'lun_del',
                    xtype: 'button',
                    text: 'Delete',
                    handler: 'onUnMapDelete'
                }, {
                    itemId: 'lun_map',
                    xtype: 'button',
                    text: 'Map',
                    handler: 'onLunMap'
                }]
            }]
        }]
    }]
});
