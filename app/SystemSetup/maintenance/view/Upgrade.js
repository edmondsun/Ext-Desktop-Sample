Ext.define('DESKTOP.SystemSetup.maintenance.view.Upgrade', {
    extend: 'Ext.form.Panel',
    alias: 'widget.upgrade',
    requires: [
        'DESKTOP.SystemSetup.maintenance.controller.UpgradeController'
    ],
    controller: 'upgrade',
    itemId: 'Upgrade',
    title: "System Upgrade",
    frame: true,
    collapsible: true,
    waitMsgTarget: true,
    fieldDefaults: {
        msgTarget: 'qtip'
    },
    trackResetOnLoad: true,
    items: [{
        xtype: 'container',
        qDefault: true,
        customLayout: 'vlayout',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                labelFontColor: 'title',
                labelFontWeight: 'bold',
                text: 'Firmware Upgrade'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            // customLayout: 'hlayout',
            width: '100%',
            // height:'auto',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'To upgrade the internal device ﬁrmware, ' +
                    'browse to the location of the binary (.bin) upgrade ﬁle and click \"upgrade\". ' +
                    'Upgrade ﬁle can be download from website. ' +
                    'If the upgrade ﬁle is compressed (.zip), ' +
                    'you must ﬁrst extract the binary (.bin) ﬁle. ' +
                    'In some cases, you may need to reconﬁgure.'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'splitter'
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'filefield',
                qDefault: true,
                itemId: 'file_name',
                customType: 'file',
                name: 'upgrade_file',
                allowBlank: false,
                buttonText: ''
            }, {
                xtype: 'button',
                qDefault: true,
                text: 'Upgrade',
                handler: 'upgradeFile'
            }]
        }]
    }]
});
