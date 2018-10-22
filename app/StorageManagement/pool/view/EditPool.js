Ext.define('DESKTOP.StorageManagement.pool.view.EditPool', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    modal: true,
    width: 600,
    height: 500,
    bodyPadding: 20,
    closeAction: 'destroy',
    title: 'Edit Pool',
    controller: 'pool',
    itemId: 'editpool',
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
                click: 'onEditPoolConfirm'
            }
        }]
    }],
    items: [{
        xtype: 'form',
        qDefault: true,
        border: false,
        width: 600,
        height: 'auto',
        fieldDefaults: {
            labelWidth: 150,
            msgTarget: 'qtip'
        },
        waitMsgTarget: true,
        defaultType: 'textfield',
        items: [{
            xtype: 'label',
            qDefault: true,
            itemId: 'pool_name'
        }, {
            xtype: 'container',
            qDefault: true,
            items: [{
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable encryption',
                name: 'enable_encrypt',
                itemId: 'enablecb',
                inputValue: true,
                uncheckedValue: false,
                listeners: {
                    change: function(checkbox, isChecked) {
                        var enablectn = checkbox.next('container');
                        var disablectn = enablectn.next('container');
                        if (isChecked) {
                            if (!enablectn.isVisible()) {
                                disablectn.enable();
                            } else {
                                enablectn.enable();
                            }
                        } else {
                            enablectn.disable();
                            disablectn.disable();
                        }
                    }
                }
            }, {
                xtype: 'container',
                qDefault: true,
                itemId: 'enablencrypt',
                //disabled: true,
                items: [{
                    xtype: 'container',
                    qDefault: true,
                    layout: 'hbox',
                    items: [{
                        xtype: 'displayfield',
                        qDefault: true,
                        fieldLabel: 'Encrypt password',
                        value: '******'
                    }, {
                        xtype: 'button',
                        qDefault: true,
                        text: 'Change password',
                        listeners: {
                            click: function(button) {
                                var tf1 = button.up('container').next('textfield');
                                var tf2 = tf1.next('textfield');
                                tf1.enable();
                                tf1.show();
                                tf2.enable();
                                tf2.show();
                            }
                        }
                    }]
                }, {
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'Enter new encrypt password',
                    name: 'password_en',
                    inputType: 'password',
                    allowBlank: false,
                    disabled: true,
                    hidden: true,
                    validateOnChange: false,
                    regex: /^[a-zA-Z0-9!@#$%^&*()_+=?]{8,16}$/,
                    regexText: 'Format Error'
                }, {
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'Re-enter new encrypt password',
                    disabled: true,
                    hidden: true,
                    inputType: 'password',
                    allowBlank: false,
                    validateOnChange: false,
                    regex: /^[a-zA-Z0-9!@#$%^&*()_+=?]{8,16}$/,
                    regexText: 'Format Error',
                    validator: function() {
                        var password = this.up('container').down('textfield');
                        var retypePassword = password.next('textfield');
                        if( new String(password.value).valueOf() !== new String(retypePassword.value).valueOf() ){
                            return 'the input password must be the same as above';
                        }else{
                            return true;
                        }
                    }
                }, {
                    xtype: 'container',
                    qDefault: true,
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        qDefault: true,
                        boxLabel: 'Yes',
                        fieldLabel: 'Auto unlock',
                        name: 'auto_unlock_en',
                        inputValue: true,
                        checked: false,
                        itemId: 'radio_en_y'
                    }, {
                        xtype: 'radio',
                        qDefault: true,
                        boxLabel: 'No',
                        name: 'auto_unlock_en',
                        inputValue: false,
                        itemId: 'radio_en_n'
                    }]
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                disabled: true,
                itemId: 'disablencrypt',
                items: [{
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'Enter encrypt password',
                    name: 'password_dis',
                    inputType: 'password',
                    allowBlank: false,
                    validateOnChange: false,
                    regex: /^[a-zA-Z0-9!@#$%^&*()_+=?]{8,16}$/,
                    regexText: 'Format Error'
                }, {
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'Re-enter encrypt password',
                    inputType: 'password',
                    allowBlank: false,
                    validateOnChange: false,
                    regex: /^[a-zA-Z0-9!@#$%^&*()_+=?]{8,16}$/,
                    regexText: 'Format Error',
                    validator: function() {
                        var password = this.up('container').down('textfield');
                        var retypePassword = password.next('textfield');
                        if( new String(password.value).valueOf() !== new String(retypePassword.value).valueOf() ){
                            return 'the input password must be the same as above';
                        }else{
                            return true;
                        }
                    }
                }, {
                    xtype: 'container',
                    qDefault: true,
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        qDefault: true,
                        boxLabel: 'Yes',
                        fieldLabel: 'Auto unlock',
                        name: 'auto_unlock_dis',
                        inputValue: true
                    }, {
                        xtype: 'radio',
                        qDefault: true,
                        boxLabel: 'No',
                        name: 'auto_unlock_dis',
                        inputValue: false
                    }]
                }]
            }]
        }, {
            xtype: 'checkboxfield',
            qDefault: true,
            boxLabel: 'Enable write cache',
            name: 'pd_prop_write_cache',
            itemId: 'cache',
            inputValue: 1,
            uncheckedValue: 0
        }]
    }]
});
