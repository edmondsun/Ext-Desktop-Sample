Ext.define('DESKTOP.Folder.default.model.FolderlistModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.folderlist',
    requires: ['DESKTOP.Folder.default.controller.FolderlistController'],
    data: {
        share_name: '',
        path: ''
    },
    stores: {
        folderTree: {
            storeId: 'folderTree',
            type: 'tree',
            view: null,
            rootVisible: false,
            autoLoad: false,
            fields: [''],
            root: {
                expanded: false
            },
            proxy: {
                type: 'ajax',
                method: 'get',
                url: 'app/Folder/backend/default/ShareFolder.php',
                extraParams: {
                    op: 'get_all_folders'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, successful) {
                    if (successful && this.proxy.extraParams.op == 'get_all_folders' && store.loadCount == 1) {}
                }
            }
        },
        folderList: {
            storeId: 'folderList',
            autoLoad: false,
            view: null,
            fields: [''],
            proxy: {
                type: 'ajax',
                method: 'get',
                url: 'app/Folder/backend/default/Folder.php',
                extraParams: {
                    op: 'get_folder_list'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, successful) {
                    if (successful && this.proxy.extraParams.op == 'get_all_folders' && store.loadCount == 1) {}
                }
            }
        }
    }
});
