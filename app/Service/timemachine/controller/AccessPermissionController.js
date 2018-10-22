Ext.define('DESKTOP.Service.timemachine.controller.AccessPermissionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.accesspermission',
    init: function () {
    },
    onBeforePermChange: function(checkBox, rowIndex, checked) {
    	var me          = this;
        var record      = me.getStore('permAll').getAt(rowIndex);
        var form        = Ext.ComponentQuery.query('#AccessPermission')[0];
        var accountData = form.getViewModel().get('account_data');
        var userType    = form.down('#time_machine_access_type').getValue();
        var checkValue  = (checked == true) ? 1 : 0;
        accountData[userType][rowIndex].perm = checkValue;
        record.set('perm', checked);
    },
    onAccountTypeSelect: function (combo_handle, record) {
        var items;
        var target;
        var select       = combo_handle ? combo_handle.getValue() : 'user';
        var form         = Ext.ComponentQuery.query('#AccessPermission')[0];
        var accountData  = form.getViewModel().get('account_data');
        var permAll      = Ext.data.StoreManager.lookup('permAll');

        switch (select) {
        case 'user':
            target = accountData.user;
            items  = permAll.ori_account_data.user;
            break;
        case 'domain_user':
            target = accountData.domain_user;
            items  = permAll.ori_account_data.domain_user;
            break;        
        }

        permAll.loadData(items);
    },
    dirtycheck: function () {
    	var flag;
    	var me             = this;
    	var form           = Ext.ComponentQuery.query('#AccessPermission')[0];
    	var access_account = Ext.data.StoreManager.lookup('access_account');
    	var account        = form.getViewModel().get('account_data');

    	me.differ(account, access_account.ori_account_data);

    	return form.getViewModel().get('compare_data')['flag'];
    },
    differ: function (objA, objB) {
    	var objC            = {};
    	var diff_user_Arr   = [];
    	var diff_domain_Arr = [];
    	var diffFlag        = false;
    	var form            = Ext.ComponentQuery.query('#AccessPermission')[0];

		for (var i in objA) {
			if (!objA.hasOwnProperty(i) || !objB.hasOwnProperty(i)) {
				continue;
			}

			for (var j in objA[i]) {
				if (!objA[i][j].hasOwnProperty('perm')) {
					continue;
				}

				switch (i) {
				case 'user':
					if (objA[i][j].perm != objB[i][j].perm) {
						diffFlag = true;
						diff_user_Arr.push(objA[i][j]);
					}
					break;
				case 'domain_user':		
					if (objA[i][j].perm != objB[i][j].perm) {
						diffFlag = true;
						diff_domain_Arr.push(objA[i][j]);
					}
					break;
				default:
					break;
				}
			}
	  		
		}

		objC = {
			flag   : diffFlag,
			user   : diff_user_Arr,
			domain : diff_domain_Arr
		};

		form.getViewModel().set('compare_data', objC);
    },
    onSearch: function (field) {
    	var permAll = Ext.data.StoreManager.lookup('permAll');
        var filter  = field.getValue();

        permAll.clearFilter();

        permAll.filterBy(function (val) {
            var share_name = val.get('name');
            return (share_name.search(filter) !== -1);
        });
    },
    on_Apply_All: function (form, me) {
    	var appwindow  = me;
        var self       = this;
        var parameter  = {};
        var user_arr   = [];
        var domain_arr = [];
        var mainView   = Ext.ComponentQuery.query('#AccessPermission')[0];	
        var form       = mainView.down('form').getForm();
        var account    = mainView.getViewModel().get('account_data');
       
        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }
        
        	
    	for (var i=0; i < account.user.length; i++) {
    		if (account.user[i].perm.toString() == '0') {
    			continue;
    		}
    		user_arr.push(account.user[i]);
    	}

    	for (var j=0; j < account.domain_user.length; j++) {
    		if (account.domain_user[j].perm.toString() == '0') {
    			continue;
    		}
    		domain_arr.push(account.domain_user[j]);
    	}

        parameter.op          = 'afp_access_perm_write';
        parameter.user        = Ext.JSON.encode(user_arr);
        parameter.domain_user = Ext.JSON.encode(domain_arr);
       	
        appwindow.showLoadingMask();
        
        form.submit({
            url: 'app/Service/backend/timemachine/TimeMachine.php',
            method: 'POST',
            params: parameter,
            success: function (form, action) {
                appwindow.hideLoadingMask();

                if (Ext.JSON.decode(action.response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'AccessPermission');
                }
            },
            failure: function (form, action) {
                appwindow.hideLoadingMask();
                var msg = (Ext.JSON.decode(action.response.responseText)).msg;
                var ref = msg;
                appwindow.getresponse(ref, 'AccessPermission');
            }
        });    	
    }
});
