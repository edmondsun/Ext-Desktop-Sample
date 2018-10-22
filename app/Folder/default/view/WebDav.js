Ext.define('DESKTOP.Folder.default.view.WebDav', {
    extend: 'Ext.form.Panel',
    alias: 'widget.folderwebdav',
    requires: [
        'DESKTOP.Folder.default.model.WebDavModel',
        'DESKTOP.Folder.default.controller.WebDavController'
    ],
    controller: 'folderwebdav',
    viewModel: {
        type: 'folderwebdav'
    },
    itemId: 'WebDav',
    layout: {
        type: 'border'
    },
    height: 600,
    width: 'auto',
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    items: [{
            region: 'west',
            xtype: 'panel',
            border: 1,
            lines: false,
            width: 300,
            layout: {
                type: 'vbox'
            },
            items: [{
                xtype: 'container',
                customLayout: 'hlayout',
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: 'Folder name',
                    bind: {
                        value: '{folderGrid.selection.folder_name}'
                    },
                    labelFontColor: 'title',
                    labelFontWeight: 'bold'
                }]
            }, {
                xtype: 'panel',
                width: 120,
                height: 120,
                layout: 'fit',
                items: [{
                    xtype: 'polar',
                    colors: ['#058be7', '#32c1c7', '#f1f1f1'],
                    border: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'size'],
                        data: [{
                            name: 'Free',
                            size: 30
                        }, {
                            name: 'Used',
                            size: 30
                        }, {
                            name: 'Snapshot',
                            size: 30
                        }]
                    }),
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
                xtype: 'form',
                width: 'auto',
                defaults: {
                    labelWidth: 100
                },
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: 'Folder Size',
                    value: '100GB'
                }, {
                    xtype: 'displayfield',
                    fieldLabel: 'Used',
                    value: '30GB'
                }, {
                    xtype: 'displayfield',
                    fieldLabel: 'Snapshot',
                    value: '30GB'
                }, {
                    xtype: 'displayfield',
                    fieldLabel: 'Free',
                    value: '30GB'
                }]
            }]
        }, {
            region: 'center',
            xtype: 'panel',
            height: 300,
            items: [{
                xtype: 'container',
                customLayout: 'hlayout',
                items: [{
                    xtype: 'label',
                    text: 'Edit the user and group permissions for WebDAV access.'
                }]
            }, {
                xtype: 'container',
                customLayout: 'hlayout',
                items: [{
                    xtype: 'displayfield',
                    itemId: 'n_share_name',
                    fieldLabel: 'Network share name',
                    bind: {
                        value: '{folderGrid.selection.folder_name}'
                    }
                }]
            }, {
                tbar:[{
                    xtype: 'label',
                    text: 'Authentication by'
                }, {
                    xtype: 'combobox',
                    width: 200,
                    editable: false,
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'str',
                    itemId: 'authGroup',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'str'],
                        data: [{
                            'value': 'local_user',
                            'str': 'User'
                        }, {
                            'value': 'domain_user',
                            'str': 'Group'
                        }, {
                            'value': 'local_group',
                            'str': 'Domain user'
                        }, {
                            'value': 'domain_group',
                            'str': 'Domain group'
                        }]
                    }),
                    listeners: {
                        select: 'onDomainTypeSelect',
                        render: function (combo) {
                            combo.select('local_user');
                        }
                    }
                }, '->', {
                    xtype: 'textfield',
                    itemId: 'searchtext',
                    emptyText: 'Search folders name',
                    enableKeyEvents: true,
                    listeners: {
                        keyup: 'onSearchPerm'
                    }
                }]
            }, {
                xtype: 'gridpanel',
                width: '100%',
                reference: 'permListId',
                itemId: 'permGrid',
                enableLocking: false,
                scrollable: true,
                autoScroll: true,
                viewConfig: {
                    loadMask: false,
                    emptyText: 'No record',
                    markDirty: false
                },
                bind: {
                    store: '{permAll}'
                },
                listeners: {
                    itemmouseenter : 'gridChange'
                },
                columns: [{
                    text: 'User name',
                    dataIndex: 'name',
                    sortable: false,
                    menuDisabled: true,
                    flex: 1
                }, {
                    text: 'Acess right',
                    sortable: false,
                    menuDisabled: true,
                    flex: 1,
                    xtype: 'widgetcolumn',
                    dataIndex: 'access',
                    widget: {
                        xtype: 'combobox',
                        editable: false,
                        listeners: {
                            beforeselect: 'onChange'
                        },
                        reference: 'AcessRight',
                        valueField: 'webdav_perm_value',
                        displayField: 'webdav_perm',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'string'],
                            data: [{
                                "value": 'rw',
                                "string": "Full access"
                            }, {
                                "value": 'ro',
                                "string": "Read only"
                            }, {
                                "value": 'deny',
                                "string": "Deny access"
                            }]
                        }),
                        queryMode: 'local',
                        valueField: 'value',
                        displayField: 'string'
                    }
                }]
            }],
            bbar: Ext.create('Ext.toolbar.Paging', {
                pageSize: 10,
                displayInfo: false
            })
        }, {    
            region: 'south',
            xtype: 'panel',
            height: 230,
            items: [{
                xtype: 'toolbar',
                width: '100%',
                items: [{
                    xtype: 'label',
                    text: 'Folder list'
                }, '->', {
                    xtype: 'button',
                    text: 'onRefresh',
                    focusable: false, // avoid button being focused after pressed
                    listeners: {
                        click: 'onRefresh'
                    }
                }, {
                    xtype: 'textfield',
                    itemId: 'searchtext',
                    emptyText: 'Search folders name',
                    enableKeyEvents: true,
                    listeners: {
                        keyup: 'onSearch'
                    }
                }]
            }, {
                xtype: 'gridpanel',
                width: '100%',
                itemId: 'folderGrid',
                enableLocking: false, 
                reference: 'folderGrid',
                viewConfig: {
                    loadMask: false,
                    emptyText: 'No record',
                    disableSelection: false,
                    markDirty: false
                },
                bind: {
                    store: '{folderListTree}'
                },
                listeners: {
                    select: 'onGridPanelClick'
                },
                columns: [{
                    text: 'Folder name',
                    dataIndex: 'folder_name',
                    sortable: false,
                    width: 180,
                    menuDisabled: true
                }, {
                    text: 'Descriptions',
                    dataIndex: 'abs_path',
                    width: 250,
                    menuDisabled: true,
                    sortable: false
                }, {
                    text: 'Folder size',
                    dataIndex: 'size',
                    menuDisabled: true,
                    sortable: false
                }, {
                    text: 'Folder',
                    dataIndex: 'subfolder_num',
                    width: 80,
                    menuDisabled: true,
                    sortable: false
                }, {
                    text: 'Files',
                    dataIndex: 'file_num',
                    width: 80,
                    menuDisabled: true,
                    sortable: false
                }, {
                    text: 'Status',
                    dataIndex: 'status',
                    menuDisabled: true,
                    width: 50,
                    sortable: false
                }, {
                    text: 'Pool',
                    menuDisabled: true,
                    width: 50,
                    dataIndex: 'pool',
                    sortable: false
                },{
                    text: 'Volume',
                    menuDisabled: true,
                    width: 50,
                    dataIndex: 'volume',
                    sortable: false
                }]
            }]
        }
    ]
});
