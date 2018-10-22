Ext.define('DESKTOP.Service.mac.controller.MacController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mac',
    init: function() {
    },
    on_Apply_All: function (form, me) {
        var mainView  = Ext.ComponentQuery.query('#Mac')[0];
        var form      = mainView.down('form').getForm();
        var appwindow = me;
        var self      = this;

        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }

        appwindow.showLoadingMask();

        form.submit({
            url: 'app/Service/backend/mac/Mac.php',
            method: 'POST',
            params: {
                op: 'afp_set'
            },
            success: function (form, action) {
                appwindow.hideLoadingMask();

                if (Ext.JSON.decode(action.response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'Mac');
                }
            },
            failure: function (form, action) {
                appwindow.hideLoadingMask();
                var msg = (Ext.JSON.decode(action.response.responseText)).msg;
                var ref = msg;
                appwindow.getresponse(ref, 'Mac');
            }
        });
    }
});
