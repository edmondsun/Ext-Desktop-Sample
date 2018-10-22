Ext.define('DESKTOP.Service.generalsetting.view.Binding', {
    /* Design UI layout*/
    extend: 'Ext.form.Panel',
    alias: 'widget.binding',
    requires: [
        'DESKTOP.Service.generalsetting.controller.BindingController',
        'DESKTOP.Service.generalsetting.model.BindingModel'
    ],
    controller: 'binding',
    viewModel: {
        type: 'binding'
    },
    itemId: 'Binding',
    title: "System",
    frame: true,
    width: 750,
    url: 'app/SystemSetup/backend/generalsetting/System.php',
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    fieldDefaults: {
        // labelWidth: 150,
        msgTarget: 'qtip'
    },
    defaultType: 'textfield',
    trackResetOnLoad: true,
    listeners: {
        beforedestroy: function () {
            var store = Ext.data.StoreManager.lookup('system_ident');
            clearInterval(store.timeoutId);
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
                xtype: 'textfield',
                qDefault: true,
                qLanguage: {
                    "fieldLabel": {
                        "str": "System name",
                        "key": "SYSTEM_NAME"
                    },
                    "emptyText": {
                        "str": "System name",
                        "key": "SYSTEM_NAME"
                    },
                    "regexText": {
                        "str": "Charaters which are not allowed include Space,Tab and `~!@#$^&*()\\|;:\'\",<>/?",
                        "key": "SYSTEM_NAME_REGEXTEXT"
                    }
                },
                fieldLabel: 'System name',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                name: 'system_name',
                emptyText: 'System name',
                allowBlank: false,
                regex: /^[^`~!@#$^&*()\\|;:'\",<>/?]+$/,
                regexText: 'Charaters which are not allowed include Space,Tab and `~!@#$^&*()\\|;:\'\",<>/?'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                qLanguage: {
                    "fieldLabel": {
                        "str": "Admin password",
                        "key": "ADMIN_PASSWORD"
                    }
                },
                fieldLabel: 'Admin password',
                value: '●●●●●●',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }, {
                xtype: 'button',
                qDefault: true,
                qLanguage: {
                    "text": {
                        "str": "Change Password",
                        "key": "CHANGE_PASSWORD"
                    }
                },
                text: 'Change Password',
                buttonType: 'default',
                listeners: {
                    click: 'onChangePassword'
                }
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
                xtype: 'checkboxfield',
                qDefault: true,
                qLanguage: {
                    "boxLabel": {
                        "str": "Enable buzzer",
                        "key": "ENABLE_BUZZER"
                    }
                },
                name: 'buzzer_status',
                inputValue: 'on',
                uncheckedValue: 'off',
                boxLabel: 'Enable buzzer',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                qLanguage: {
                    "text": {
                        "str": "If buzzer enable, the system will make a sound like buzzing when system is on abnormal status.",
                        "key": "ENABLE_BUZZER_DESC"
                    }
                },
                indentLevel: 1,
                text: 'If buzzer enable, the system will make a sound like buzzing when system is on abnormal status.'
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
                qLanguage: {
                    "text": {
                        "str": "System identifiction",
                        "key": "SYSTEM_IDENTIFICTION"
                    }
                },
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                text: 'System identifiction'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                bind: {
                    qLanguage: '{ident_label}'
                }
            }, {
                xtype: 'button',
                qDefault: true,
                buttonType: 'default',
                bind: {
                    qLanguage: '{ident}'
                },
                listeners: {
                    click: 'start_iden'
                }
            }]
        }]
    }]
});
