Ext.define('DESKTOP.StorageManagement.iscsi.view.GeneralSetting', {
    extend: 'Ext.form.Panel',
    alias: 'widget.iscsigeneralsetting',
    itemId: 'GeneralSetting',
    requires: [
        'DESKTOP.StorageManagement.iscsi.controller.GeneralSettingController',
        'DESKTOP.StorageManagement.iscsi.model.GeneralSettingModel',
        'DESKTOP.lib.isIpIn'
    ],
    controller: 'iscsigeneralsetting',
    viewModel: {
        type: 'iscsigeneralsetting'
    },
    frame: true,
    collapsible: true,
    trackResetOnLoad: true,
    height: 'auto',
    items: [{
        xtype: 'form',
        items: [{
            xtype: 'checkboxfield',
            boxLabel: 'Enable iSCSI target service',
            itemId: 'iscsi_enable',
            name: 'iscsi_enable',
            listeners: {
                change: function (checkbox, newValue) {
                    if (newValue == 1) {
                        checkbox.next('#iscsi_port').enable();
                    } else {
                        checkbox.next('#iscsi_port').disable();
                    }
                }
            },
            bind: '{iscsi_enable}',
            inputValue: 'Yes',
            uncheckedValue: 'No'
        }, {
            xtype: 'textfield',
            itemId: 'iscsi_port',
            labelWidth: 130,
            name: 'iscsi_port',
            fieldLabel: 'iSCSI service port',
            allowBlank: false,
            msgTarget: 'qtip',
            maskRe: /[\d\.]/,
            regex: /[0-9]/,
            maxLength: 6,
            fields: ['data.iscsi_port'],
            bind: {
                value: '{iscsi_port}'
            }
        }, {
            xtype: 'checkboxfield',
            boxLabel: 'Enable iSNS',
            itemId: 'isns_enable',
            name: 'iscsi_enisns_check',
            listeners: {
                change: function (checkbox, newValue) {
                    console.log(newValue);
                    if (newValue == 1) {
                        checkbox.next('#isns_ip').enable();
                    } else {
                        checkbox.next('#isns_ip').disable();
                    }
                }
            },
            bind: '{isns_enable}',
            inputValue: 'Yes',
            uncheckedValue: 'No'
        }, {
            xtype: 'textfield',
            itemId: 'isns_ip',
            disabled: true,
            labelWidth: 130,
            name: 'isns_server',
            fieldLabel: 'iSNS server IP',
            allowBlank: false,
            msgTarget: 'qtip',
            maskRe: /[\d\.]/,
            regexText: 'Must be a numeric IP address',
            validator: function () {
                var check = new DESKTOP.lib.isIpIn();
                if (check.verify_ip(this.getValue())) {
                    return true;
                } else {
                    return this.regexText;
                }
            },
            bind: {
                value: '{isns_server}'
            }
        }]
    }]

});
