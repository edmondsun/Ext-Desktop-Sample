Ext.define('DESKTOP.Service.ftp.view.Ftp', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ftp',
    requires: [
        'DESKTOP.Service.ftp.controller.FtpController',
        'DESKTOP.Service.ftp.model.FtpModel'
    ],
    controller: 'ftp',
    viewModel: {
        type: 'ftp'
    },
    itemId: 'Ftp',
    title: "Ftp",
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    bodyPadding: 20,
    fieldDefaults: {
        labelWidth: 170,
        msgTarget: 'side'
    },
    items: [{
        xtype: 'form',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                reference: 'FTP_ENABLE',
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable FTP service',
                itemId: 'ftp_enable',
                name: 'enable',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                inputValue: true,
                uncheckedValue: false
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'textfield',
                    itemId: 'ftp_banner',
                    name: 'login_banner',
                    fieldLabel: 'Login banner',
                    msgTarget: 'qtip',
                    validator: function () {
                        var me = this;
                        var pattern = /["]+|[\\]+/;
                        if (me.getValue() === '') {
                            return true;
                        }
                        if (me.getValue().match(pattern) !== null) {
                            return 'Invalid characters which are not allowed include "\" \\\\"';
                        }
                        return true;
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'ftp_client',
                    name: 'clients',
                    fieldLabel: 'Client',
                    allowBlank: false,
                    msgTarget: 'qtip',                 
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    minValue: 1,
                    maxValue: 4096,
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'ftp_connect',
                    name: 'connections',
                    fieldLabel: 'Connections',
                    allowBlank: false,
                    msgTarget: 'qtip',                 
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    minValue: 1,
                    maxValue: 256,
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'ftp_attempts',
                    name: 'login_attempts',
                    fieldLabel: 'Login attempts',
                    allowBlank: false,
                    msgTarget: 'qtip',                 
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    minValue: 3,
                    maxValue: 32,
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'combobox',
                    itemId: 'ftp_timeout',
                    name: 'timeout',
                    editable: false,
                    fieldLabel: 'Timeout',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['timeout', 'timeout_str', 'qLanguage.logout_str'],
                        data: [{
                            "timeout": 30,
                            "timeout_str": qLanguageDisplay("30_SENCONDS", "30 seconds"),
                            "qLanguage.logout_str": "30_SENCONDS"
                        }, {
                            "timeout": 60,
                            "timeout_str": qLanguageDisplay("1_MINUTES", "1 minutes"),
                            "qLanguage.logout_str": "1_MINUTES"
                        }, {
                            "timeout": 300,
                            "timeout_str": qLanguageDisplay("5_MINUTES", "5 minutes"),
                            "qLanguage.logout_str": "5_MINUTES"
                        }, {
                            "timeout": 600,
                            "timeout_str": qLanguageDisplay("10_MINUTES", "10 minutes"),
                            "qLanguage.logout_str": "10_MINUTES"
                        }, {
                            "timeout": 1800,
                            "timeout_str": qLanguageDisplay("30_MINUTES", "30 minutes"),
                            "qLanguage.logout_str": "30_MINUTES"
                        }]
                    }),
                    valueField: 'timeout',
                    displayField: 'timeout_str',
                    queryMode: 'local',
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'ftp_min_passve_port',
                    name: 'min_passive_port',
                    fieldLabel: 'Minimum passve port',
                    msgTarget: 'qtip',                 
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    minValue: 1024,
                    maxValue: 65535,
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'ftp_max_passve_port',
                    name: 'max_passive_port',
                    fieldLabel: 'Maximum passve port',
                    msgTarget: 'qtip',                 
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    minValue: 1024,
                    maxValue: 65535,
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'ftp_up_bandwidth',
                    name: 'upload_bandwidth',
                    fieldLabel: 'Upload bandwidth (KB/s)',
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'ftp_download_bandwidth',
                    name: 'download_bandwidth',
                    fieldLabel: 'Download bandwidth (KB/s)',
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'ftp_port',
                    name: 'ftp_port',
                    fieldLabel: 'FTP Port',
                    allowBlank: false,
                    msgTarget: 'qtip',                 
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    minValue: 1,
                    maxValue: 65535,
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'sftp_port',
                    name: 'sftp_port',
                    fieldLabel: 'SFTP Port',
                    allowBlank: false,
                    msgTarget: 'qtip',                 
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    minValue: 1,
                    maxValue: 65535,
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!FTP_ENABLE.checked}'
                    }
                }]
            }]
        }]
    }]
});
