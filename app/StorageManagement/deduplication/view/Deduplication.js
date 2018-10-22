Ext.define('DESKTOP.StorageManagement.deduplication.view.Deduplication', {
    extend: 'Ext.form.Panel',
    alias: 'widget.deduplication',
    requires: [
        'DESKTOP.StorageManagement.deduplication.controller.DeduplicationController',
        'DESKTOP.StorageManagement.deduplication.model.DeduplicationModel',
        'Ext.slider.*'
    ],
    controller: 'deduplication',
    viewModel: {
        type: 'deduplication'
    },
    itemId: 'Deduplication',
    collapsible: true,
    // autoScroll: true,
    waitMsgTarget: true,
    width: 740,
    height: 450,
    trackResetOnLoad: true,
    layout: 'border',
    items: [{
        region: 'north',
        height: 180,
        style: {
            borderBottom: '1px solid #ccc'
        },
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            width: 700,
            // listeners: {
            //     afterlayout: function (me) {
            //         var form = me.up('form'),
            //             counts = form.getViewModel().get('render_time');
            //         switch (counts) {
            //         case 0:
            //             var mask = new Ext.LoadMask({
            //                 msg: 'loading',
            //                 target: form
            //             });
            //             mask.show();
            //             counts++;
            //             form.getViewModel().set('mask', mask);
            //             form.getViewModel().set('render_time', counts);
            //             break;
            //         case 6:
            //             var d_mask = form.getViewModel().get('mask');
            //             d_mask.destroy();
            //             break;
            //         default:
            //             counts++;
            //             form.getViewModel().set('render_time', counts);
            //             break;
            //         }
            //     }
            // },
            items: [{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'checkbox',
                    labelFontWeight: 'bold',
                    labelFontColor: 'title',
                    itemId: 'check_enable',
                    reference: 'check_enable',
                    bind: {
                        boxLabel: 'Enable deduplication on {tree_pool.selection.text}',
                        disabled: '{!tree_pool.selection.read_cache}'
                    },
                    uncheckedValue: 0,
                    listeners: {
                        change: function (me, newVal) {
                            me.resetOriginalValue(newVal);
                        }
                    }
                }, {
                    xtype: 'tbfill'
                }, {
                    xtype: 'button',
                    qDefault: true,
                    text: 'Edit',
                    hidden: true,
                    handler: 'on_editCache',
                    bind: {
                        hidden: '{!tree_pool.selection.read_cache}'
                    }
                }, {
                    xtype: 'button',
                    qDefault: true,
                    text: 'Add',
                    hidden: true,
                    handler: 'on_addCache',
                    bind: {
                        hidden: '{tree_pool.selection.read_cache}'
                    }
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'label',
                    bind: {
                        text: '{tree_pool.selection.text} SSD read cache'
                    }
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                bind: {
                    hidden: '{!tree_pool.selection.read_cache}'
                },
                items: [{
                    xtype: 'label',
                    text: 'The system performance might be impacted when reach the cache size.'
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                layout: 'hbox',
                bind: {
                    hidden: '{!tree_pool.selection.read_cache}'
                },
                items: [{
                    xtype: 'container',
                    qDefault: true,
                    customLayout: 'vlayout',
                    width: 400,
                    items: [{
                        xtype: 'container',
                        qDefault: true,
                        customLayout: 'hlayout',
                        items: [{
                            xtype: 'container',
                            qDefault: true,
                            // width: 300,
                            customLayout: 'hlayout',
                            items: [{
                                xtype: 'progressbar',
                                width: 400,
                                bind: {
                                    value: '{tree_pool.selection.used_percent_f}'
                                }
                            }]
                        }]
                    }, {
                        xtype: 'container',
                        qDefault: true,
                        customLayout: 'hlayout',
                        items: [{
                            xtype: 'displayfield',
                            qDefault: true,
                            fieldLabel: '○ Used ',
                            bind: {
                                value: '{tree_pool.selection.used_percent} %'
                            }
                        }, {
                            xtype: 'displayfield',
                            qDefault: true,
                            fieldLabel: '○ Available: ',
                            bind: {
                                value: '{tree_pool.selection.avail_percent} %'
                            }
                        }]
                    }]
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                width: '100%',
                bind: {
                    hidden: '{tree_pool.selection.read_cache}'
                },
                items: [{
                    xtype: 'label',
                    text: 'No available SSD read cache on the pool. ' +
                        'To enable deduplication,you need to add a SSD ' +
                        'read cache on the pool.'
                }]
            }]
        }]
    }, {
        region: 'west',
        width: 150,
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                text: 'Pool',
                labelFontColor: 'title',
                labelFontWeight: 'bold'
            }]
        }, {
            xtype: 'treepanel',
            itemId: 'tree_pool',
            rootVisible: false,
            reference: 'tree_pool',
            name: 'dedup_arr',
            useArrows: true,
            listeners: {
                select: 'on_poolTree_click'
            }
        }]
    }, {
        region: 'center',
        style: {
            borderLeft: '1px solid #ccc'
        },
        bind: {
            disabled: '{!tree_pool.selection.read_cache}'
        },
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            style: 'paddingLeft:10px',
            items: [{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'label',
                    bind: {
                        text: 'The folder or iSCSI LUN of {tree_pool.selection.text}'
                    },
                    labelFontWeight: 'bold',
                    labelFontColor: 'title'
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'label',
                    text: 'Select folders or iSCSI LUNs in the pool to apply deduplication function.'
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'combobox',
                    qDefault: true,
                    itemId: 'combo_filter',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['selector', 'selector_value'],
                        data: [{
                            'selector': 'All',
                            'selector_value': '0'
                        }, {
                            'selector': 'Folder',
                            'selector_value': '1'
                        }, {
                            'selector': 'LUN',
                            'selector_value': '2'
                        }]
                    }),
                    queryMode: 'local',
                    valueField: 'selector_value',
                    displayField: 'selector',
                    editable: false,
                    value: 0,
                    width: 100,
                    listeners: {
                        change: 'on_comboFilter'
                    }
                }]
            }]
        }, {
            xtype: 'treepanel',
            maxHeight: 140,
            itemId: 'tree_folderAndLun',
            rootVisible: false,
            reference: 'tree_folderAndLun',
            bind: {
                disabled: '{!check_enable.checked}'
            }
        }]
    }]
});
