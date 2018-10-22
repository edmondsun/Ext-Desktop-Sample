Ext.define('DESKTOP.StorageManagement.iscsi.view.Delete', {
    extend: 'Ext.form.Panel',
    requires: [
        'DESKTOP.StorageManagement.iscsi.controller.DeleteController'
    ],
    controller: 'deletesetting',
    alias: 'widget.deleteview',
    itemId: 'deleteView',
    items: [{
        xtype: 'form',
        itemId: 'select_delete',
        border: false,
        padding: '5 5 5 5',
        layout: 'vbox',
        items: [{
           xtype: 'container',
           customLayout: 'hlayout', 
           items: [{
                itemId: 'delete_msg',
                xtype: 'displayfield',
                textAlign: 'center'
           }]
        }, {
            itemId: 'delete_policy_name',
            xtype: 'displayfield',
            itemId: 'policy_name',
            textAlign: 'center',
            fieldLabel: 'Policy Name'
        }, {
            itemId: 'delete_init_iqn',
            xtype: 'displayfield',
            itemId: 'init_iqn',
            textAlign: 'center',
            fieldLabel: 'Initiator IQN'
        }]
    }, {
        itemId: 'del_btn',
        reference: 'del_btn',
        buttons: [{
            itemId: 'del_btn_cancel',
            text: 'Cancel'
        }, {
            itemId: 'del_btn_confirm',
            text: 'Confirm'
        }]
    }]
});

