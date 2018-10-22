Ext.define('DESKTOP.SystemSetup.generalsetting.controller.TimeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.time',
    requires: [],
    //Button Function
    onReset: function () {
        this.getViewModel('time').getStore('sysTime').reload();
    },
    on_Apply_All: function (form, me) {
        var cb = Ext.ComponentQuery.query('#ntp_checked')[0].getValue(),
            appwindow = me;
        appwindow.showLoadingMask();
        if (form.isValid()) {
            if (cb === true) {
                form.submit({
                    url: 'app/SystemSetup/backend/generalsetting/Time.php',
                    params: {
                        op: 'ntp_setting'
                    },
                    success: function (form, action) {
                        appwindow.hideLoadingMask();
                        var ref = 0,
                            timedate_obj = Ext.ComponentQuery.query('#TimeDate')[0],
                            respText = Ext.util.JSON.decode(form.responseText),
                            msg = action.result.msg;
                        timedate_obj.getViewModel().getStore('ntp').reload();
                        timedate_obj.getViewModel().getStore('sysTime').reload();
                        appwindow.getresponse(ref, 'Time');
                    },
                    failure: function (form, action) {
                        appwindow.hideLoadingMask();
                        var ref = action.result.msg,
                            timedate_obj = Ext.ComponentQuery.query('#TimeDate')[0];
                        appwindow.getresponse(ref, 'Time');
                        // Ext.MessageBox.alert('Failed', ref);
                        timedate_obj.getViewModel().getStore('ntp').reload();
                        timedate_obj.getViewModel().getStore('sysTime').reload();
                    }
                });
            } else {
                form.submit({
                    url: 'app/SystemSetup/backend/generalsetting/Time.php',
                    params: {
                        op: 'time_setting'
                    },
                    success: function (form, action) {
                        appwindow.hideLoadingMask();
                        var ref = 0,
                            timedate_obj = Ext.ComponentQuery.query('#TimeDate')[0];
                        appwindow.getresponse(ref, 'Time');
                        timedate_obj.getViewModel().getStore('ntp').reload();
                        timedate_obj.getViewModel().getStore('sysTime').reload();
                    },
                    failure: function (form, action) {
                        appwindow.hideLoadingMask();
                        var ref = action.result.msg,
                            timedate_obj = Ext.ComponentQuery.query('#TimeDate')[0];
                        appwindow.getresponse(ref, 'Time');
                        timedate_obj.getViewModel().getStore('ntp').reload();
                        timedate_obj.getViewModel().getStore('sysTime').reload();
                    }
                });
            }
        } else { // display error alert if the data is invalid
            appwindow.hideLoadingMask();
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    }
});
