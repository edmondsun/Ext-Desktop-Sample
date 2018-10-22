Ext.define('DESKTOP.Service.windows.model.WindowsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.windows',
    stores: {
        windows: {
            storeId: 'windows',
            fields: [
                      'enable', 
                      'server_description', 
                      'workgroup', 
                      'win_port', 
                      'win_server_ip1',
                      'win_server_ip2',
                      'local_master_browser',
                      'smb_encrypt'
                    ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/Service/backend/windows/Windows.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var mainView   = Ext.ComponentQuery.query('#Windows')[0];
                        mainView.getForm().loadRecord(store.getAt(0));
                    }
                }
            }
        }
    }
});
