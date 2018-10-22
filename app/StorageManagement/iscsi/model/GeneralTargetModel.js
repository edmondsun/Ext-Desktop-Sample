Ext.define('DESKTOP.StorageManagement.iscsi.model.GeneralTargetModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.targetsetting',
    stores: {
    	accountAll: {
            storeId: 'accountAll',
            linux_perms: null,
            current_account: null,
            original_account: null,
            cnt: 0,
            fields: ['name'],
            proxy: {
                type: 'localstorage'
            },
            listeners: {
                load: function(store, records, successful) {
                }
            },
            loadAccounts: function(domainType) {
                var me       = this;
                var trasUser = {
                    'local'  : 'user',
                    'domain' : 'domain_user'
                };
                var type = trasUser[domainType];
                var accountAll = Ext.data.StoreManager.lookup('accountAll');
                this.loadData(me.current_account[type]); 
            }
        },
        accountList: {
            storeId: 'accountList',
            fields: ['user', 'domain_user'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/account/Account.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, successful) {
                    var me         = this;
                    var accountAll = Ext.data.StoreManager.lookup('accountAll');
                    var mainView   = Ext.ComponentQuery.query('#generateTargetView')[0]; 

                    accountAll.current_account  = records[0].data;
                    accountAll.original_account = Ext.clone(records[0].data);
                    mainView.getController().onAccountTypeSelect();
                }
            }
        }
    }
});
