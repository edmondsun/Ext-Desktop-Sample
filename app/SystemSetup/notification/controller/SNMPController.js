Ext.define('DESKTOP.SystemSetup.notification.controller.SNMPController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.snmp',
    requires: [],
    downloadFile: function (field) {
        var form = Ext.create('Ext.form.Panel', {
            standardSubmit: true
        });
        form.submit({
            url: 'app/SystemSetup/backend/notification/Snmp.php',
            params: {
                op: 'download_mib'
            }
        });
    },
    on_Apply_All: function (myform, me) {
        var form = Ext.ComponentQuery.query('#Snmp')[0];
        var appwindow = me;
        var setTrapFilter = 0;
        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }
        setTrapFilter += (form.down("#snmp_type").getValue().info ? form.down("#snmp_type").getValue().info : 0) << 2;
        setTrapFilter += (form.down("#snmp_type").getValue().warning ? form.down("#snmp_type").getValue().warning : 0) << 1;
        setTrapFilter += (form.down("#snmp_type").getValue().errors ? form.down("#snmp_type").getValue().errors : 0) << 0;
        setTrapFilter += (form.down("#snmp_type").getValue().backup_events ? form.down("#snmp_type").getValue().backup_events : 0) << 3;
        setTrapFilter = setTrapFilter.toString(10);
        form.down("#snmp_trap_filter").setValue(setTrapFilter);
        form.submit({
            url: 'app/SystemSetup/backend/notification/Snmp.php',
            params: {
                op: 'set_snmp'
            },
            waitMsg: 'Saving...',
            success: function (myform, action) {
                var ref = 0;
                appwindow.getresponse(ref, 'SNMP');
                form.getViewModel().getStore('snmp').reload();
            },
            failure: function (myform, action) {
                var ref = action.result.msg;
                appwindow.getresponse(ref, 'SNMP');
                form.getViewModel().getStore('snmp').reload();
            }
        });
    }
});
