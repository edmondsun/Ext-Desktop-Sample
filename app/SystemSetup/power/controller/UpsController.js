Ext.define('DESKTOP.SystemSetup.power.controller.UpsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ups',
    requires: [
        'Ext.window.MessageBox',
        'Ext.util.TaskRunner'
    ],
    /* dicides which items the combobox should display */
    dicideItems: function (field, newvalue) {
        var form = field.up('form');
        switch (newvalue) {
        case 'none':
            form.down('#megaUpsField').hide();
            form.down('#serialfield').disable();
            form.down('#snmpfield').disable();
            form.down('#snmpfield').hide();
            break;
        case 'smartups':
            form.down('#megaUpsField').hide();
            form.down('#serialfield').enable();
            form.down('#snmpfield').disable();
            form.down('#snmpfield').hide();
            break;
        case 'mgtups':
            form.down('#megaUpsField').show();
            form.down('#serialfield').enable();
            form.down('#snmpfield').disable();
            form.down('#snmpfield').hide();
            break;
        case 'snmp':
            form.down('#megaUpsField').hide();
            form.down('#serialfield').enable();
            form.down('#snmpfield').enable();
            form.down('#snmpfield').show();
            break;
        }
    },
    on_Apply_All: function (form, appWindow) {
        var upsStore = this.getStore('ups');

        if (form.isValid()) {
            appWindow.showLoadingMask();
            form.submit({
                url: 'app/SystemSetup/backend/power/UPS.php',
                params: {
                    op: 'set_ups'
                },
                success: function (form, action) {
                    appWindow.hideLoadingMask();
                    appWindow.getresponse(0, 'Ups');
                    upsStore.reload();
                },
                failure: function (form, action) {
                    var ref = action.result.msg
                            ? action.result.msg
                            : 'Fail to apply your configuration.';

                    appWindow.getresponse(ref, 'Ups');
                    appWindow.hideLoadingMask();
                    upsStore.reload();
                }
            });
        } else {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    }
});
