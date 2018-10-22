Ext.define('DESKTOP.StorageManagement.iscsi.view.Masking', {
    extend: 'Ext.form.Panel',
    requires: [
        'DESKTOP.StorageManagement.iscsi.controller.MaskController'
    ],
    controller: 'masksetting',
    alias: 'widget.maskview',
    itemId: 'maskView',
    items: [{
        itemId: 'select_mask',
        xtype: 'form',
        bodyPadding: '5 10 10 10',
        fieldDefaults: {
            labelWidth: 150,
            msgTarget: 'qtip'
        },        
        items: [{
            xtype: 'textfield',
            layout: {
                type: 'table',
                columns: 2,
                tdAttrs: {
                    width: 400
                }
            },
            itemId: 'policy_name',
            fieldLabel: 'Policy Name',
            name: 'policy_name',
            allowBlank: false,
            msgTarget: 'qtip',
            maskRe: /^[a-zA-Z0-9-_.]+$/,
            regexText: 'Name contains characters which are not allowed.'
        }, {
            xtype: 'textfield',
            layout: {
                type: 'table',
                columns: 2,
                tdAttrs: {
                    width: 400
                }
            },
            itemId: 'init_iqn',
            fieldLabel: 'Initiator IQN',
            name: 'initiator_iqn',
            allowBlank: false,
            msgTarget: 'qtip',
            maskRe: /^[a-zA-Z0-9-_.]+$/,
            regexText: 'Name contains characters which are not allowed.'
        }, {
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'checkboxgroup',
                itemId: 'notify_type',
                defaults: {
                    width: 120
                },
                inputValue: 1,
                uncheckedValue: 0,
                items: [{
                    itemId: 'read_mask',
                    boxLabel: 'Read Only',
                    name: 'ro',
                    inputValue: 1,
                    uncheckedValue: 0,
                    handler: 'onBeforeChange'
                }, {
                    itemId: 'read_write_mask',
                    boxLabel: 'Read/Write',
                    name: 'rw',
                    inputValue: 1,
                    uncheckedValue: 0,
                    handler: 'onBeforeChange'
                }, {
                    itemId: 'deny_mask',
                    boxLabel: 'Deny Access',
                    name: 'deny',
                    inputValue: 1,
                    uncheckedValue: 0,
                    handler: 'onBeforeChange'
                },{
                    itemId: 'mask_status_rw',
                    hidden: true
                }]
            }]
        }]
    }, {
        itemId: 'mask_btn',
        reference: 'mask_btn',
        buttons: [{
            itemId: 'mask_btn_cancel',
            text: 'Cancel'
        }, {
            itemId: 'mask_btn_confirm',
            text: 'Confirm'
        }]
    }]
});

