Ext.define('DESKTOP.StorageManagement.iscsi.model.GeneralSettingModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.iscsigeneralsetting',
    requires: ['DESKTOP.StorageManagement.iscsi.controller.GeneralSettingController'],
    data: {
    	iscsi_enable : false,
    	iscsi_port   : '0',
    	isns_enable  : false,
    	isns_server  : ''
    }, 
    stores: {
        iscsiService: {
        	reference: 'user',
        	ori_server_data: null,
            storeId: 'iscsiService',
            selfVM: null,
            fields: ['iscsi_port', 'iscsi_enable','entity_name','max_tgt_node','max_lun','isns_enable','isns_server'],
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
                method: 'GET',
                extraParams: {
                    op: 'get_general_setting',
                    md5sum: 0
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records) {
                	var iscsiService = Ext.data.StoreManager.lookup('iscsiService');
                	var mainView = Ext.ComponentQuery.query('#GeneralSetting')[0];
                	var trans = {
                		Yes : true,
                		No  : false
                	};

                	iscsiService.ori_server_data = records[0].data;

                    mainView.getViewModel().set('iscsi_enable',  trans[records[0].data.iscsi_enable]);
                    mainView.getViewModel().set('iscsi_port',    records[0].data.iscsi_port);
                	mainView.getViewModel().set('isns_enable',   trans[records[0].data.isns_enable]);
                	mainView.getViewModel().set('isns_server',   records[0].data.isns_server);
                }
            }
        }
    }
});

