Ext.define('DESKTOP.SystemSetup.performance.controller.PerformanceController', {
    extend: 'Ext.app.ViewController',
    requires: [],
    alias: 'controller.performance',
    on_Apply_All: function (form, me) {
        var appwindow = me;

        if (form.isValid()) { // make sure the form contains valid data before submitting
            appwindow.showLoadingMask();
            form.submit({
                url: 'app/SystemSetup/backend/performance/performance_tuning.php',
                params: {
                    op: 'set_mode'
                },
                success: function (form, action) {
                    var ref = 0;
                    appwindow.hideLoadingMask();
                    appwindow.getresponse(ref, 'Performance');
                    Ext.ComponentQuery.query('#Performance')[0].getViewModel().getStore('performance').reload();
                },
                failure: function (form, action) {
                    var ref = action.result.msg;
                    appwindow.hideLoadingMask();
                    appwindow.getresponse(ref, 'Performance');
                    Ext.ComponentQuery.query('#Performance')[0].getViewModel().getStore('performance').reload();
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    }
});
