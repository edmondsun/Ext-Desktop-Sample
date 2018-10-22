Ext.define('DESKTOP.SystemSetup.power.model.PowerManagementModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.powermanagement',
    stores: {
        powerschedule: {
            fields: [
                'auto_shutdown_status',
                'wol_enable',
                'power_schedule_enable',
                'power_schedule_wait_backup_enable',
                'wait_backup_enable',
                'recovery'
            ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/power/Management.php',
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
                        var form = Ext.ComponentQuery.query('#Management')[0];
                        form.getForm().loadRecord(records[0]);
                    }
                }
            }
        }
    }
});
