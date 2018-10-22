Ext.define('DESKTOP.StorageManagement.pool.view.Unlock', {
    extend: 'Ext.window.Window',
    modal:true,
    width: 600,
    height: 400,
    bodyPadding: 20,
    controller: 'pool',
    closeAction: 'destroy',
    title: 'Pool unlock',
    itemId: 'unlock',
    dockedItems: [{
        xtype: 'toolbar',
        qDefault: true,
        dock: 'bottom',
        items: ['->', {
            xtype: 'button',
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
            text: 'Confirm',
            listeners: {
                click: 'onUnlockConfirm'
            }
        }]
    }],
    items: [{
        xtype: 'form',
        qDefault: true,
        width: '100%',
        // height: 400,
        fieldDefaults: {
            labelWidth: 150,
            msgTarget: 'qtip'
        },
        waitMsgTarget: true,
        items: [{
            xtype: 'label',
            qDefault: true,
            itemId: 'pool_name'
        }, {
            xtype: 'container',
            qDefault: true,
            layout: 'hbox',
            items: [{
                xtype: 'radio',
                qDefault: true,
                boxLabel: 'Enter password',
                name: 'key',
                checked: true,
                listeners: {
                    change: function(radio, isChecked) {
                        var tf = radio.up('container').next('textfield');
                        if (isChecked) {
                            tf.enable();
                            tf.show();
                        } else {
                            tf.disable();
                            tf.hide();
                        }
                    }
                }
            }, {
                xtype: 'radio',
                qDefault: true,
                boxLabel: 'Import key',
                name: 'key',
                listeners: {
                    change: function(radio, isChecked) {
                        var tb = radio.up('container').next('toolbar');
                        if (isChecked) {
                            tb.enable();
                            tb.show();
                        } else {
                            tb.disable();
                            tb.hide();
                        }
                    }
                }
            }]
        }, {
            xtype: 'textfield',
            qDefault: true,
            fieldLabel: 'Enter encrypt password',
            inputType: 'password',
            name: 'password',
            allowBlank: false,
            validateOnChange: false,
            regex: /^[a-zA-Z0-9!@#$%^&*()_+=?]{8,16}$/,
            regexText: 'Format Error'
        }, {
            xtype: 'toolbar',
            qDefault: true,
            disabled: true,
            items: [{
                xtype: 'filefield',
                qDefault: true,
                name: 'key_file',
                //width : 300,
                allowBlank: false,
                buttonText: 'Browse...'
            }]
        }]
    }]
});
