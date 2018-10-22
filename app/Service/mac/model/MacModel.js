Ext.define('DESKTOP.Service.mac.model.MacModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mac',
    stores: {
        afp: {
            fields: ['enable', 'port'],
            storeId: 'afp',
            fields: [''],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/Service/backend/mac/Mac.php',
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
                        var mainView   = Ext.ComponentQuery.query('#Mac')[0];
                        mainView.getForm().loadRecord(store.getAt(0));
                    }
                }
            }
        }
    }
});
