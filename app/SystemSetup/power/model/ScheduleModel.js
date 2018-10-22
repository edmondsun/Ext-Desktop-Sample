Ext.define('DESKTOP.SystemSetup.power.model.ScheduleModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.schedule',
    stores: {
        powerschedule: {
            fields: [
                'auto_shutdown_status',
                'wol_enable',
                'power_schedule_enable', // we will use this flag only
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
                        var form = Ext.ComponentQuery.query('#Schedule')[0],
                            schedulearr = Ext.data.StoreManager.lookup('schedulearr'),
                            record = records[0];

                        form.getForm().loadRecord(record);
                        if (record.get('power_schedule_enable')) {
                            form.queryById('pwrschedule').enable();
                            form.queryById('pwrscheduletoolbar').enable();
                        } else {
                            form.queryById('pwrschedule').disable();
                            form.queryById('pwrscheduletoolbar').disable();
                        }

                        schedulearr.loadData(record.get('power_schedule_arr'));
                    }
                }
            }
        },
        schedulearr: {
            storeId: 'schedulearr',
            fields: [
                'action',
                'type',
                'day_period',
                'week_period',
                'weekdays',
                'months',
                'dates',
                'hours',
                'minutes',
                'index',
                'to_date'
            ]
        }
    }
});
