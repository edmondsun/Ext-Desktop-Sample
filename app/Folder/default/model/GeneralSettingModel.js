Ext.define('DESKTOP.Folder.default.model.GeneralSettingModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.foldergeneralsetting',
    requires: ['DESKTOP.Folder.default.controller.GeneralSettingController'],
    stores: {
        aclsettings: {
            fields: [
                'enable_adv_acl',
                'enable_win_acl'
            ],
            autoLoad: true,
            proxy: {
                type  : 'ajax',
                method: 'GET',
                url   : 'app/Folder/backend/default/GeneralSetting.php',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    rootProperty: 'data'
                }
            },
            listeners: {
                load: function(store, records) {
                    form = Ext.ComponentQuery.query('#GeneralSetting')[0],
                    form.loadRecord(records[0]);
                }
            }
        }
    }
});
