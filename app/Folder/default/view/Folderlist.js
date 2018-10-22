Ext.define('DESKTOP.Folder.default.view.Folderlist', {
    extend: 'Ext.form.Panel',
    alias: 'widget.folderlist',
    requires: [
        'DESKTOP.Folder.default.model.FolderlistModel',
        'DESKTOP.Folder.default.controller.FolderlistController'
    ],
    controller: 'folderlist',
    viewModel: {
        type: 'folderlist'
    },
    config: {
        /**
         * actionType: 'ShareFolder/NFSHost/WebDav/WindowsNetworkHost'
         * default: ''
         */
        viewType: ''
    },
    applyViewType: function (value) {
        if (value.length === 0) {
            return;
        }
        switch (value) {
        case 'ShareFolder':
            Ext.apply(this, {
                // title: 'Delete NFS Host',
                // layout: 'vbox',
                items: [{
                    xtype: 'treepanel',
                    bind: {
                        store: '{folderTree}'
                    },
                    width: '100%',
                    height: 300,
                    rootVisible: false,
                    useArrows: true,
                    autoScroll: true,
                    forceFit: true,
                    columns: [{
                        xtype: 'treecolumn',
                        text: 'Folder name',
                        dataIndex: 'folder_name',
                        resizable: false,
                        width: 180,
                        menuDisabled: true,
                        sortable: false
                    }, {
                        text: 'Descriptions',
                        resizable: false,
                        dataIndex: 'abs_path',
                        width: 220,
                        sortable: false,
                        menuDisabled: true
                    }, {
                        text: 'Folder size',
                        resizable: false,
                        dataIndex: 'folder_size',
                        flex: 1,
                        sortable: false,
                        menuDisabled: true
                    }, {
                        text: 'Folders',
                        resizable: false,
                        flex: 1,
                        dataIndex: 'subfolder_num',
                        sortable: false,
                        menuDisabled: true
                    }, {
                        text: 'Files',
                        resizable: false,
                        flex: 1,
                        dataIndex: 'file_num',
                        sortable: false,
                        menuDisabled: true
                    }, {
                        text: 'Status',
                        resizable: false,
                        flex: 1,
                        dataIndex: 'folder_status',
                        sortable: false,
                        menuDisabled: true
                    }, {
                        text: 'Pool',
                        resizable: false,
                        flex: 1,
                        dataIndex: 'belong_pool',
                        sortable: false,
                        menuDisabled: true
                    }],
                    tbar: [{
                        xtype: 'label',
                        qDefault: true,
                        text: 'Folder list'
                    }, '->', {
                        xtype: 'button',
                        qDefault: true,
                        text: 'Edit',
                        listeners: {
                            click: 'onEdit'
                        }
                    }, {
                        xtype: 'button',
                        qDefault: true,
                        text: 'Refresh',
                        listeners: {
                            click: 'onRefresh'
                        }
                    }, {
                        xtype: 'button',
                        qDefault: true,
                        text: 'Delete'
                    }, {
                        xtype: 'textfield',
                        qDefault: true,
                        itemId: 'searchtext',
                        emptyText: 'Search folder name',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: 'onSearch'
                        }
                    }],
                    bbar: Ext.create('Ext.toolbar.Paging', {
                        pageSize: 10,
                        displayInfo: false
                    }),
                    listeners: {
                        // afterlayout: 'aftertreelayout',
                        // //selectionchange: 'onFolderSelectionChange',
                        // itemclick: 'onItemClick',
                        // //beforecellclick: 'onBeforeCellClick',
                        // // beforeselect: 'onSelectDirectory',
                        // beforeitemexpand: 'onBeforeNodeExpand'
                    }
                }]
            });
            break;
        default:
            Ext.apply(this, {
                items: [{
                    xtype: 'toolbar',
                    qDefault: true,
                    border: false,
                    width: '100%',
                    items: [{
                        xtype: 'label',
                        qDefault: true,
                        labelFontWeight: 'bold',
                        text: 'Folder list'
                    }, '->', {
                        xtype: 'button',
                        qDefault: true,
                        text: 'Refresh',
                        listeners: {
                            click: 'onRefresh'
                        }
                    }]
                }, {
                    xtype: 'textfield',
                    qDefault: true,
                    width: 190,
                    padding: '10 5 10 5',
                    itemId: 'searchtext',
                    emptyText: 'Search folder',
                    enableKeyEvents: true,
                    listeners: {
                        keyup: 'onSearch'
                    }
                }, {
                    xtype: 'grid',
                    qDefault: true,
                    // bind: {
                    //     store: '{folderList}'
                    // },
                    style: 'border:0px;',
                    width: '100%',
                    height: 'auto',
                    itemId: 'folderGrid',
                    forceFit: true,
                    hideHeaders: true,
                    reference: 'folderGrid',
                    columns: [{
                        dataIndex: 'folder_name',
                        resizable: false,
                        width: '100%',
                        menuDisabled: true,
                        sortable: false,
                        renderer: function (value, metaData, record, rowIndex, colIndex, u) {
                            var newValue = '<div style="padding-left:20px;background:url({0}) no-repeat; background-size: 16px 16px;"/>{1}</div>';
                            return Ext.String.format(newValue, "app/Folder/images/file_70x70_ori.gif", value);
                        }
                    }],
                    listeners: {
                        select: 'onFolderListSelect'
                    }
                }]
            });
            break;
        }
    }
});
