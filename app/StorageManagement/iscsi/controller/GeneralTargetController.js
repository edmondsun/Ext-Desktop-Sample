Ext.define('DESKTOP.StorageManagement.iscsi.controller.GeneralTargetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.targetsetting',
    requires: [],
    init: function () {
		var me       = this;
		var mainView = Ext.ComponentQuery.query('#generateTargetView')[0]; 

		if (mainView.hasConfigView != undefined) {
			return;
		}

		var viewSingleBtn = mainView.lookupReference('select_target_btn');
		var viewWizardBtn = mainView.lookupReference('select_winzard_target_btn');

        var en_arr   = [
                         'target_enable_chap_user1',
                         'target_enable_chap_user2',
                         'target_enable_chap_user3'
                       ];
        var chap_arr = [
                         'target_enable_chap_user1_list',
                         'target_enable_chap_user2_list',
                         'target_enable_chap_user3_list'
                       ];

    	switch (me.view.mode) {
    	case "Target":
            if (me.view.action == "Create") {
                mainView.down('#target_iqn').setValue(me.view.iqn);
            } else if (me.view.action == "Edit") {
                mainView.down('#target_name').setValue(me.view.target_name);
                mainView.down('#target_iqn').setValue(me.view.iqn);
                me.edit_chap(me);
            }

			viewSingleBtn.down('#btn_cancel').on('click',  me.onCancel,  me);
	        viewSingleBtn.down('#btn_confirm').on('click', me.onConfirm, me);
	        viewSingleBtn.show();
    		break;	

    	case "Wizard_Target":
            mainView.down('#target_iqn').setValue(me.view.iqn);

    		if (me.view.mix == true) {
    			if (viewWizardBtn !== undefined) {
    				viewWizardBtn.hide();
    			}
    			return;
    		}

    		if (me.view.action == 'Create') {
	            for (var i=0; i < 3; i++) {
	                mainView.down('#' + en_arr[i]).disable();    
	                mainView.down('#' + chap_arr[i]).disable();
	            }

	            mainView.down('#target_mutual_chap').disable();
	            mainView.down('#mutual_user').disable();
	            mainView.down('#mutual_passwd').disable();
    		}

    		viewWizardBtn.down('#btn_winzard_cancel').on('click',  me.onWinzardCancel,  me);
    		viewWizardBtn.down('#btn_winzard_back').on('click',    me.onWinzardBack,    me);
	        viewWizardBtn.down('#btn_winzard_confirm').on('click', me.onWinzardConfirm, me);
	        viewWizardBtn.show();
    		break;	
    	}
    },
    edit_chap: function(self) {
    	
        var en_arr   = [
                         'target_enable_chap_user1',
                         'target_enable_chap_user2',
                         'target_enable_chap_user3'
                       ];
        var chap_arr = [
                         'target_enable_chap_user1_list',
                         'target_enable_chap_user2_list',
                         'target_enable_chap_user3_list'
                       ];
        var mainView = Ext.ComponentQuery.query('#generateTargetView')[0]; 
        switch (self.view.auth) {
        default:
        case 'MCHAP':
        case 'CHAP':
            mainView.down('#target_enable_chap').setValue(true);

            if (self.view.mchap_enabled.toString() == 'Yes') {
            	mainView.down('#target_mutual_chap').setValue(true);
        	} else {
        		mainView.down('#target_mutual_chap').setValue(false);
        	}

            for (var i=0; i < 3; i++) {
                mainView.down('#' + en_arr[i]).enable();    
                mainView.down('#' + chap_arr[i]).enable();
            }

            mainView.down('#mutual_user').setValue(self.view.mchap_user);
            mainView.down('#mutual_passwd').setValue(self.view.mchap_passwd);

            if (self.view.mchap_enabled.toString() == 'Yes') {
            	mainView.down('#target_mutual_chap').enable();	
            	mainView.down('#mutual_user').enable();
            	mainView.down('#mutual_passwd').enable();
            }
            break;

        case 'None':
            mainView.down('#target_enable_chap').setValue(false);
            mainView.down('#target_mutual_chap').setValue(false);
            for (var i=0; i < 3; i++) {
                mainView.down('#' + en_arr[i]).disable();    
                mainView.down('#' + chap_arr[i]).disable();
            }
            break;        
        }
    },
    mutual_mode: function(self, newValue, oldValue, eOpts) {
    	
    	var form = Ext.ComponentQuery.query('#generateTargetView')[0];  
    	if (!newValue) {
            form.down('#mutual_user').disable();
            form.down('#mutual_passwd').disable();
    	} else {
            form.down('#mutual_user').enable();
            form.down('#mutual_passwd').enable();
    	}
    },
    chap_mode: function(self, newValue, oldValue, eOpts) {
        var form     = Ext.ComponentQuery.query('#generateTargetView')[0];  
        var en_arr   = [
                         'target_enable_chap_user1',
                         'target_enable_chap_user2',
                         'target_enable_chap_user3'
                       ];
        var chap_arr = [
                         'target_enable_chap_user1_list',
                         'target_enable_chap_user2_list',
                         'target_enable_chap_user3_list'
                       ];

        if (!newValue) {
            for (var i=0; i < 3; i++) {
                form.down('#' + en_arr[i]).disable();    
                form.down('#' + chap_arr[i]).disable();
            }

            form.down('#target_mutual_chap').disable();
            form.down('#mutual_user').disable();
            form.down('#mutual_passwd').disable();
        } else {
            for (var i=0; i < 3; i++) {
                form.down('#' + en_arr[i]).enable();    
                form.down('#' + chap_arr[i]).enable();
            }

            form.down('#target_mutual_chap').enable();
            form.down('#mutual_user').enable();
            form.down('#mutual_passwd').enable();
        }
    },
    onAccountTypeSelect: function(comboHandle, record) {
        var l=0, k=0;
        var items;
        var me          = this;
        var select      = comboHandle ? comboHandle.getValue() : 'local';
        var en_arr      = [
                            'target_enable_chap_user1',
                            'target_enable_chap_user2',
                            'target_enable_chap_user3'
                          ];
        var chap_arr    = [
                            'target_enable_chap_user1_list',
                            'target_enable_chap_user2_list',
                            'target_enable_chap_user3_list'
                          ];

        var form        = Ext.ComponentQuery.query('#generateTargetView')[0];
        
        var accountAll  = Ext.data.StoreManager.lookup('accountAll');

        switch (select) {
        case 'local':
            items = accountAll.original_account.user;
            break;
        case 'domain':
            items = accountAll.original_account.domain_user;
            break;        
        }
        
        if (comboHandle === undefined) {
            for (var i=0; i < chap_arr.length; i++) {

                if (me.view.action == 'Edit') {
                    if (me.view.user_arr.length != 0 && 
                        me.view.domain_user_arr.length != 0) {

                        var userEdit = me.view.user_arr[l];

                        if (userEdit == '' || userEdit == undefined) {
                            items = accountAll.original_account.domain_user;
                            var domainEdit = me.view.domain_user_arr[k];    
                            k++;
                        } else {
                            items = accountAll.original_account.user;
                            l++;
                        }
                    }
                }

                var combo        = form.down('#' + chap_arr[i]);
                var accountStore = Ext.create('Ext.data.Store', {
                                    fields: ['name'],
                                    data: items
                                   });

                combo.bindStore(accountStore);

                if (combo.getStore().getAt(i) === null) { 
                    combo.disable();

                } else {
                    if (me.view.action == 'Edit') {
                        if (me.view.user_arr.length != 0 && 
                            me.view.domain_user_arr.length != 0) {

                            if (userEdit == '' || userEdit == undefined) {    
                                form.down('#' + en_arr[i]).setValue('domain');
                                combo.select(domainEdit);   
                            } else {
                                form.down('#' + en_arr[i]).setValue('local');
                                combo.select(userEdit);   
                            }   
                        } else {
                            combo.select(combo.getStore().getAt(i));           
                        }
                    } else {                 
                        // combo.enable();
                        combo.select(combo.getStore().getAt(i));       
                    }
                }            
            }   

            for (var i=0; i < chap_arr.length; i++) {

                var combo = form.down('#' + chap_arr[i]);
                if (me.view.action == 'Edit') {
                    var userType = form.down('#' + en_arr[i]).getValue();
                    me.reBind(combo, userType);
                } else {
                    me.reBind(combo);
                }
                
            }
        } else {
            var combo = form.down('#' + chap_arr[comboHandle.indx]);

            combo.reset();
            me.reBind(combo, select);
            combo.select(combo.getStore().getAt(0));    

            for (var i=0; i < chap_arr.length; i++) {
                var combo    = form.down('#' + chap_arr[i]);
                var userType = form.down('#' + en_arr[i]).getValue();
                me.reBind(combo, userType);
            }
        }
    },
    reBind: function(comboHandle, userType) {
        var me           = this;
        var form         = Ext.ComponentQuery.query('#generateTargetView')[0];
        var store_folder = form.getViewModel().getStore('accountAll');
        var items        = me.isNotEql(comboHandle, userType);
        var tData        = [];

        for (var i=0; i < items.length; i++) {
            tData.push({name: items[i]});
        }

        var ac = Ext.create('Ext.data.Store', {
                    fields: ['name'],
                    data: tData
                 });

        comboHandle.bindStore(ac);
    },
    isNotEql: function(comboHandle, userType) {
        var me           = this;
        var curstack     = [];
        var delstack     = [];
        var en_arr       = [
                             'target_enable_chap_user1',
                             'target_enable_chap_user2',
                             'target_enable_chap_user3'
                           ];
        var chap_arr     = [
                             'target_enable_chap_user1_list',
                             'target_enable_chap_user2_list',
                             'target_enable_chap_user3_list'
                           ];
        var form         = Ext.ComponentQuery.query('#generateTargetView')[0];  
        var store_folder = form.getViewModel().getStore('accountAll');
        var user         = store_folder.original_account.user;
        var domain       = store_folder.original_account.domain_user;
        var tmpUser      = [];
        var tmpDomain    = [];
        
        for (var i=0; i < domain.length; i++) {
            tmpDomain.push(domain[i].name);
        }

        for (var i=0; i < user.length; i++) {
            tmpUser.push(user[i].name);
        }

        for (var i=0; i < chap_arr.length; i++) {
            //  except self 
            if (comboHandle.indx === i) {
                continue;
            }
            // none
            if (form.down('#' + chap_arr[i]).getSelection() === null) {
                continue;
            }
            // different group type
            if (userType !== undefined) {
                if (userType !== form.down('#'+ en_arr[i]).getValue()) {
                    continue;
                }
            }

            delstack.push(form.down('#' + chap_arr[i]).getSelection().get('name'));
        }

        switch (userType) {
        default:    
        case 'local': 
            curstack = Ext.Array.difference(tmpUser,delstack);
            break;

        case 'domain': 
            curstack = Ext.Array.difference(tmpDomain,delstack);
            break;
        }

        return curstack;
    },
    onAccountFilter: function(curCombo, record) {
        var me       = this;
        var form     = Ext.ComponentQuery.query('#generateTargetView')[0];  
        var en_arr   = [
                         'target_enable_chap_user1',
                         'target_enable_chap_user2',
                         'target_enable_chap_user3'
                       ];
        var chap_arr = [
                         'target_enable_chap_user1_list',
                         'target_enable_chap_user2_list',
                         'target_enable_chap_user3_list'
                       ];           

        for (var i=0; i < chap_arr.length; i++) {

            var combo    = form.down('#'+ chap_arr[i]);
            var chapType = form.down('#' + en_arr[i]);
            var userType = chapType ? chapType.getValue() : 'local';    
            me.reBind(combo, userType);
        }

    },
    onWinzardBack: function() {
		var me            = this;
		var targetView    = Ext.ComponentQuery.query('#generateTargetView')[0];
		var lunView       = Ext.ComponentQuery.query('#generateLunView')[0];
		var mainView      = Ext.ComponentQuery.query('#generalView')[0];
		var wizardView    = Ext.ComponentQuery.query('#wizardView')[0]; 
		var responseArray = [];
		
		switch(me.view.mode) {
		case "Wizard_Lun":	
			lunView.hide();
			break;
		case "Wizard_Target":	
			targetView.hide();
			break;
		case "Wizard_Target_Lun":	
			targetView.hide();
			lunView.hide();
			break;
		}

		if (me.view.mix == true) {
			targetView.hasConfigView = 'Wizard_Target';
			lunView.hasConfigView    = 'Wizard_Lun';
		} else if (me.view.mix == false) {
			targetView.hasConfigView = 'Wizard_Target';
		}

		if (wizardView === undefined) {
			winzardView   = new DESKTOP.StorageManagement.iscsi.view.GenerateWizard();
			responseArray.push(winzardView);
			mainView.setConfig({title: "Create Wizard", width: 600, height: 165});
			mainView.add({items: responseArray});
		} else {
			wizardView.show();
			mainView.setConfig({title: "Create Wizard", width: 600, height: 165});
		}
    },
    onWinzardCancel: function() {
    	var mainView   = Ext.ComponentQuery.query('#generalView')[0]; 
    	mainView.removeAll();
    	Ext.ComponentQuery.query('#generalView')[0].close();
    },
    onCancel: function () {
        Ext.ComponentQuery.query('#targetEditView')[0].close();
    },
    onConfirm: function () {
        var me = this;
        var editWin = Ext.ComponentQuery.query('#targetEditView')[0];
        Ext.Msg.confirm("waring", "Are you sure that you want to save?", function (btn) {
            if (btn == 'yes') {
                me.showMask(editWin, "Saving");
                me.editISCSITarget();
            }
        });
    },
    editISCSITarget: function () {
        var me        = this;
        var mainView  = Ext.ComponentQuery.query('#generateTargetView')[0];
        var editView  = Ext.ComponentQuery.query('#targetEditView')[0];
        var setupView = Ext.ComponentQuery.query('#Setup')[0];

        var setupView = Ext.ComponentQuery.query('#Setup')[0];
        var tarSeled  = setupView.down('#target_name').getSelectionModel().getSelection()[0];

        var parameter = {
                          op: 'edit_target_node',
                          target_id: tarSeled.get('indx'),
                          target_name: mainView.down('#target_name').value
                        };

        var local_user_arr  = [];
        var domain_user_arr = [];
        var en_arr   = [
                         'target_enable_chap_user1',
                         'target_enable_chap_user2',
                         'target_enable_chap_user3'
                       ];
        var chap_arr = [
                         'target_enable_chap_user1_list',
                         'target_enable_chap_user2_list',
                         'target_enable_chap_user3_list'
                       ];

        for (var i=0; i < 3; i++) {

            var chapType = mainView.down('#' + en_arr[i]).getValue();

            switch (chapType) {
            case 'local':
                if (createWin.down('#' + chap_arr[i]).getValue() != null) {
                    local_user_arr.push(mainView.down('#' + chap_arr[i]).getValue());
                }
                break;

            case 'domain':
                if (createWin.down('#' + chap_arr[i]).getValue() != null) {
                    domain_user_arr.push(mainView.down('#' + chap_arr[i]).getValue());
                }
                break;    
            }
        }

        if (mainView.down('#target_enable_chap').checked) {
            parameter.local_user_arr  = Ext.JSON.encode(local_user_arr);
            parameter.domain_user_arr = Ext.JSON.encode(domain_user_arr); 

	        if (mainView.down('#target_mutual_chap').checked) {
	        	parameter.mchap_user   = editView.down('#mutual_user').getValue();
	        	parameter.mchap_passwd = editView.down('#mutual_passwd').getValue();
	        }            
        } else {
            parameter.local_user_arr  = null;
            parameter.domain_user_arr = null;
        	//parameter.mchap_user      = null;
        	//parameter.mchap_passwd    = null;
        }

        if (!mainView.down('#target_mutual_chap').checked) {
        	parameter.mchap_user      = null;
        	parameter.mchap_passwd    = null;
        } else {
        	parameter.mchap_user   = editView.down('#mutual_user').getValue();
        	parameter.mchap_passwd = editView.down('#mutual_passwd').getValue();
        }

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
            method: 'post',
            waitMsg: 'Saving...',
            waitMsgTarget: true,
            params: parameter,
            success: function (form, action) {
                var respText = Ext.util.JSON.decode(form.responseText),
                    msg = respText.msg;
                if (msg !== '') {
                    Ext.MessageBox.alert('<center>Success</center>', msg);
                } else {
                    Ext.MessageBox.alert('<center>Success</center>', "<center>Edit Target Success</center>");
                }

                setupView.getViewModel('iscsisetup').getStore('targetTree').load();
                me.closeWindow(editView);
            },
            failure: function (response, options) {
                var respText = Ext.util.JSON.decode(response.responseText),
                    msg = respText.msg;
                Ext.MessageBox.alert('Failed', msg);
                me.hideMask(editView);
            }
        });
    },
    onWinzardBack: function() {
		var me            = this;
		var targetView    = Ext.ComponentQuery.query('#generateTargetView')[0];
		var lunView       = Ext.ComponentQuery.query('#generateLunView')[0];
		var mainView      = Ext.ComponentQuery.query('#generalView')[0];
		var wizardView    = Ext.ComponentQuery.query('#wizardView')[0]; 
		var responseArray = [];
		
		switch(me.view.mode) {
		case "Wizard_Lun":	
			lunView.hide();
			break;
		case "Wizard_Target":	
			targetView.hide();
			break;
		case "Wizard_Target_Lun":	
			targetView.hide();
			lunView.hide();
			break;
		}

		if (me.view.mix == true) {
			targetView.hasConfigView = 'Wizard_Target';
			lunView.hasConfigView    = 'Wizard_Lun';
		} else if (me.view.mix == false) {
			targetView.hasConfigView = 'Wizard_Target';
		}

		//targetView.hasConfigView = me.view.mode;

		if (wizardView == undefined) {
			winzardView   = new DESKTOP.StorageManagement.iscsi.view.GenerateWizard();
			responseArray.push(winzardView);
			mainView.setConfig({title: "Create Wizard", width: 600, height: 150});
			mainView.add({items: responseArray});
		} else {
			wizardView.show();
			mainView.setConfig({title: "Create Wizard", width: 600, height: 150});
		}
    },
    showMask: function (el, str) {
        el.mask(str);
    },
    hideMask: function (el) {
        el.unmask();
    },
    closeWindow: function (el) {
        el.destroy();
    },
    createISCSITarget: function () {
        var form;
        var oriSize;
        var unit;

        var me = this;

        var mainView  = Ext.ComponentQuery.query('#generateTargetView')[0];
        var createWin = Ext.ComponentQuery.query('#generalView')[0];
        var setupView = Ext.ComponentQuery.query('#Setup')[0];

        var parameter       = {
                                op: 'create_target_node',
                                target_name: mainView.down("#target_name").value
                              };
        var local_user_arr  = [];
        var domain_user_arr = [];
        var en_arr   = [
                         'target_enable_chap_user1',
                         'target_enable_chap_user2',
                         'target_enable_chap_user3'
                       ];
        var chap_arr = [
                         'target_enable_chap_user1_list',
                         'target_enable_chap_user2_list',
                         'target_enable_chap_user3_list'
                       ];

        for (var i=0; i < 3; i++) {

            var chapType = createWin.down('#' + en_arr[i]).getValue();

            switch (chapType) {
            case 'local':
                if (createWin.down('#' + chap_arr[i]).getValue() != null) {
                    local_user_arr.push(createWin.down('#' + chap_arr[i]).getValue());
                }
                break;

            case 'domain':
                if (createWin.down('#' + chap_arr[i]).getValue() != null) {
                    domain_user_arr.push(createWin.down('#' + chap_arr[i]).getValue());
                }
                break;    
            }
        }
        
        if (mainView.down('#target_enable_chap').checked) {
            parameter.local_user_arr = Ext.JSON.encode(local_user_arr);
            parameter.domain_user_arr = Ext.JSON.encode(domain_user_arr);     

	        if (mainView.down('#target_mutual_chap').checked) {
	        	parameter.mchap_user   = createWin.down('#mutual_user').getValue();
	        	parameter.mchap_passwd = createWin.down('#mutual_passwd').getValue();
	        }                    
        } else {
            /*
            parameter.local_user_arr  = null;
            parameter.domain_user_arr = null;
        	parameter.mchap_user      = null;
        	parameter.mchap_passwd    = null;
            */
        }

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
            method: 'POST',
            waitMsg: 'Saving...',
            waitMsgTarget: true,
            params: parameter,
            success: function (form, action) {
                var respText = Ext.util.JSON.decode(form.responseText),
                    msg = respText.msg;
                if (msg !== '') {
                    Ext.MessageBox.alert('<center>Success</center>', msg);
                } else {
                    Ext.MessageBox.alert('<center>Success</center>', "<center>Create Target Success</center>");
                }
                setupView.getViewModel('iscsisetup').getStore('targetTree').load();
                me.closeWindow(createWin);
            },
            failure: function (response, options) {
                var respText = Ext.util.JSON.decode(response.responseText),
                    msg = respText.msg;
                Ext.MessageBox.alert('<center>Failed</center>', msg);
                me.hideMask(createWin);
            }
        });
    },
    onWinzardConfirm: function () {
        var me = this;
        var createWin = Ext.ComponentQuery.query('#generalView')[0];
        Ext.Msg.confirm("waring", "Are you sure that you want to save?", function (btn) {
            if (btn == 'yes') {
                me.showMask(createWin, "Saving");
                me.createISCSITarget();
            }
        });
    }
});
