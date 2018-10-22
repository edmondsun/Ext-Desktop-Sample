Ext.define('DESKTOP.SystemSetup.notification.model.SNMPModel', {
    extend: 'Ext.app.ViewModel',
    // views: ['DESKTOP.SystemSetup.notification.view.SNMP'],
    alias: 'viewmodel.snmp',
    stores: {
        snmp: {
            fields: [
                "manager-ip-1",
                "manager-ip-2",
                "manager-ip-3",
                "community",
                "trap_filter",
                "enable",
                "port",
                "version"
            ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/notification/Snmp.php',
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
                        var ip = '';
                        var num = '0000';
                        var form = Ext.ComponentQuery.query('#Snmp')[0];
                        var record = records[0];
                        var type = record.getData().trap_filter.toString(2);
                        var arg = {};
                        num += type;
                        type = num.slice(-4).split("");
                        arg = {
                            info: type[1],
                            warning: type[2],
                            errors: type[3],
                            backup_events: type[0]
                        };
                        form.down("#snmp_type").setValue(arg);
                        form.getForm().loadRecord(store.getAt(0));
                        for (var x = 1; x <= 3; x++) {
                            if (record.getData()['manager-ip-' + x]) {
                                ip = record.getData()['manager-ip-' + x].split(":")[0];
                                form.down("#snmp_trap_addr" + x).setValue(ip);
                            }
                        }
                        form.getForm().setValues(form.getForm().getValues());
                    }
                }
            }
        }
    }
});
