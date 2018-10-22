Ext.define('DESKTOP.Folder.default.model.NfsHostModel', {
    extend: 'Ext.app.ViewModel',
    mixins: ['DESKTOP.Folder.default.model.ShareFolderModel'],
    alias: 'viewmodel.foldernfshost',
    requires: ['DESKTOP.Folder.default.controller.NfsHostController'],
    data: {
        folder_name: '',
        folders_num: 0,
        files_num: 0,
        volume: '',
        pool: '',
        total_size: 0,
        used: 0,
        free: 0,
        snapshot_size: 0
    },
    stores: {
        accessright: {
            storeId: 'accessright',
            // needOnLoad: true,
            fields: [],
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: 'app/Folder/backend/default/Nfs.php',
                method: 'get',
                extraParams: {
                    share: ''
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, success) {
                    if (success) {}
                }
            }
        },
        pie: {
            fields: ['name', 'size'],
            storeId: 'pie',
            proxy: {
                type: 'localstorage'
            },
            data: [{
                name: 'Free',
                size: 0
            }, {
                name: 'Used',
                size: 0
            }, {
                name: 'Snapshot',
                size: 0
            }]
        }
    }
});
