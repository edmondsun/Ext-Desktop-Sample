Ext.define('DESKTOP.StorageManagement.snapshot.view.Management', {
    extend: 'Ext.form.Panel',
    alias: 'widget.snapshotmanagement',
    itemId: 'Management',
    requires: [
        'DESKTOP.StorageManagement.snapshot.controller.ManagementController',
        'DESKTOP.StorageManagement.snapshot.model.ManagementModel',
        'DESKTOP.StorageManagement.snapshot.view.ManagementSetting'
    ],
    controller: 'snapshotmanagement',
    viewModel: {
        type: 'snapshotmanagement'
    },
    layout: {
        type: 'border'
    },
    listeners: {
        beforedestroy: function (form) {
            Ext.TaskManager.stopAll();
        }
    },
    height: 495,
    width: 'auto',
    collapsible: true,
    // autoScroll: true,
    waitMsgTarget: true,
    items: [{
        region: 'west',
        xtype: 'panel',
        border: 1,
        lines: false,
        width: 260,
        layout: {
            type: 'vbox'
        },
        items: [{
            xtype: 'label',
            qDefault: true,
            itemId: 'snapshotname',
            bind: {
                text: '{Name}'
            },
            labelFontColor: 'title',
            labelFontWeight: 'bold'
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'top'
            },
            defaults: {
                margin: '0 8 0 0'
            },
            items: [{
                xtype: 'panel',
                width: 120,
                height: 120,
                layout: 'fit',
                items: [{
                    xtype: 'polar',
                    qDefault: true,
                    colors: ['#058be7', '#32c1c7', '#f1f1f1'],
                    border: false,
                    bind: {
                        store: '{pie}'
                    },
                    series: {
                        type: 'pie',
                        showInLegend: true,
                        // highlight: true,
                        tooltip: {
                            trackMouse: true,
                            renderer: function (record, data) {
                                this.setHtml(record.get('name') + ':' + record.get('size') + 'GB');
                            }
                        },
                        // label: {
                        //     field: 'name',
                        //     contrast: true,
                        // },
                        subStyle: {
                            strokeStyle: ['#058be7', '#32c1c7', '#f1f1f1'],
                            lineWidth: [0, 0, 0]
                        },
                        xField: 'size'
                        // donut: 25
                    }
                }]
            }, {
                xtype: 'form',
                width: 'auto',
                defaults: {
                    labelWidth: 60
                },
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Used',
                    bind: {
                        value: '{UsedGB}GB'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Snapshot',
                    bind: {
                        value: '{SnapshotGB}GB'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Free',
                    bind: {
                        value: '{FreeGB}GB'
                    }
                }]
            }]
        }]
    }, {
        region: 'center',
        xtype: 'panel',
        items: [{
            xtype: 'displayfield',
            qDefault: true,
            fieldLabel: 'Snapshot',
            bind: {
                value: '{SnapshotType}'
            }
        }, {
            xtype: 'toolbar',
            qDefault: true,
            width: '100%',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Snapshot list'
            }, '->', {
                xtype: 'button',
                qDefault: true,
                itemId: 'Clonebtn',
                text: 'Clone',
                bind: {
                    disabled: '{!snapshotlist.selection}'
                },
                focusable: false, // avoid button being focused after pressed
                listeners: {
                    click: 'doClone'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'Rollbackbtn',
                text: 'Roll back',
                bind: {
                    disabled: '{!snapshotlist.selection}'
                },
                focusable: false, // avoid button being focused after pressed
                listeners: {
                    click: 'doRollBack'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                itemId: 'Deletebtn',
                text: 'Delete',
                bind: {
                    disabled: '{!snapshotlist.selection}'
                },
                focusable: false,
                listeners: {
                    click: 'onDelete'
                }
            }]
        }, {
            xtype: 'gridpanel',
            qDefault: true,
            width: '100%',
            itemId: 'snapshotlist',
            reference: 'snapshotlist',
            height: 120,
            viewConfig: {
                loadMask: false,
                emptyText: 'No record'
            },
            bind: {
                store: 'snapshotlist'
            },
            columns: [{
                text: 'Name',
                dataIndex: 'name',
                width: 200,
                sortable: false,
                menuDisabled: true
            }, {
                text: 'Create time',
                dataIndex: 'create_time',
                flex: 1,
                menuDisabled: true,
                sortable: false
            }]
        }]
    }, {
        region: 'south',
        xtype: 'panel',
        qDefault: true,
        height: 250,
        items: [{
            xtype: 'toolbar',
            qDefault: true,
            width: '100%',
            items: [{
                xtype: 'combobox',
                qDefault: true,
                width: 100,
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'str'],
                    data: [{
                        "value": 'all',
                        "str": "All"
                    }, {
                        "value": 'folder',
                        "str": "Folder"
                    }, {
                        "value": 'lun',
                        "str": "LUN"
                    }]
                }),
                valueField: 'value',
                displayField: 'str',
                mode: 'local',
                listeners: {
                    render: function (combo) {
                        combo.select('all');
                        combo.fireEvent('select');
                    },
                    select: 'onComboSelect'
                }
            }, {
                xtype: 'textfield',
                qDefault: true,
                itemId: 'searchtext',
                emptyText: 'Search folders or LUN',
                enableKeyEvents: true,
                listeners: {
                    keyup: 'onSearch'
                }
            }, '->', {
                xtype: 'button',
                qDefault: true,
                text: 'Take now',
                focusable: false, // avoid button being focused after pressed
                listeners: {
                    click: 'onTake'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                text: 'Schedule',
                focusable: false, // avoid button being focused after pressed
                listeners: {
                    click: 'onAddSchedule'
                }
            }]
        }, {
            xtype: 'gridpanel',
            qDefault: true,
            width: '100%',
            height: 200,
            itemId: 'snapshotgrid',
            reference: 'snapshotgrid',
            viewConfig: {
                loadMask: false
            },
            // bind: {
            //     store:'{snapshotInfo}'
            // },
            // enableLocking:true,
            listeners: {
                select: 'onGridselect'
            },
            columns: [{
                text: 'Name',
                dataIndex: 'zfs_name',
                sortable: false,
                // locked:true,
                width: 100,
                menuDisabled: true
            }, {
                text: 'Size(GB)',
                dataIndex: 'total_gb',
                width: 100,
                menuDisabled: true,
                sortable: false
            }, {
                text: 'Used(GB)',
                dataIndex: 'used_gb',
                width: 100,
                menuDisabled: true,
                sortable: false
            }, {
                text: 'Path',
                dataIndex: 'name',
                width: 120,
                menuDisabled: true,
                sortable: false
            }, {
                text: 'Type',
                dataIndex: 'type',
                width: 70,
                menuDisabled: true,
                sortable: false
            }, {
                text: 'Schedule',
                dataIndex: 'sched_desc',
                menuDisabled: true,
                width: 200,
                sortable: false
            }, {
                text: 'Last create time',
                menuDisabled: true,
                width: 160,
                dataIndex: 'last_snap_time',
                sortable: false
            }]
            // dockedItems: [{
            //     xtype: 'pagingtoolbar',
            //     itemId: 'paging',
            //     // bind: {
            //     //     store:'{snapshotInfo}',
            //     // },
            //     store: Ext.create('Ext.data.Store', {
            //         id: 'simpsonsStore',
            //         autoLoad: true,
            //         fields: ['name', 'email', 'phone'],
            //         pageSize: 10, // items per page
            //         proxy: {
            //             type: 'ajax',
            //             url: 'app/StorageManagement/backend/snapshot/Snapshot.php', // url that will load data with respect to start and limit params
            //             reader: {
            //                 type: 'json',
            //                 rootProperty: 'data',
            //                 totalProperty: 'total'
            //             }
            //         }
            //     }),
            //     dock: 'bottom',
            //     displayInfo: true
            // }]
        }]
    }]
});
