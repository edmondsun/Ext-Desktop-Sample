Ext.define('DESKTOP.SystemSetup.maintenance.controller.RecoveryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.recovery',
    requires: [],
    doReset: function (field) {
        var form = field.up('form');
        Ext.Msg.show({
            title: 'Really Reset ?',
            message: 'Do you really want to reset to factory ?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn === 'yes' && form.isValid()) {
                    var reserved = form.down('#reserved');
                    form.submit({
                        params: {
                            op: (reserved.checked) ? 'reset_option1' : 'reset_option2'
                        },
                        url: 'app/SystemSetup/backend/maintenance/ResetToDef.php',
                        waitMsg: 'Recovering...',
                        success: function (form, action) {
                            Ext.Msg.alert('Success', action.result.msg);
                        },
                        failure:function(form,action){
                            Ext.Msg.alert('Failed', action.result.msg);
                        }
                    });
                }
            }
        });
    }
});
