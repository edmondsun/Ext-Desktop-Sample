Ext.define('DESKTOP.StorageManagement.disk.view.SmartTesting', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    closeAction: 'destroy',
    title: 'SMART testing window',
    requires: [
        'DESKTOP.StorageManagement.disk.controller.SmartTestingController',
        'DESKTOP.StorageManagement.disk.model.SmartTestingModel'
    ],
    controller: 'smarttest',
    viewModel: {
        type: 'smarttest'
    },
    modal: true,
    resizable: false,
    width: 500,
    listeners: {
        beforedestroy: function () {
            var pdStore = Ext.data.StoreManager.lookup('pdStore_test');
            if (typeof (pdStore) !== 'undefined') {
                clearInterval(pdStore.enc_status);
            }
        }
    },
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
                text: 'Are you sure to start SMART testing for :'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                itemId: 'sDisk',
                value: ''
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                labelWidth: 200,
                itemId: 'status',
                hidden: true,
                fieldLabel: '',
                value: '',
                bind: {
                    value: '{test_status}'
                },
                listeners: {
                    change: function (me) {
                        if (me.value === "100%") {
                            me.up('window').down('#btnDl').setVisible(true);
                            me.up('window').down('#btnStop').setVisible(false);
                            me.up('window').down('#btnHide').setVisible(false);
                            me.up('window').down('#btnCancel').setVisible(true);
                            me.next('label').setVisible(true);
                            me.setValue('SMART test ok');
                            me.setVisible(false);
                        }
                    }
                }
            }]
        }, {
            xtype: 'label',
            text: 'Download SMART log',
            hidden: true
        }, {
            xtype: 'displayfield',
            qDefault: true,
            itemId: 'testingPdid',
            hidden: true,
            value: ''
        }, {
            xtype: 'displayfield',
            qDefault: true,
            itemId: 'timeoutId',
            hidden: true,
            value: ''
        }]

    }],
    buttons: ['->', {
        text: 'Cancel',
        itemId: 'btnCancel',
        listeners: {
            click: function () {
                this.up('window').close();
            }
        }
    }, {
        text: 'Hide',
        itemId: 'btnHide',
        hidden: true
    }, {
        text: 'Stop',
        itemId: 'btnStop',
        hidden: true,
        listeners: {
            click: 'on_test_stop'
        }
    }, {
        text: 'Test',
        itemId: 'btnTest',
        listeners: {
            click: 'on_test_start'
        }
    }, {
        text: 'Download log',
        itemId: 'btnDl',
        hidden: true,
        listeners: {
            click: 'on_download_smartlog'
        }
    }]
});
