Ext.define('DESKTOP.SystemSetup.power.view.PowerManagement', {
    extend: 'Ext.form.Panel',
    alias: 'widget.powermanagement',
    requires: [
        'DESKTOP.SystemSetup.power.controller.PowerManagementController',
        'DESKTOP.SystemSetup.power.model.PowerManagementModel'
    ],
    controller: 'powermanagement',
    viewModel: {
        type: 'powermanagement'
    },
    itemId: 'Management',
    title: 'Power Management',
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    width: 750,
    // fieldDefaults: {
    //     labelWidth: 150,
    //     msgTarget: 'side'
    // },
    items: [{
        xtype: 'container',
        qDefault: true,
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                xtype: 'checkboxfield',
                qDefault: true,
                name: 'auto_shutdown_status',
                inputValue: 1,
                uncheckedValue: 0,
                boxLabel: 'Auto shutdown',
                labelFontColor: 'title',
                labelFontWeight: 'bold'
            }, {
                xtype: 'container',
                qDefault: true,
                width: '100%',
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    indentLevel: 1,
                    value: 'If auto shutdown is enabled, the system will shutdown automatically when the internal power levels or temperature are not with normal levels.'
                }]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'checkboxfield',
                qDefault: true,
                name: 'wol_enable',
                inputValue: 1,
                uncheckedValue: 0,
                boxLabel: 'Wake on Lan',
                labelFontColor: 'title',
                labelFontWeight: 'bold'
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
                xtype: 'label',
                qDefault: true,
                text: 'Recovery',
                labelFontColor: 'title',
                labelFontWeight: 'bold'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            items: [{
                xtype: 'radiogroup',
                qDefault: true,
                layout: 'vbox',
                items: [{
                    boxLabel: 'Resume the server to the previous power-on or power-off status.',
                    name: 'recovery',
                    inputValue: 1
                }, {
                    boxLabel: 'The server should remain off',
                    name: 'recovery',
                    inputValue: 0
                }]
            }]
        }]
    }]
});
