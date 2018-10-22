Ext.define('DESKTOP.StorageManagement.iscsi.controller.GeneralSettingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.iscsigeneralsetting',
    init: function () {
        var mainView = Ext.ComponentQuery.query('#GeneralSetting')[0];

        mainView.getViewModel().getStore('iscsiService').load();
    },
    dirtycheck: function () {
    	var iscsiService  = Ext.data.StoreManager.lookup('iscsiService');
    	
    	if (iscsiService.ori_server_data === undefined) {
    		return false;
    	}

        var form          = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var iscsi_enable  = form.getViewModel().get('iscsi_enable');
        var iscsi_port    = form.getViewModel().get('iscsi_port');
        var isns_enable   = form.getViewModel().get('isns_enable');
        var isns_server   = form.getViewModel().get('isns_server');
        
       	var serverFlag    = false;
    	var trans = {
    		Yes : true,
    		No  : false
    	};

		if (iscsi_enable            != trans[iscsiService.ori_server_data.iscsi_enable] || 
			iscsi_port.toString()   != iscsiService.ori_server_data.iscsi_port.toString()   || 
			isns_enable             != trans[iscsiService.ori_server_data.isns_enable]  || 
			isns_server.toString()  != iscsiService.ori_server_data.isns_server.toString()) {

			serverFlag = true;
		} else {
			serverFlag = false;		
		}

		return serverFlag;
    },
    on_Apply_All: function (form, me) {
        var mainView   = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var appwindow  = me;
        var genralInfo = {};

        var mainView = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var form     = mainView.down('form').getForm();
        var trans = {
            true  : 1,
            false : 0
        };

        if (mainView.down('#iscsi_enable').value == true) {
            if (mainView.down('#iscsi_port').value == '') {
                Ext.Msg.alert('Invalid Data', 'Please input required form column.');
                return;
            }
        }

        if (mainView.down('#isns_enable').value == true) {
            if (mainView.down('#isns_ip ').value == '') {
                Ext.Msg.alert('Invalid Data', 'Please input required form column.');
                return;   
            }
        }

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
            method: 'POST',
            params: {
                op           : 'set_general_setting',
                iscsi_enable : trans[mainView.down('#iscsi_enable').value],
                iscsi_port   : mainView.down('#iscsi_port').value,
                isns_enable  : trans[mainView.down('#isns_enable').value],
                isns_server  : mainView.down('#isns_ip').value
            },
            waitMsg: 'Please Wait',
            success: function (response) {

                if (Ext.JSON.decode(response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'GeneralSetting');
                }
            },
            failure: function (response) {
                Ext.Msg.alert('Failed', response.responseText);
            }
        });
    }
});
