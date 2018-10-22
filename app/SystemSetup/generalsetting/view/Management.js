Ext.define('DESKTOP.SystemSetup.generalsetting.view.Management', {
    /* Design UI layout*/
    extend: 'Ext.form.Panel',
    alias: 'widget.management',
    requires: [
        'DESKTOP.SystemSetup.generalsetting.controller.ManagementController',
        'DESKTOP.SystemSetup.generalsetting.model.ManagementModel'
    ],
    controller: 'management',
    viewModel: {
        type: 'management'
    },
    itemId: 'Management',
    title: "Management",
    frame: true,
    // width: 'auto',
    //bodyPadding: 10,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    width: 750,
    // fieldDefaults: {
    //     labelWidth: 200,
    //     msgTarget: 'qtip'
    // },
    defaultType: 'textfield',
    trackResetOnLoad: true,
    items: [{
        xtype: 'container',
        customLayout: 'vlayout',
        qDefault: true,
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'checkboxfield',
                qDefault: true,
                qLanguage: {
                    "boxLabel": {
                        "str": "QCentral management",
                        "key": "QCENTRAL_MANAGEMENT"
                    }
                },
                name: 'qcentral_status',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                inputValue: 1,
                uncheckedValue: 0,
                boxLabel: 'QCentral management'
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
                        "str": "If QCentral management is enable, the system can be managed from QCentral application.",
                        "key": "QCENTRAL_MANAGEMENT_DESC"
                    }
                },
                indentLevel: 1,
                text: 'If QCentral management is enable, the system can be managed from QCentral application.'
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
                qLanguage: {
                    "text": {
                        "str": "Web management timeout",
                        "key": "WEB_MANAGEMENT_TIMEOUT"
                    }
                },
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                text: 'Web management timeout'
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
                        "str": "If logout time is set, the will logout automatically when user is inactive for a period of time.",
                        "key": "WEB_MANAGEMENT_TIMEOUT_DESC"
                    }
                },
                text: 'If logout time is set, the will logout automatically when user is inactive for a period of time.'
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
                        "str": "Auto logout",
                        "key": "AUTO_LOGOUT"
                    }
                },
                name: 'idle_timeout_setting',
                inputValue: 'on',
                uncheckedValue: 'off',
                boxLabel: 'Auto logout',
                listeners: {
                    change: function (checkbox, newValue, oldvalue, eOpts) {
                        var combo = checkbox.up('form').down('#combo_able');
                        if (newValue) {
                            combo.enable();
                        } else {
                            combo.disable();
                        }
                    }
                }
            }, {
                xtype: 'combobox',
                qDefault: true,
                itemId: 'combo_able',
                qLanguage: {
                    "emptyText": {
                        "str": "Disable",
                        "key": "DISABLE"
                    }
                },
                fieldLabel: '',
                name: 'idle_timeout',
                disabled: true,
                emptyText: 'Disable',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['logout_value', 'logout_str', 'qLanguage.logout_str'],
                    data: [{
                        "logout_value": 300,
                        "logout_str": qLanguageDisplay("5_MINUTES", "5 minutes"),
                        "qLanguage.logout_str": "5_MINUTES"
                    }, {
                        "logout_value": 600,
                        "logout_str": qLanguageDisplay("10_MINUTES", "10 minutes"),
                        "qLanguage.logout_str": "10_MINUTES"
                    }, {
                        "logout_value": 900,
                        "logout_str": qLanguageDisplay("15_MINUTES", "15 minutes"),
                        "qLanguage.logout_str": "15_MINUTES"
                    }, {
                        "logout_value": 1800,
                        "logout_str": qLanguageDisplay("30_MINUTES", "30 minutes"),
                        "qLanguage.logout_str": "30_MINUTES"
                    }, {
                        "logout_value": 3600,
                        "logout_str": qLanguageDisplay("60_MINUTES", "60 minutes"),
                        "qLanguage.logout_str": "60_MINUTES"
                    }]
                }),
                valueField: 'logout_value',
                displayField: 'logout_str',
                queryMode: 'local',
                qLanguageStore: true,
                qLanguageStoreFn: function (language) {
                    var me = this,
                        currenValue = me.getValue(),
                        qLanguageKey = '';
                    me.getStore().each(function (object) {
                        Ext.Object.each(object.data, function (key, value) {
                            if (typeof object.data['qLanguage.' + key] !== 'undefined') {
                                qLanguageKey = object.data['qLanguage.' + key];
                                object.data['init.' + key] = object.data['init.' + key] || object.data[key];
                                object.data[key] = DESKTOP.config.language[language][qLanguageKey] || object.data['init.' + key];
                            }
                        });
                    });
                    me.getStore().reload();
                    if (currenValue !== null) {
                        me.setValue(currenValue);
                    }
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'checkboxfield',
                qLanguage: {
                    "boxLabel": {
                        "str": "Login lock",
                        "key": "LOGIN_LOCK"
                    }
                },
                name: 'login_lock',
                inputValue: 'enable',
                uncheckedValue: 'disable',
                boxLabel: 'Login lock'
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
                qLanguage: {
                    "text": {
                        "str": "Web management Setting",
                        "key": "WEB_MANAGEMENT_SETTING"
                    }
                },
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                text: 'Web management Setting'
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
                        "str": "Select communication protocol(s) for web service. HTTPS will enable secure connection.",
                        "key": "WEB_MANAGEMENT_SETTING_DESC"
                    }
                },
                text: 'Select communication protocol(s) for web service. HTTPS will enable secure connection.'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'combobox',
                qDefault: true,
                qLanguage: {
                    "emptyText": {
                        "str": "Please select communication protocol(s)",
                        "key": "SELECT_COMMUNICATION_PROTOCOL"
                    }
                },
                itemId: 'lighttpd_option',
                name: 'lighttpd_option',
                emptyText: 'Please select communication protocol(s)',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['lighttpd_option_value', 'lighttpd_option_str', 'qLanguage.lighttpd_option_str'],
                    data: [{
                        "lighttpd_option_value": 0,
                        "lighttpd_option_str": qLanguageDisplay("HTTP_N_HTTPS", "HTTP and HTTPS"),
                        "qLanguage.lighttpd_option_str": "HTTP_N_HTTPS"
                    }, {
                        "lighttpd_option_value": 1,
                        "lighttpd_option_str": qLanguageDisplay("HTTP_ONLY", "HTTP only"),
                        "qLanguage.lighttpd_option_str": "HTTP_ONLY"
                    }, {
                        "lighttpd_option_value": 2,
                        "lighttpd_option_str": qLanguageDisplay("HTTPS_ONLY", "HTTPS only"),
                        "qLanguage.lighttpd_option_str": "HTTPS_ONLY"
                    }]
                }),
                valueField: 'lighttpd_option_value',
                displayField: 'lighttpd_option_str',
                queryMode: 'local',
                qLanguageStore: true,
                qLanguageStoreFn: function (language) {
                    var me = this,
                        currenValue = me.getValue(),
                        qLanguageKey = '';
                    me.getStore().each(function (object) {
                        Ext.Object.each(object.data, function (key, value) {
                            if (typeof object.data['qLanguage.' + key] !== 'undefined') {
                                qLanguageKey = object.data['qLanguage.' + key];
                                object.data['init.' + key] = object.data['init.' + key] || object.data[key];
                                object.data[key] = DESKTOP.config.language[language][qLanguageKey] || object.data['init.' + key];
                            }
                        });
                    });
                    me.getStore().reload();
                    if (currenValue !== null) {
                        me.setValue(currenValue);
                    }
                },
                listeners: {
                    change: function (combobox, newValue) {
                        var http_port_obj = combobox.up('form').down('#http_port'),
                            https_port_obj = combobox.up('form').down('#https_port');
                        switch (newValue) {
                        case 0:
                            http_port_obj.enable();
                            https_port_obj.enable();
                            break;
                        case 1:
                            http_port_obj.enable();
                            https_port_obj.disable();
                            break;
                        case 2:
                            http_port_obj.disable();
                            https_port_obj.enable();
                            break;
                        }
                    }
                }
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
                        "str": "Change the web management port number.",
                        "key": "CHANGE_WEB_MANAGEMENT_PORT_NUMBER"
                    }
                },
                text: 'Change the web management port number.'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            itemId: 'http_port',
            items: [{
                xtype: 'numberfield',
                qDefault: true,
                qLanguage: {
                    "fieldLabel": {
                        "str": "Web management port (HTTP)",
                        "key": "WEB_MANAGEMENT_PORT_HTTP"
                    }
                },
                /*will take it out*/
                // labelWidth: 'auto',
                fieldLabel: 'Web management port (HTTP)',
                itemId: 'http_port',
                name: 'http_port',
                emptyText: '13080',
                minValue: 1,
                maxValue: 65535,
                allowBlank: false,
                msgTarget: 'qtip'
            }, {
                xtype: 'label',
                qDefault: true,
                qLanguage: {
                    "text": {
                        "str": "(Default: 13080 port)",
                        "key": "_DEFAULT_13080_PORT_"
                    }
                },
                text: '(Default: 13080 port)'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            itemId: 'https_port',
            items: [{
                xtype: 'numberfield',
                qDefault: true,
                qLanguage: {
                    "fieldLabel": {
                        "str": "Web management port (HTTPS)",
                        "key": "WEB_MANAGEMENT_PORT_HTTPS"
                    }
                },
                /*will take it out*/
                // labelWidth: 'auto',
                fieldLabel: 'Web management port (HTTPS)',
                itemId: 'https_port',
                name: 'https_port',
                emptyText: '13443',
                minValue: 1,
                maxValue: 65535,
                allowBlank: false,
                msgTarget: 'qtip'
            }, {
                xtype: 'label',
                qDefault: true,
                qLanguage: {
                    "text": {
                        "str": "(Default: 13443 port)",
                        "key": "_DEFAULT_13443_PORT_"
                    }
                },
                text: '(Default: 13443 port)'
            }]
        }]
    }]
});
