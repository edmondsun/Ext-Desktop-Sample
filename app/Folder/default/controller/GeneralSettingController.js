Ext.define('DESKTOP.Folder.default.controller.GeneralSettingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.foldergeneralsetting',
    on_Apply_All: function (form, appwindow) {
        var view = this.getView('GeneralSetting');
        if (form.isValid()) {
            form.submit({
                url: 'app/Folder/backend/default/GeneralSetting.php',
                waitMsg: 'Saving...',
                params: {
                    op: 'set_acl_gs'
                },
                success: function (form, action) {
                    appwindow.getresponse(0, 'GeneralSetting');
                    view.getViewModel().getStore('aclsettings').reload();
                },
                failure: function (form, action) {
                    appwindow.getresponse(action.result.msg, 'GeneralSetting');
                    view.getViewModel().getStore('aclsettings').reload();
                }
                /*
                    // if you want to send dirty values only, try below:
                    getParams: function() {
                        var op = 'op=set_acl_gs&';
                        return op.concat(form.getValues(true, true));
                    },
                 */
            });
        }
    }

});
