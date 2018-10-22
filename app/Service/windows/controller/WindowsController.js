Ext.define('DESKTOP.Service.windows.controller.WindowsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.windows',
    init: function() {
    },
    on_Apply_All: function (form, me) {
        var mainView  = Ext.ComponentQuery.query('#Windows')[0];
        var form      = mainView.down('form').getForm();
        var appwindow = me;
        var self      = this;

        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }

        appwindow.showLoadingMask();

        form.submit({
            url: 'app/Service/backend/windows/Windows.php',
            method: 'POST',
            params: {
                op: 'windows_set'
            },
            success: function (form, action) {
                appwindow.hideLoadingMask();

                if (Ext.JSON.decode(action.response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'Windows');
                }
            },
            failure: function (form, action) {
                appwindow.hideLoadingMask();
                var msg = (Ext.JSON.decode(action.response.responseText)).msg;
                var ref = msg;
                appwindow.getresponse(ref, 'Windows');
            }
        });
    }
});
