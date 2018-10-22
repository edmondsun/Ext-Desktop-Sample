Ext.define('DESKTOP.SystemSetup.generalsetting.model.ManagementModel', {
    /*define data struct*/
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.management',
    stores: {
        management: {
            fields: ["qcentral_status", "idle_timeout_setting", "idle_timeout", "login_lock", "http_port", "https_port", "lighttpd_option"],
            autoLoad: true,
            needOnLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/generalsetting/Management.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var appwindow = Ext.ComponentQuery.query('#appwindow')[0].getController();
                        appwindow.showLoadingMask();
                        if (success) {
                            var record = records[0],
                                form = Ext.ComponentQuery.query('#Management')[0];
                            form.getForm().loadRecord(record);
                            appwindow.hideLoadingMask();
                        } else {
                            appwindow.hideLoadingMask();
                            Ext.Msg.alert('Session expired', 'Login session expired, please login again.');
                        }
                    }
                }
            }
        }
    }
});
