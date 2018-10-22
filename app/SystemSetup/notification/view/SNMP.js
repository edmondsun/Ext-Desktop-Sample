Ext.define('DESKTOP.SystemSetup.notification.view.SNMP', {
    extend: 'Ext.form.Panel',
    alias: 'widget.snmp',
    requires: [
        'DESKTOP.SystemSetup.notification.controller.SNMPController',
        'DESKTOP.SystemSetup.notification.model.SNMPModel',
        'DESKTOP.lib.isIpIn'
    ],
    controller: 'snmp',
    viewModel: {
        type: 'snmp'
    },
    itemId: 'Snmp',
    title: "SNMP",
    frame: true,
    //width: 600,
    //bodyPadding: 30,
    url: 'app/SystemSetup/backend/notification/Snmp.php',
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    fieldDefaults: {
        //labelWidth: 200,
        msgTarget: 'side'
    },
    trackResetOnLoad: true,
    items: [{
        xtype: 'container',
        customLayout: 'vlayout',
        items: [{
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                text: 'SNMP',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                text: 'After enabling this service, the NAS will able to report information via SNMP to the managing systems.'
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'checkboxfield',
                boxLabel: 'Enable SNMP service',
                name: 'enable',
                inputValue: 1,
                uncheckedValue: 0
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'numberfield',
                itemId: 'snmp_port_number',
                name: 'port',
                fieldLabel: 'Port number:',
                valueField: 'port-number',
                displayField: 'port_number_str',
                allowBlank: false,
                msgTarget: 'side',
                minValue: 1,
                maxValue: 65535
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                itemId: 'snmp_trap_addr1',
                name: 'manager-ip-1',
                fieldLabel: 'SNMP trap address1:',
                valueField: 'manager-ip-1',
                displayField: 'trap_addr1_str',
                maxLength: 63,
                regexText: 'This field should be DOMAIN NAME or IP ADDRESS.',
                maskRe: /[\d\.]/,
                validateOnChange: false,
                msgTarget: 'side',
                validator: (function () {
                    var check = new DESKTOP.lib.isIpIn();
                    if (check.verify_ip(this.getValue())) {
                        return true;
                    } else {
                        return this.regexText;
                    }
                })
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                itemId: 'snmp_trap_addr2',
                name: 'manager-ip-2',
                fieldLabel: 'SNMP trap address2:',
                valueField: 'manager-ip-2',
                displayField: 'trap_addr2_str',
                maxLength: 63,
                regexText: 'This field should be DOMAIN NAME or IP ADDRESS.',
                maskRe: /[\d\.]/,
                validateOnChange: false,
                msgTarget: 'side',
                validator: (function () {
                    var check = new DESKTOP.lib.isIpIn();
                    if (check.verify_ip(this.getValue())) {
                        return true;
                    } else {
                        return this.regexText;
                    }
                })
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                itemId: 'snmp_trap_addr3',
                name: 'manager-ip-3',
                fieldLabel: 'SNMP trap address3:',
                valueField: 'manager-ip-3',
                displayField: 'trap_addr3_str',
                maxLength: 63,
                regexText: 'This field should be DOMAIN NAME or IP ADDRESS.',
                maskRe: /[\d\.]/,
                validateOnChange: false,
                msgTarget: 'side',
                validator: function () {
                    var check = new DESKTOP.lib.isIpIn();
                    if (check.verify_ip(this.getValue())) {
                        return true;
                    } else {
                        return this.regexText;
                    }
                }
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'combobox',
                fieldLabel: 'SNMP version:',
                itemId: 'snmp_version',
                name: 'version',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['version'],
                    data: [{
                        'version': 'v1v2'
                    }]
                }),
                valueField: 'version',
                displayField: 'version',
                defaultValue: 'v1v2',
                queryMode: 'local'
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'textfield',
                itemId: 'snmp_community',
                name: 'community',
                fieldLabel: 'Community:',
                valueField: 'community',
                displayField: 'community_str'
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'checkboxgroup',
                itemId: 'snmp_type',
                maskOnDisable: true,
                columns: 'auto',
                width: 500,
                items: [{
                    boxLabel: 'Alerts',
                    name: 'info',
                    inputValue: 1,
                    uncheckedValue: 0
                }, {
                    boxLabel: 'Warning',
                    name: 'warning',
                    inputValue: 1,
                    uncheckedValue: 0
                }, {
                    boxLabel: 'Error',
                    name: 'errors',
                    inputValue: 1,
                    uncheckedValue: 0
                }, {
                    boxLabel: 'Backup events',
                    name: 'backup_events',
                    inputValue: 1,
                    uncheckedValue: 0
                }]
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            hidden: true,
            items: [{
                xtype: 'textfield',
                itemId: 'snmp_trap_filter',
                name: 'trap_filter',
                hidden: true
            }]
        }, {
            xtype: 'container',
            customLayout: 'splitter'
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                text: 'SNMP MIB',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                text: 'To install the MIB to your managing systems, click "Download".'
            }, {
                itemId: 'downloadItemId',
                xtype: 'button',
                text: 'Download',
                handler: 'downloadFile'
            }]
        }]
    }]
});
