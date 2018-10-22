Ext.define('DESKTOP.StorageManagement.iscsi.view.GeneralWizard', {
    extend: 'Ext.form.Panel',
    requires: [
        'DESKTOP.StorageManagement.iscsi.controller.GeneralWizardController'
    ],
    controller: 'generalwizard',
    alias: 'widget.wizardview',
    itemId: 'wizardView',
    items: [{
        itemId: 'select_target_lun',
        xtype: 'form',
        border: false,
        bodyPadding: '5 10 10 10',
        items: [{
            xtype: 'radio',
            customLayout: 'hlayout',
            boxLabel: 'Create a target and map a LUN',
            name: 'create_target_lun',
            inputValue: 'both',
            checked: true
        }, {
            xtype: 'radio',
            customLayout: 'hlayout',
            boxLabel: 'Create a target',
            name: 'create_target_lun',
            inputValue: 'target'
        }, {
            xtype: 'radio',
            customLayout: 'hlayout',
            boxLabel: 'Create a LUN',
            name: 'create_target_lun',
            inputValue: 'lun'
        }]
    }, {
        hidden: false,
        itemId: 'select_target_lun_btn',
        reference: 'select_target_lun_btn',
        buttons: ['->', {
            itemId: 'btn_cancel',
            text: 'Cancel'
        }, {
            itemId: 'btn_next',
            text: 'Next'
        }]
    }]
});
