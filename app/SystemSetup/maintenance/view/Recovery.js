Ext.define('DESKTOP.SystemSetup.maintenance.view.Recovery', {
    extend: 'Ext.form.Panel',
    alias: 'widget.recovery',
    requires: [
        'DESKTOP.SystemSetup.maintenance.controller.RecoveryController'
    ],
    controller: 'recovery',
    itemId: 'Recovery',
    title: "System Recovery",
    frame: true,
    // width: 'auto',
    //bodyPadding : 20,
    collapsible: true,
    waitMsgTarget: true,
    fieldDefaults: {
        //labelWidth : 150,
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
                qDefault: true,
                text: 'Reset to factory default',
                labelFontColor: 'title',
                labelFontWeight: 'bold'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Click \"Reset device\" to clear all user-entered conﬁguration information and return to factory default.'
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
                xtype: 'radiofield',
                qDefault: true,
                name: 'recovery',
                boxLabel: 'Reset to factory default but all local accounts will be reserved.',
                inputValue: 'reserved',
                itemId: 'reserved',
                checked: true
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'radiofield',
                qDefault: true,
                name: 'recovery',
                boxLabel: 'Reset to factory default but all local accounts will be removed.',
                itemId: 'removed',
                inputValue: 'removed'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'button',
                qDefault: true,
                text: 'Reset device',
                listeners: {
                    click: 'doReset'
                }
            }]
        }]
    }]
});
