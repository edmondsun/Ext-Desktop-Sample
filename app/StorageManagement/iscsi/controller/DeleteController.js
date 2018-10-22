Ext.define('DESKTOP.StorageManagement.iscsi.controller.DeleteController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.deletesetting',
    requires: [
    ],
    init: function () {
        var me       = this;
        var mainView = Ext.ComponentQuery.query('#deleteView')[0];

        if (me.view.action !== 'Delete') {
            return;
        }

        switch (me.view.mode) {
        case 'UnMap':
            mainView.down('#delete_msg').setConfig({fieldLabel: 'Are you sure to delete the Un-Mapped LUN Masking policy for the initiator ?'});
            break;

        case 'Masking':
            mainView.down('#delete_msg').setConfig({fieldLabel: 'Are you sure to delete the LUN Masking policy for the initiator ?'});
            break;

        default:
            break;
        }
    },
    Cancel: function () {
        Ext.ComponentQuery.query('#deleteView')[0].close();
    },
    Confirm: function () {
        
    }
});

