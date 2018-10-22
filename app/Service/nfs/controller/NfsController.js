Ext.define('DESKTOP.Service.nfs.controller.NfsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.nfs',
    init: function() {
    },
    on_Apply_All: function (form, me) {
        var mainView  = Ext.ComponentQuery.query('#Nfs')[0];
        var form      = mainView.down('form').getForm();
        var appwindow = me;
        var self      = this;

        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }

        appwindow.showLoadingMask();

        form.submit({
            url: 'app/Service/backend/nfs/Nfs.php',
            method: 'POST',
            params: {
                op: 'nfs_set'
            },
            success: function (form, action) {
                appwindow.hideLoadingMask();

                if (Ext.JSON.decode(action.response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'Nfs');
                }
            },
            failure: function (form, action) {
                appwindow.hideLoadingMask();
                var msg = (Ext.JSON.decode(action.response.responseText)).msg;
                var ref = msg;
                appwindow.getresponse(ref, 'Nfs');
            }
        });
    }
});
