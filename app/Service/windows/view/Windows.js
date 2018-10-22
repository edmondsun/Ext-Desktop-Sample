Ext.define('DESKTOP.Service.windows.view.Windows', {
    extend: 'Ext.form.Panel',
    alias: 'widget.windows',
    requires: [
        'DESKTOP.Service.windows.controller.WindowsController',
        'DESKTOP.Service.windows.model.WindowsModel'
    ],
    controller: 'windows',
    viewModel: {
        type: 'windows'
    },
    itemId: 'Windows',
    title: "Windows",
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
                reference: 'CIFS_ENABLE',
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable CIFS service',
                itemId: 'win_cifs_enable',
                name: 'enable',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                inputValue: true,
                uncheckedValue: false
            }]
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                itemId: 'win_des',
                name: 'server_description',
                fieldLabel: 'Server description',
                maxLength: 32,
                bind: {
                    disabled: '{!CIFS_ENABLE.checked}'
                }
            }]
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                itemId: 'win_group',
                name: 'workgroup',
                fieldLabel: 'Workgroup',
                bind: {
                    disabled: '{!CIFS_ENABLE.checked}'
                },
                validator: function () {
                    var me = this;
                    var regEx = new RegExp(/^(([^\^<>&'*?"':\]\[{}\\/`\|])*)$/);
                    if (me.getValue() === '') {
                        return true;
                    }
                    if (me.getValue().match(regEx) === null) {
                        return 'Invalid characters which are not allowed include "\/:*?\"<>|"';
                    }
                    return true;
                }
            }]
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                itemId: 'win_port',
                name: 'win_port',
                fieldLabel: 'Port number',
                allowBlank: false,
                msgTarget: 'qtip',                 
                maskRe: /^[0-9]*/,
                regex: /^[0-9]*/,
                regexText: 'Invalid number',
                minValue: 1,
                maxValue: 65535,
                bind: {
                    disabled: '{!CIFS_ENABLE.checked}'
                },
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
                }
            }]
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                itemId: 'win_ip_1',
                name: 'win_server_ip1',
                fieldLabel: 'WINS server1 IP address',
                msgTarget: 'qtip',
                maskRe: /[\d\.]/,
                regexText: 'Invalid IP address',
                validateOnChange: false,
                bind: {
                    disabled: '{!CIFS_ENABLE.checked}'
                },
                validator: function () {
                    var form = this.up('form');
                    var check = new DESKTOP.lib.isIpIn();
                    if (check.verify_ip(form.down('#win_ip_1').getValue())) {
                        return true;
                    } else {
                        return this.regexText;
                    }
                }
            }] 
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                itemId: 'win_ip_2',
                name: 'win_server_ip2',
                fieldLabel: 'WINS server2 IP address',
                msgTarget: 'qtip',
                maskRe: /[\d\.]/,
                regexText: 'Invalid IP address',
                validateOnChange: false,
                bind: {
                    disabled: '{!CIFS_ENABLE.checked}'
                },
                validator: function () {
                    var form = this.up('form');
                    var check = new DESKTOP.lib.isIpIn();
                    if (check.verify_ip(form.down('#win_ip_2').getValue())) {
                        return true;
                    } else {
                        return this.regexText;
                    }
                }
            }] 
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable Local master browser',
                itemId: 'win_local_enable',
                name: 'local_master_browser',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                inputValue: true,
                uncheckedValue: false,
                bind: {
                    disabled: '{!CIFS_ENABLE.checked}'
                }
            }]
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable SMB encryption (for SMB 3.0)',
                itemId: 'win_encryption_enable',
                name: 'smb_encrypt',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                inputValue: true,
                uncheckedValue: false,
                bind: {
                    disabled: '{!CIFS_ENABLE.checked}'
                }
            }]
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                indentLevel: 1,
                text: 'Note:'
            },{
               xtype: 'label',
               qDefault: true,
               indentLevel: 2,
               text: 'Using SMB encryption will get performance impact in the encrypted connection.' 
            },{
               xtype: 'label',
               qDefault: true,
               indentLevel: 2,
               text: 'If the client does not support SMB 3.0,'
            },{
               xtype: 'label',
               qDefault: true,
               indentLevel: 2,
               text: 'it will get "Access denied" errors.Disabling SMB encryption Will disable all "Encrypt CIFS data connection".'
            }]
        }]
    }]
});
