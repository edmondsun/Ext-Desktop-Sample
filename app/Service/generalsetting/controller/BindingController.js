Ext.define('DESKTOP.Service.generalsetting.controller.BindingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.binding',
    requires: [
        'DESKTOP.SystemSetup.generalsetting.view.SystemPassword'
    ],
    async: false,
    start_iden: function (field) {
        Ext.Ajax.request({
            url: 'app/SystemSetup/backend/generalsetting/System.php',
            method: 'post',
            params: {
                op: 'start_iden'
            },
            // success: function (form, action) {
            //     var respText = Ext.util.JSON.decode(form.responseText);
            // },
            failure: function (form, options) {
                var respText = Ext.util.JSON.decode(form.responseText),
                    msg = respText.msg;
                Ext.Msg.alert('Failed', msg);
            }
        });
        var store = Ext.data.StoreManager.lookup('system_ident');
        store.reload();
    },
    /*sub window: password*/
    onChangePassword: function () {
        var chande_password = Ext.create('DESKTOP.SystemSetup.generalsetting.view.SystemPassword');
        chande_password.show();
    },
    on_Apply_All: function (form, me) {
        if (form.isValid()) { // make sure the form contains valid data before submitting
            var appwindow = me,
                store = Ext.data.StoreManager.lookup('system_ident');
            clearInterval(store.timeoutId);
            appwindow.showLoadingMask();
            form.submit({
                params: {
                    op: 'sys_seting'
                },
                async: false,
                success: function (form, action) {
                    appwindow.hideLoadingMask();
                    var ref = 0;
                    appwindow.getresponse(ref, 'System');
                    Ext.ComponentQuery.query('#System')[0].getViewModel().getStore('system').reload();
                    Ext.ComponentQuery.query('#System')[0].getViewModel().getStore('system_ident').reload();
                },
                failure: function (form, action) {
                    appwindow.hideLoadingMask();
                    var ref = action.result.msg;
                    appwindow.getresponse(ref, 'System');
                    // Ext.Msg.alert('Failed', msg);
                    Ext.ComponentQuery.query('#System')[0].getViewModel().getStore('system').reload();
                    Ext.ComponentQuery.query('#System')[0].getViewModel().getStore('system_ident').reload();
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    }
});
