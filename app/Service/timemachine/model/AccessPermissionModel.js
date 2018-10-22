Ext.define('DESKTOP.Service.timemachine.model.AccessPermissionModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.accesspermission',
    data: {
    	compare_data : null,
        account_data : null
    },
    stores: {
        access_account: {
            storeId: 'access_account',
            ori_account_data: null,
            fields: [''],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/Service/backend/timemachine/TimeMachine.php',
                method: 'GET',
                extraParams: {
                    op: 'afp_access_perm_read'
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
                        var form           = Ext.ComponentQuery.query('#AccessPermission')[0];
                        var permAll        = Ext.data.StoreManager.lookup('permAll');
                        var access_account = Ext.data.StoreManager.lookup('access_account');

						form.getViewModel().set('account_data', records[0].data);
						access_account.ori_account_data = Ext.clone(records[0].data);
						permAll.ori_account_data        = Ext.clone(records[0].data);
						form.getController().onAccountTypeSelect();

                    }
                }
            }
        },
        permAll: {
            storeId: 'permAll',
            ori_account_data: null,
            cnt: 0,
            fields:[
                'name',
                'perm',
                {
                    name: 'access',
	                type: 'bool',
	                calculate: function(data) {
	                    return (data.perm == 1) ? true : false;
	                }
                },
                {
                    name: 'indx',
                    calculate: function(data, val) {
                        var permAll = Ext.data.StoreManager.lookup('permAll');
                        var cnt     = permAll.config.cnt;

                        permAll.setConfig({'cnt' : ++cnt})
                        return cnt;
                    }
                }
            ],
            proxy: {
                type: 'localstorage'
            }
        }
    }
});
