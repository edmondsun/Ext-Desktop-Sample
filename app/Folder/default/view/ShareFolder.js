Ext.define('DESKTOP.Folder.default.view.ShareFolder', {
    extend: 'Ext.form.Panel',
    alias: 'widget.foldersharefolder',
    itemId: 'ShareFolder',
    requires: [
        'DESKTOP.Folder.default.controller.ShareFolderController',
        'DESKTOP.Folder.default.model.ShareFolderModel'
    ],
    viewModel: {
        type: 'foldersharefolder'
    },
    controller: 'foldersharefolder',
    layout: {
        type: 'border'
    },
    height: 500,
    width: 'auto',
    frame: true,
    collapsible: true,
    autoScroll: false,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    listeners: {
        afterrender: function (me, eOpts) {
            me.getEl().setStyle({
                padding: '0px'
            });
        },
        resize: function (me, width, height, oldWidth, oldHeight, eOpts) {
            var tabContainer = me.up('appwindow').down('#tabs');
            var tabBar_height = tabContainer.getTabBar().getHeight();
            var tabSouth_height = tabContainer.down('#tabsouth').getHeight();
            var new_height = tabContainer.getHeight() - tabBar_height - tabSouth_height;

            var new_grid_height = new_height - me.down('#north_panel').getHeight() - me.down('#center_panel').getHeight();
            me.setHeight(new_height);
            me.down('#permGrid').setHeight(new_grid_height - 14);
        }
    },

    items: [
    {
        xtype: 'treepanel',
        itemId: 'folderGrid',
        reference: 'folderGrid',
        region: 'west',
        width: 200,
        //qDefault: true,
        rootVisible: false,
        //enableColumnMove: false,
        useArrows: true,
        //autoScroll: true,
        scrollable: true,
        //collapsible: true,    // hide-show bar
        // viewConfig: {
        //     loadMask: false,
        //     emptyText: 'No record'
        // },
        bind: {
            store: '{folderTree}'
        },
        dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'label',
                qDefault: true,
                text:  'Folder list'
            }, '->', {
                xtype: 'button',
                text: 'Sort'
            },
            {
                xtype: 'button',
                text: 'Action',
                //iconCls: 'add16',
                menu: {
                    plain: true,
                    items: [
                        { text: 'Snapshot', reference: 'menu-snapshot'},
                        { text: 'QSlock', reference: 'menu-qslock' },
                        { text: 'Convert', reference: 'menu-convert' },
                        { text: 'Edit', reference: 'menu-edit' },
                        { text: 'Delete', reference: 'menu-delete' },
                        { text: 'Refresh', reference: 'menu-refresh' }
                    ],
                    listeners: {
                        click: 'onActionMenuClick',
                        beforeexpand: 'onActionMenuExpand'
                    }
                }
            }]
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'textfield',
                qDefault: true,
                enableKeyEvents: true,
                emptyText: 'Search folder name',
                width: '100%',
                listeners: {
                    keyup: 'onSearchFolder'
                }
            }]
        }],
        listeners: {
            beforeitemclick: 'onBeforeItemClick',
            beforecellclick: 'onBeforeCellClick',

            beforeselect: 'onBeforeChangeDirectory',
            selectionchange: 'onChangeDirectory',
            beforeitemexpand: 'onBeforeNodeExpand'
        }
    },
    {
        region: 'center',
        bodyPadding: 7,
        xtype: 'panel',
        layout: 'border',
        items: [
        {
            region: 'north',
            xtype: 'panel',
            itemId: 'north_panel',
            qDefault: true,
            height: 20,
            items: [
            {
                xtype: 'displayfield',
                qDefault: true,
                reference: 'folderName',
                fieldLabel: 'Folder name',
                labelFontColor: 'title',
                labelFontWeight: 'bold',
                bind: {
                    value: '{folderInfo.folder_name}'
                }
            }]
        },
        {
            region: 'center',
            xtype: 'panel',
            itemId: 'center_panel',
            layout: 'hbox',
            width: '100%',
            items: [
            {
                xtype: 'panel',
                width: 150,
                height: 150,
                itemId: 'item_polar',
                items: [{
                    xtype: 'polar',
                    height: 120,
                    width: 120,
                    colors: ['#058be7', '#32c1c7', '#f1f1f1'],
                    border: false,
                    // bind: {
                    //     store: '{pie}'
                    // },
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'size' ],
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
            },
            {
                xtype: 'panel',
                layout: 'vbox',
                width: 200,
                defaults: {
                    labelWidth: 100
                },
                items: [
                {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Folder Size',
                    bind: {
                        value: '{folderInfo.total_space}'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Used',
                    bind: {
                        value: '{folderInfo.used_space}'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Snapshot',
                    bind: {
                        value: '{snapshot_size}'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Free',
                    bind: {
                        value: '{folderInfo.avail_space}'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Folders',
                    bind: {
                        value: '{folderInfo.subfolder_num}'
                    }
                }, {
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Files',
                    bind: {
                        value: '{folderInfo.file_num}'
                    }
                }
                ]
            },
            {
                xtype: 'form',
                reference: 'folderConfigs',
                qDefault: true,
                width: 300,
                layout: 'vbox',
                items: [
                {
                    xtype: 'combobox',
                    qDefault: true,
                    name: 'owner',
                    fieldLabel: 'User',
                    reference: 'owner',
                    editable: false,
                    width: 250,
                    valueField: 'name',
                    displayField: 'name',
                    bind: {
                        store: '{userAll}'
                    }
                }, {
                    xtype: 'combobox',
                    qDefault: true,
                    name: 'owning_group',
                    fieldLabel: 'Group',
                    reference: 'owningGroup',
                    editable: false,
                    width: 250,
                    valueField: 'name',
                    displayField: 'name',
                    bind: {
                        store: '{groupAll}'
                    }
                }, {
                    xtype: 'checkbox',
                    qDefault: true,
                    name: 'include_parent',
                    reference: 'includeParent',
                    boxLabel: 'Include parents\' permissions (Windows only)',
                    formBind: true,
                    inputValue: '1',
                    listeners: {
                        change: 'onIncludeParentChange'
                    }
                }, {
                    xtype: 'checkbox',
                    qDefault: true,
                    name: 'dirty_apply',
                    reference: 'dirtyApply',
                    boxLabel: 'Apply changes to files and subfolders (Linux only)',
                    inputValue: '1',
                    checked: true,
                    formBind: true
                }, {
                    xtype: 'checkbox',
                    qDefault: true,
                    name: 'replace_child',
                    reference: 'replaceChild',
                    boxLabel: 'Replace children\' permissions with this folder\'s permissions',
                    inputValue: '1',
                    formBind: true
                }]
            }]
        },
        {
            xtype: 'gridpanel',
            qDefault: true,
            region: 'south',
            height: 330,
            width: '100%',
            itemId: 'permGrid',
            reference: 'permGrid',
            enableLocking: false,
            border: false,
            bodyBorder: false,
            scrollable: true,
            autoScroll: true,
            enableColumnMove: false,
            viewConfig: {
                loadMask: false,
                emptyText: 'No record',
                disableSelection: false,
                markDirty: false
            },
            bind: {
                store: '{permAll}'
            },
            defaults: {
                sortable: true,
                menuDisabled: true,
                hideable: false
            },
            columns: [
            {
                text: 'User name',
                dataIndex: 'name',
                menuDisabled: true,
                hideable: false,
                flex: 2
            }, {
                text: 'Preview',
                dataIndex: 'preview',
                menuDisabled: true,
                hideable: false,
                flex: 2
                //reference: 'preview'
            },{
                text: 'Deny access',
                xtype: 'checkcolumn',
                dataIndex: 'deny',
                menuDisabled: true,
                hideable: false,
                flex: 1,
                listeners: {
                    beforecheckchange: 'onBeforeLinuxPermChange'
                }
            },{
                text: 'Read only',
                xtype: 'checkcolumn',
                dataIndex: 'ro',
                menuDisabled: true,
                hideable: false,
                flex: 1,
                listeners: {
                    beforecheckchange: 'onBeforeLinuxPermChange'
                }
            },{
                text: 'Read/write',
                xtype: 'checkcolumn',
                dataIndex: 'rw',
                menuDisabled: true,
                hideable: false,
                flex: 1,
                listeners: {
                    beforecheckchange: 'onBeforeLinuxPermChange'
                }
            },{
                text: 'Custom',
                xtype: 'checkcolumn',
                reference: 'customCheck',
                dataIndex: 'custom',
                hidden: true,
                menuDisabled: true,
                hideable: false,
                flex: 1,
                listeners: {
                    beforecheckchange: 'showCustomPermWindow'
                }
            }],
            tbar:[
            {
                xtype: 'combobox',
                qDefault: true,
                fieldLabel: 'Permissions',
                reference: 'domainType',
                width: 200,
                editable: false,
                valueField: 'value',
                displayField: 'text',
                bind: {
                    store: '{domainOptions}'
                },
                listeners: {
                    select: 'onDomainTypeSelect'
                }
            }, '->', {
                xtype: 'textfield',
                qDefault: true,
                emptyText: 'Search user and group',
                enableKeyEvents: true,
                listeners: {
                    keyup: 'onSearch'
                }
            }],
            bbar: [{
                xtype: 'pagingtoolbar',
                bind: {
                    store: '{permAll}'
                },
                pageSize: 5,
                displayInfo: false,
                height: 10
            }]
        }]
    }]
});
