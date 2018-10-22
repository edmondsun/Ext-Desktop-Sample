Ext.define('DESKTOP.StorageManagement.pool.view.ScrubPool', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    modal: true,
    width: 300,
    height: 150,
    bodyPadding: 20,
    closeAction: 'destroy',
    title: 'Scrub pool',
    controller: 'pool',
    itemId: 'scrubpool',
    dockedItems: [{
        xtype: 'toolbar',
        itemId: 'startScrubToolbar',
        qDefault: true,
        dock: 'bottom',
        hidden: false,
        items: ['->', {
            xtype: 'button',
            itemId: 'cancelScrubBtn',
            qDefault: true,
            text: 'Cancel',
            listeners: {
                click: function() {
                    this.up('window').close();
                }
            }
        }, {
            xtype: 'button',
            qDefault: true,
            text: 'Scrub',
            listeners: {
                click: 'onScrubPoolConfirm'
            }
        }]
    }, {
        xtype: 'toolbar',
        itemId: 'stopScrubToolbar',
        qDefault: true,
        dock: 'bottom',
        hidden: true,
        items: ['->', {
            xtype: 'button',
            qDefault: true,
            text: 'Hide',
            listeners: {
                click: function() {
                    this.up('window').close();
                }
            }
        }, {
            xtype: 'button',
            itemId: 'stopScrubBtn',
            qDefault: true,
            text: 'Stop',
            hidden: false,
            listeners: {
                click: 'onScrubPoolStop'
            }
        }, {
            xtype: 'button',
            itemId: 'closeScrubBtn',
            qDefault: true,
            text: 'Close',
            hidden: true,
            listeners: {
                click: function() {
                    this.up('window').close();
                }
            }
        }]
    }],
    items: [{
        xtype: 'form',
        qDefault: true,
        border: false,
        width: 300,
        height: 'auto',
        fieldDefaults: {
            // labelWidth: 150,
            msgTarget: 'qtip'
        },
        waitMsgTarget: true,
        defaultType: 'textfield',
        items: [{
            xtype: 'displayfield',
            qDefault: true,
            itemId: 'pool_scrub_msg',
            fieldLabel: 'Are you going to scrub',
            value: 'this pool',
            hidden: false
        }, {
            xtype: 'container',
            qDefault: true,
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Pool scrub status:',
                itemId: 'pool_scrub_status',
                value: '10%',
                hidden: true
            }]
        }]
    }]
});
