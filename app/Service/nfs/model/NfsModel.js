Ext.define('DESKTOP.Service.nfs.model.NfsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.nfs',
    stores: {
        afp: {
            storeId: 'nfs',
            fields: ['enable', 'nfs4_domain', 'port'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/Service/backend/nfs/Nfs.php',
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
                        var mainView   = Ext.ComponentQuery.query('#Nfs')[0];
                        mainView.getForm().loadRecord(store.getAt(0));
                    }
                }
            }
        }
    }
});
