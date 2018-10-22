Ext.define('DESKTOP.Folder.default.view.GeneralSetting', {
    extend: 'Ext.form.Panel',
    alias: 'widget.foldergeneralsetting',
    requires: [
        'DESKTOP.Folder.default.model.GeneralSettingModel',
        'DESKTOP.Folder.default.controller.GeneralSettingController'
    ],
    controller: 'foldergeneralsetting',
    viewModel: {
        type: 'foldergeneralsetting'
    },
    itemId: 'GeneralSetting',
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    fieldDefaults: {
        labelWidth: 150,
        msgTarget: 'side'
    },
    items: [
    {
        xtype: 'container',
        customLayout: 'vlayout',
        items: [{
            xtype: 'checkboxfield',
            name: 'enable_adv_acl',
            reference: 'adv_checkbox',
            boxLabel: 'Enable advanced folder permissions',
            inputValue: 1,
            uncheckedValue: 0,
            labelFontColor: 'title',
            labelFontWeight: 'bold'
        }, {
            xtype: 'label',
            width: '100%',
            indentLevel: 1,
            text: 'When this option is enabled, you can assign the folders and subfolders\' permission to individual users and user groups by click here.'
        },{
            xtype:'container',
            customLayout:'splitter'
        },{
            xtype: 'checkboxfield',
            name: 'enable_win_acl',
            reference: 'win_checkbox',
            inputValue: 1,
            uncheckedValue: 0,
            boxLabel: 'Enable Windows ACL Support',
            labelFontColor: 'title',
            labelFontWeight: 'bold'
        }, {
            xtype: 'label',
            width: '100%',
            indentLevel: 1,
            text: 'When Windows ACL support is enabled, the folders and subfolders\' permission can only be edited from Windows File Explore.'
        }]
    }]
});
