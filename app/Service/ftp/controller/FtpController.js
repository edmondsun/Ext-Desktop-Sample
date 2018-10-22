Ext.define('DESKTOP.Service.ftp.controller.FtpController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ftp',
    init: function() {
    },
    on_Apply_All: function (form, me) {
        var mainView  = Ext.ComponentQuery.query('#Ftp')[0];
        var form      = mainView.down('form').getForm();
        var appwindow = me;
        var self      = this;

        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }

        appwindow.showLoadingMask();

        form.submit({
            url: 'app/Service/backend/ftp/Ftp.php',
            method: 'POST',
            params: {
                op: 'ftp_set'
            },
            success: function (form, action) {
                appwindow.hideLoadingMask();

                if (Ext.JSON.decode(action.response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'Ftp');
                }
            },
            failure: function (form, action) {
                appwindow.hideLoadingMask();
                var msg = (Ext.JSON.decode(action.response.responseText)).msg;
                var ref = msg;
                appwindow.getresponse(ref, 'Ftp');
            }
        });
    }
});
