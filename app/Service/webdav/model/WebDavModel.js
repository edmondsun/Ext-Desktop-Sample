Ext.define('DESKTOP.Service.webdav.model.WebDavModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.webdav',
    stores: {
        webdav: {
            storeId: 'webdav',
            fields: ['enable', 'webdav_port', 'webdavs_port'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/Service/backend/webdav/WebDav.php',
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
                        var mainView   = Ext.ComponentQuery.query('#WebDav')[0];
                        mainView.getForm().loadRecord(store.getAt(0));
                    }
                }
            }
        }
    }
});
