Ext.define('DESKTOP.SystemSetup.notification.controller.NotificationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.notify',
    on_Apply_All: function (form, me) {
        var appwindow = me;
        if (form.isValid()) { // make sure the form contains valid data before submitting
            form.submit({
                url: 'app/SystemSetup/backend/notification/Notification_center.php',
                params: {
                    op: 'set_notify_center'
                },
                waitMsg: 'Saving...',
                success: function (form, action) {
                    var ref = 0;
                    appwindow.getresponse(ref, 'Notification');
                    Ext.ComponentQuery.query('#Center')[0].getViewModel().getStore('notify').reload();
                },
                failure: function (form, action) {
                    var ref = action.result.msg;
                    appwindow.getresponse(ref, 'Notification');
                    Ext.ComponentQuery.query('#Center')[0].getViewModel().getStore('notify').reload();
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    }
});
