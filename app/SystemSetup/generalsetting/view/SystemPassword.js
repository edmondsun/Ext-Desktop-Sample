Ext.define('DESKTOP.SystemSetup.generalsetting.view.SystemPassword', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    width: 600,
    height: 300,
    requires: [
        'DESKTOP.lib.isIpIn'
    ],
    title: 'Change password',
    items: [{
        xtype: 'form',
        qDefault: true,
        border: false,
        width: 600,
        height: 300,
        fieldDefaults: {
            msgTarget: 'qtip'
        },
        url: 'app/SystemSetup/backend/generalsetting/System.php',
        waitMsgTarget: true,
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'textfield',
                    qDefault: true,
                    itemId: 'new_pwd',
                    fieldLabel: 'New password',
                    labelFontWeight: 'bold',
                    labelFontColor: 'title',
                    name: 'new_password',
                    inputType: 'password',
                    allowBlank: false,
                    maxLength: 16,
                    validator: function (val) {
                        var check = new DESKTOP.lib.isIpIn(),
                            msg = check.verify_char(val);
                        if (msg === 'correct') {
                            return true;
                        } else {
                            return msg;
                        }
                    },
                    listeners: {
                        change: function (field) {
                            var btn_confirm = field.up('window').down('#btn_confirm'),
                                retype_pwd = field.up('window').down('#retype_pwd');
                            if (retype_pwd.isValid() && field.isValid()) {
                                btn_confirm.setDisabled(false);
                            } else {
                                btn_confirm.setDisabled(true);
                            }
                        }
                    }
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                // customLayout: 'hlayout',
                items: [{
                    xtype: 'textfield',
                    qDefault: true,
                    itemId: 'retype_pwd',
                    fieldLabel: 'Retype password',
                    labelFontWeight: 'bold',
                    labelFontColor: 'title',
                    name: 'retype_password',
                    inputType: 'password',
                    allowBlank: false,
                    validator: function (val) {
                        var pwd = Ext.ComponentQuery.query('#new_pwd')[0],
                            check = new DESKTOP.lib.isIpIn(),
                            msg = check.verify_pwd(val, pwd.getValue());
                        if (msg === 'correct') {
                            return true;
                        } else {
                            return msg;
                        }
                    },
                    listeners: {
                        change: function (field) {
                            var btn_confirm = field.up('window').down('#btn_confirm'),
                                pwd = field.up('window').down('#new_pwd');
                            if (field.isValid() && pwd.isValid()) {
                                btn_confirm.setDisabled(false);
                            } else {
                                btn_confirm.setDisabled(true);
                            }
                        }
                    }
                }]
            }]
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        qDefault: true,
        listeners: {
            click: function () {
                this.up('window').close();
            }
        }
    }, {
        text: 'Confirm',
        qDefault: true,
        disabled: true,
        itemId: 'btn_confirm',
        buttonType: 'primary',
        listeners: {
            click: function () {
                var win = this.up('window'),
                    form = win.down('form').getForm();
                if (form.isValid()) { // make sure the form contains valid data before submitting
                    form.submit({
                        params: {
                            op: 'chg_pwd'
                        },
                        waitMsg: 'Saving...',
                        success: function (form, action) {
                            Ext.Msg.alert('Success', action.result.msg, function () {
                                win.close();
                            });
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert('Failed', action.result.msg);
                        }
                    });
                }
            }
        }
    }]
});
