Ext.define('DESKTOP.SystemSetup.generalsetting.controller.ManagementController', {
    extend: 'Ext.app.ViewController',
    requires: [],
    alias: 'controller.management',
    on_Apply_All: function (form, me) {
        if (form.isValid()) { // make sure the form contains valid data before submitting
            var appwindow = me,
                store = Ext.data.StoreManager.lookup('system_ident');
            clearInterval(store.timeoutId);
            appwindow.showLoadingMask();
            form.submit({
                url: 'app/SystemSetup/backend/generalsetting/Management.php',
                success: function (form, action) {
                    appwindow.hideLoadingMask();
                    var ref = 0;
                    appwindow.getresponse(ref, 'Management');
                    Ext.ComponentQuery.query('#Management')[0].getViewModel().getStore('management').reload();
                },
                failure: function (form, action) {
                    appwindow.hideLoadingMask();
                    var ref = action.result.msg;
                    appwindow.getresponse(ref, 'Management');
                    // Ext.Msg.alert('Failed', msg);
                    Ext.ComponentQuery.query('#Management')[0].getViewModel().getStore('management').reload();
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    }
});
