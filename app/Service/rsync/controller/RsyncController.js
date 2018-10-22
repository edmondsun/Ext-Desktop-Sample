Ext.define('DESKTOP.Service.rsync.controller.RsyncController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.rsync',
    init: function() {
    },
    onAccountTypeSelect: function (combo_handle, record) {
        var items;
        var select     = combo_handle ? combo_handle.getValue() : 'user';
        var form       = Ext.ComponentQuery.query('#Rsync')[0];
        var rsync      = form.getViewModel().get('rsync_data');
        var accountAll = form.getViewModel().get('account_data');

        switch (select) {
        case 'user':
            items = accountAll.user;
            break;
        case 'domain':
            items = accountAll.domain_user;
            break;        
        }

        var combo        = form.down('#rsync_account');
        var accountStore = Ext.create('Ext.data.Store', {
                             fields: ['name'],
                             data: items
                           });

        combo.bindStore(accountStore);
        combo.select(rsync.rsync_current_user);
    },
    onRsynSetEnable: function (combo, new_val, old_val, eOpts) {
        var form = Ext.ComponentQuery.query('#Rsync')[0];

        switch (new_val) {
        case true:
            form.down('#rsync_type').enable();
            form.down('#rsync_account').enable();
            break;
        case false:
            form.down('#rsync_type').disable();
            form.down('#rsync_account').disable();
            break;        
        }
    },
    dirtycheck: function () {
        var form          = Ext.ComponentQuery.query('#Rsync')[0];
        var rsync         = form.getViewModel().get('rsync_data');
        var account       = form.getViewModel().get('account_data');
        var rsync_account = Ext.data.StoreManager.lookup('rsync_account');
        var typeCol       = form.down('#rsync_type').value;
        var accountCol    = form.down('#rsync_account').value;
        var accountFlag   = false;

        if (rsync_account.ori_rsync_data.rsync_current_user.toString() == accountCol.toString()) {
            accountFlag = false;
        } else {
            accountFlag = true;
        }

        return !Ext.Object.equals(rsync, rsync_account.ori_rsync_data) || accountFlag;
    },
    on_Apply_All: function (form, me) {
        var mainView      = Ext.ComponentQuery.query('#Rsync')[0];
        var form          = mainView.down('form').getForm();
        var appwindow     = me;
        var self          = this;
        var rsync_account = Ext.data.StoreManager.lookup('rsync_account');
       
        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }
       
        appwindow.showLoadingMask();

        form.submit({
            url: 'app/Service/backend/rsync/Rsync.php',
            method: 'POST',
            params: {
                op: 'rysnc_set'
            },
            success: function (form, action) {
                appwindow.hideLoadingMask();
                rsync_account.load();

                if (Ext.JSON.decode(action.response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'Rsync');
                }
            },
            failure: function (form, action) {
                appwindow.hideLoadingMask();
                var msg = (Ext.JSON.decode(action.response.responseText)).msg;
                var ref = msg;
                appwindow.getresponse(ref, 'Rsync');
            }
        });
    }
});
