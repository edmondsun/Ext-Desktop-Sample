Ext.define('DESKTOP.SystemSetup.performance.model.PerformanceModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.performance',
    stores: {
        performance: {
            fields: ['mode'],
            autoLoad: true,
            needOnLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/performance/performance_tuning.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var record = records[0];
                        var form = Ext.ComponentQuery.query('#Performance')[0];
                        form.getForm().loadRecord(record);
                    }
                }
            }
        }
    }
});
