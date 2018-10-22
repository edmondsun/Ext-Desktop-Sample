Ext.define('DESKTOP.Folder.default.model.WindowsNetworkHostModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.folderwindowsnetworkhost',
    requires: ['DESKTOP.Folder.default.controller.WindowsNetworkHostController'],
    data: {
        share_name: '',
        rpath: '',
        host: '',
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
        hostIP: {
            storeId: 'hostIP',
            autoLoad: false,
            fields: [''],
            listeners: {
                load: function (store, records) {
                    var form = Ext.ComponentQuery.query('#WindowsNetworkHost')[0];
                    var grid_host = form.down('#grid_host');
                    grid_host.getSelectionModel().select(0);
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
