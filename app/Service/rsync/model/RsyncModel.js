    Ext.define('DESKTOP.Service.rsync.model.RsyncModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.rsync',
    data: {
        rsync_data   : null,
        account_data : null
    },
    stores: {
        rsync_account: {
            storeId: 'rsync_account',
            ori_rsync_data: null,
            ori_account_data: null,
            fields: [''],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/Service/backend/rsync/Rsync.php',
                method: 'GET',
                extraParams: {
                    op: 'rsync+account'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var form            = Ext.ComponentQuery.query('#Rsync')[0];
                        var tmpArr          = [];
                        var rsync_account   = Ext.data.StoreManager.lookup('rsync_account');
                        var rsync           = Ext.data.StoreManager.lookup('rsync');
                        var account         = Ext.data.StoreManager.lookup('account');

                        for (var i=0; i < records.length; i++) {

                            switch (records[i].get('class')) {
                            case 'rsync':    
                                form.getViewModel().set('rsync_data', records[i].data.data);
                                rsync_account.ori_rsync_data = Ext.clone(records[i].data.data);
                                break;

                            case 'account':
                                form.getViewModel().set('account_data', records[i].data.data);
                                rsync_account.ori_account_data = Ext.clone(records[i].data.data);
                                form.getController().onAccountTypeSelect();
                                break;    

                            default:
                                break;    
                            }
                        }
                    }
                }
            }
        }
    }
});
