Ext.define('DESKTOP.Service.ftp.model.FtpModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.ftp',
    stores: {
        ftp: {
            storeId: 'ftp',
            fields: [
                        'login_banner', 
                        'clients', 
                        'connections',
                        'login_attempts', 
                        'timeout', 
                        'min_passive_port',
                        'max_passive_port',
                        'upload_bandwidth',
                        'download_bandwidth',
                        'ftp_port',
                        'sftp_port'
                    ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/Service/backend/ftp/Ftp.php',
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
                        var mainView   = Ext.ComponentQuery.query('#Ftp')[0];
                        mainView.getForm().loadRecord(store.getAt(0));
                    }
                }
            }
        }
    }
});
