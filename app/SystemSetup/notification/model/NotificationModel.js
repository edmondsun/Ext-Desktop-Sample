Ext.define('DESKTOP.SystemSetup.notification.model.NotificationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.notify',
    stores: {
        notify: {
            fields: [{
                name: 'info'
            }, {
                name: 'warning'
            }, {
                name: 'error'
            }, {
                name: 'backup_event'
            }],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/notification/Notification_center.php',
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
                        var form = Ext.ComponentQuery.query('#Center')[0];
                        var record = records[0];
                        form.getForm().loadRecord(store.getAt(0));
                    }
                }
            }
        }
    }
});
