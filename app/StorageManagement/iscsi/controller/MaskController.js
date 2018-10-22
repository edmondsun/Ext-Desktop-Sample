Ext.define('DESKTOP.StorageManagement.iscsi.controller.MaskController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.masksetting',
    requires: [
    ],
    init: function () {
        var me       = this;
        var mainView = Ext.ComponentQuery.query('#maskView')[0];

        mainView.down('#mask_btn_cancel').on('click',  me.onCancel,  me);
        mainView.down('#mask_btn_confirm').on('click', me.onConfirm, me);

        switch(me.view.action) {
        case 'Add':
            break;

        case 'Edit':
            if (me.view.policy.toLowerCase().indexOf('default') != -1) {
                mainView.down('#policy_name').setDisabled(true);
                mainView.down('#init_iqn').setDisabled(true);               
            }
        	mainView.down('#policy_name').setValue(me.view.policy);
        	mainView.down('#init_iqn').setValue(me.view.iqn);
            mainView.down('#read_mask').setValue(me.view.lun_ro);
            mainView.down('#read_write_mask').setValue(me.view.lun_rw);
            mainView.down('#deny_mask').setValue(me.view.lun_deny);
            mainView.down('#mask_status_rw').setValue(me.view.lun_perm);
            break;

        default:
            break;
        }
    },
    onCancel: function () {
        Ext.ComponentQuery.query('#generalMaskView')[0].close();
    },
    onConfirm: function () {
        var me        = this;
        var mainView  = Ext.ComponentQuery.query('#generalMaskView')[0];
        var info      = [];
        var upmap     = Ext.data.StoreManager.lookup('unmappedLun');
        var setupView = Ext.ComponentQuery.query('#Setup')[0];
        var lun       = setupView.down('#target_name').getSelectionModel().getSelection()[0];

        info['perm']      = mainView.down('#mask_status_rw').value;
        info['target_id'] = lun.get('target_id');
        info['lun_id']    = lun.get('lun_id');
        info['pool_name'] = lun.get('pool_name');
        info['lun_name']  = lun.get('lun_name');

        switch(me.view.action) {
        case 'Add':
            info['policy'] = me.view.policy ? me.view.policy : mainView.down('#policy_name').value;
            info['iqn']    = me.view.policy ? me.view.policy : mainView.down('#init_iqn').value;
            me.addMask(info);
            break;

        case 'Edit':
            info['policy']     = me.view.policy;    
            info['new_policy'] = mainView.down('#policy_name').value;
            info['iqn']        = mainView.down('#init_iqn').value;
            me.editMask(info);
            break;    
        }

    },
    onBeforeChange: function(el, checked) {
        var mainView = Ext.ComponentQuery.query('#generalMaskView')[0];
        var att = ['read_mask', 'read_write_mask', 'deny_mask'];

        if (mainView === undefined) {
            return;
        }

        if (checked) {
            for (var i=0; i < att.length; i++) {
                if(att[i] == el.itemId) {
                    continue;
                }
                mainView.down('#' + att[i]).setValue(0);
            }
        }

        if (el.itemId == att[1]) {
            mainView.down('#mask_status_rw').value = 'rw';
        }else if (el.itemId == att[0]) {
            mainView.down('#mask_status_rw').value = 'ro';
        }else if (el.itemId == att[2]) {
            mainView.down('#mask_status_rw').value = 'deny';
        }
    },
    addMask: function(info) {
        var mainView  = Ext.ComponentQuery.query('#generalMaskView')[0];
        var setupView = Ext.ComponentQuery.query('#Setup')[0];
        var mask = new Ext.LoadMask({
            msg: 'Waiting...',
            target: mainView
        });

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
            method: 'POST',
            params: {
                op          : 'add_lun_mask_policy',
                target_id   : info['target_id'],
                lun_id      : info['lun_id'],
                pool        : info['pool_name'],
                lun         : info['lun_name'],
                policy_name : info['policy'],
                host        : info['iqn'],
                perm        : info['perm']
            },
            waitMsg: 'Please Wait',
            success: function (response) {
                setupView.getViewModel('iscsisetup').getStore('targetTree').load();
                
                mask.destroy();
                var respText = Ext.util.JSON.decode(response.responseText),
                    msg = respText.msg;
                if (msg !== '') {
                    Ext.MessageBox.alert('<center>Success</center>', msg);
                } else {
                    Ext.MessageBox.alert('<center>Success</center>', "<center>Lun Mask Success</center>");
                }
                mainView.close();
            },
            failure: function (response) {

                mask.destroy();
                var respText = Ext.util.JSON.decode(response.responseText),
                    msg = respText.msg;
                Ext.MessageBox.alert('<center>Failed</center>', msg);
            }
        });
    },
    editMask: function(info) {
        var mainView  = Ext.ComponentQuery.query('#generalMaskView')[0];
        var setupView = Ext.ComponentQuery.query('#Setup')[0];
        var mask = new Ext.LoadMask({
            msg: 'Waiting...',
            target: mainView
        });

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
            method: 'POST',
            params: {
                op              : 'edit_lun_mask_policy',
                target_id       : info['target_id'],
                lun_id          : info['lun_id'],
                policy_name     : info['policy'],
                new_policy_name : info['new_policy'],
                host            : info['iqn'],
                perm            : info['perm']
            },
            waitMsg: 'Please Wait',
            success: function (response) {
                setupView.getViewModel('iscsisetup').getStore('targetTree').load();
                mask.destroy();
                var respText = Ext.util.JSON.decode(response.responseText),
                    msg = respText.msg;
                if (msg !== '') {
                    Ext.MessageBox.alert('<center>Success</center>', msg);
                } else {
                    Ext.MessageBox.alert('<center>Success</center>', "<center>Lun Mask Success</center>");
                }
                mainView.close();
            },
            failure: function (response) {

                mask.destroy();
                var respText = Ext.util.JSON.decode(response.responseText),
                    msg = respText.msg;
                Ext.MessageBox.alert('<center>Failed</center>', msg);
            }
        });        
    }
});

