Ext.define('DESKTOP.SystemSetup.power.controller.PowerManagementController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.powermanagement',

    on_Apply_All: function (form, appWindow) {
        var powerscheduleStore = this.getStore('powerschedule');

        if (form.isValid()) {
            appWindow.showLoadingMask();
            form.submit({
                url: 'app/SystemSetup/backend/power/Management.php',
                params: {
                    op: 'setting'
                },
                success: function (form, action) {
                    appWindow.getresponse(0, 'Management');
                    appWindow.hideLoadingMask();
                    powerscheduleStore.reload();
                },
                failure: function (form, action) {
                    var ref = action.result.msg
                            ? action.result.msg
                            : 'Fail to apply your configuration.';

                    appWindow.getresponse(ref, 'Management');
                    appWindow.hideLoadingMask();
                    powerscheduleStore.reload();
                }
            });
        } else {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    }
});
