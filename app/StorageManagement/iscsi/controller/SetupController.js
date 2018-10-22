Ext.define('DESKTOP.StorageManagement.iscsi.controller.SetupController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.iscsisetup',
    requires: [
        'DESKTOP.StorageManagement.iscsi.view.GeneralTarget',
        'DESKTOP.StorageManagement.iscsi.view.GeneralWizard',
        'DESKTOP.StorageManagement.iscsi.view.GeneralLun',
        'DESKTOP.StorageManagement.iscsi.view.Masking',
        'DESKTOP.StorageManagement.iscsi.view.Delete',
        'DESKTOP.StorageManagement.iscsi.view.GeneralLunMap'
    ],
    init: function () {

        this.globalButton = [{
            defaultName: "Create",
            nameIndex: "CreateWizard",
            handler: "onCreateWizard"
        }];
    },
    onCreateWizard: function () {
        var win;
        var wizardView;
        var info = {};
        var me = this;
        info = {
            name: "Wizard",
            action: "Create"
        };
        wizardView = new DESKTOP.StorageManagement.iscsi.view.GeneralWizard(info);
        win = new Ext.Window({
            itemId: 'generalView',
            titleAlign: 'center',
            title: 'Create Wizard',
            width: 620,
            height: 180,
            resizable: true,
            modal: true,
            items: [wizardView]
        });
        win.show();
    },
    onTargetAdd: function () {
        var win;
        var targetView;
        var info  = {};
        var me    = this;
        var upmap = Ext.data.StoreManager.lookup('iscsiService');
        info = {
            mode: "Target",
            action: "Create",
            iqn: upmap.getAt(0).get('entity_name')
        };
        targetView = new DESKTOP.StorageManagement.iscsi.view.GeneralTarget(info);
        win = new Ext.Window({
            titleAlign: 'center',
            title: 'Create Target',
            width: 600,
            height: 450,
            resizable: true,
            modal: true,
            closable: true,
            maximizable: true,
            minimizable: true,
            items: [targetView]
        });
        win.show();
    },
    onLUNAdd: function () {
        var win;
        var lunView;
        var info = {};
        var me = this;
        info = {
            mode: "Lun",
            action: "Create"
        };
        lunView = new DESKTOP.StorageManagement.iscsi.view.GeneralLun(info);
        win = new Ext.Window({
            titleAlign: 'center',
            title: 'Create LUN',
            width: 600,
            height: 350,
            resizable: true,
            modal: true,
            closable: true,
            maximizable: true,
            minimizable: true,
            items: [lunView]
        });
        this.getViewModel().set('vm_pool_size', 56);
        win.show();
    },
    onLUNEdit: function (field) {
        var win;
        var lunView;
        var me = this;
        var main_grid = field.up('#Setup').down('#grid_unmappedLun');
        var select_item = main_grid.getSelectionModel().getSelection()[0];
        var lunMainView = Ext.ComponentQuery.query('#generateLunView')[0];
        var info = {
            mode: "Lun",
            action: "Edit",
            avail_gb: select_item.get('avail_gb'),
            avail_mb: select_item.get('avail_mb'),
            capacity_gb: select_item.get('capacity_gb'),
            capacity_mb: select_item.get('capacity_mb'),
            lun_name: select_item.get('lun_name'),
            lun_type: select_item.get('lun_type'),
            name: select_item.get('name'),
            pool_name: select_item.get('pool_name'),
            reserved_gb: select_item.get('reserved_gb'),
            reserved_mb: select_item.get('reserved_mb'),
            used_gb: select_item.get('used_gb'),
            used_mb: select_item.get('used_mb'),
            volsize_gb: select_item.get('volsize_gb'),
            volsize_mb: select_item.get('volsize_mb')
        };

        if (lunMainView !== undefined) {
            lunView = lunMainView;
            lunMainView.show();
        } else {
            lunView = new DESKTOP.StorageManagement.iscsi.view.GeneralLun(info);
            Ext.ComponentQuery.query('#generateLunView')[0].show();
        }

        // lunView = new DESKTOP.StorageManagement.iscsi.view.GeneralLun(info);
        win = new Ext.Window({
            itemId: 'lunEditView',
            titleAlign: 'center',
            title: 'Edit LUN',
            width: 650,
            height: 350,
            resizable: true,
            modal: true,
            closable: true,
            maximizable: true,
            minimizable: true,
            items: [lunView]
        });
        win.show();
    },
    onMaskDelete: function () {
        var msg;
        var info       = {};
        var me         = this;
        var mainView   = Ext.ComponentQuery.query('#Setup')[0];
        var maskSel    = mainView.down('#grid_masking').getSelectionModel().getSelection()[0];
        var lun        = mainView.down('#target_name').getSelectionModel().getSelection()[0];
        var lun_p_name = maskSel.get('name');

        Ext.Msg.show({
            title: '<center>Delete LUN Masking policy</center>',
            message: 'Are you sure to delete the LUN Masking policy for the initiator ?<br/>'+
                     'Policy name: ' + lun_p_name + '<br/>',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn === 'yes') {
                    var mask = new Ext.LoadMask({
                        msg: 'Waiting...',
                        target: mainView
                    });

                    mask.show();

                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
                        method: 'POST',
                        params: {
                            op          : 'delete_lun_mask_policy',
                            target_id   : lun.get('target_id'),
                            lun_id      : lun.get('lun_id'),
                            policy_name : lun_p_name
                        },
                        waitMsg: 'Please Wait',
                        success: function (response) {

                            mainView.getViewModel('iscsisetup').getStore('targetTree').load();
                            mask.destroy();

                            if (Ext.JSON.decode(response.responseText).success === false) {
                                msg = Ext.JSON.decode(response.responseText).msg;
                                Ext.Msg.alert('Error', msg);
                            } else {
                                msg = Ext.JSON.decode(response.responseText).msg;
                                if (msg !== '') {
                                    Ext.MessageBox.alert('Success', msg);   
                                } else {
                                    Ext.MessageBox.alert('Success', 'Delete ' + seletedVol.data.vol_name + ' success'); 
                                }
                            }
                        },
                        failure: function (response) {

                            mask.destroy();

                            Ext.Msg.alert('Failed', response.responseText);
                        }
                    });
                }
            }
        });
    },
    onUnMapDelete: function () {
        var msg;
        var me         = this;
        var win        = me.getView();
        var mainView   = Ext.ComponentQuery.query('#Setup')[0];
        var lunSeled   = mainView.down('#grid_unmappedLun').getSelectionModel().getSelection()[0];

        Ext.Msg.show({
            title: '<center>Delete Un-Mapped LUN Masking policy</center>',
            message: 'Are you sure to delete the Un-Mapped ' + lunSeled.data.lun_name + ' LUN Masking policy for the initiator ?<br/>',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn === 'yes') {
                    var mask = new Ext.LoadMask({
                        msg: 'Waiting...',
                        target: mainView
                    });

                    mask.show();

                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
                        method: 'POST',
                        params: {
                            op   : 'delete_iscsi_lun',
                            pool : lunSeled.data.pool_name,
                            lun  : lunSeled.data.lun_name
                        },
                        waitMsg: 'Please Wait',
                        success: function (response) {

                            mask.destroy();
                            mainView.getViewModel().getStore('poolInfo').load();
                            mainView.getViewModel().getStore('volumeInfo').load();

                            if (Ext.JSON.decode(response.responseText).success === false) {
                                msg = Ext.JSON.decode(response.responseText).msg;
                                Ext.Msg.alert('Error', msg);
                            } else {
                                msg = Ext.JSON.decode(response.responseText).msg;
                                if (msg !== '') {
                                    Ext.MessageBox.alert('Success', msg);   
                                } else {
                                    Ext.MessageBox.alert('Success', 'Delete ' + seletedVol.data.vol_name + ' success'); 
                                }
                            }
                        },
                        failure: function (response) {

                            mask.destroy();

                            Ext.Msg.alert('Failed', response.responseText);
                        }
                    });
                }
            }
        });
    },
    onMaskAdd: function () {
        var win;
        var maskView;

        var info = {};
        var me   = this;

        info = {
            name: "Mask",
            action: "Add"
        };

        maskView = new DESKTOP.StorageManagement.iscsi.view.Masking(info);

        win = new Ext.Window({
            itemId: 'generalMaskView',
            titleAlign: 'center',
            title: 'Add LUN Masking policy',
            width: 465,
            height: 190,
            resizable: true,
            modal: true,
            items: [maskView]
        });
        win.show();
    },
    onMaskEdit: function () {  

        var win;
        var maskView;
        var info     = {};
        var me       = this;
        var mainView = Ext.ComponentQuery.query('#Setup')[0];
        var maskSel  = mainView.down('#grid_masking').getSelectionModel().getSelection()[0];
        var lun_p_name = maskSel.get('name');
        var lun_iqn    = maskSel.get('host');
        var lun_ro     = maskSel.get('ro_status');
        var lun_rw     = maskSel.get('rw_status');
        var lun_deny   = maskSel.get('deny_status');
        var lun_perm   = maskSel.get('perm');

        info = {
            name     : "Mask",
            action   : "Edit",
            policy   : lun_p_name,
            iqn      : lun_iqn,
            lun_ro   : lun_ro,
            lun_rw   : lun_rw,
            lun_deny : lun_deny,
            lun_perm : lun_perm
        };

        maskView = new DESKTOP.StorageManagement.iscsi.view.Masking(info);

        win = new Ext.Window({
            itemId: 'generalMaskView',
            titleAlign: 'center',
            title: 'Edit LUN Masking policy',
            width: 465,
            height: 190,
            resizable: true,
            modal: true,
            items: [maskView]
        });
        win.show();
    },
    onTargetDelete: function () {
        var targetRecord;
        var selIndx;
        var me         = this;
        var mainView   = Ext.ComponentQuery.query('#Setup')[0];
        var tarSeled   = mainView.down('#target_name').getSelectionModel().getSelection()[0];
        var targetInfo = mainView.getViewModel('iscsisetup').getStore('targetTree');
        var delMask = new Ext.LoadMask(mainView, {
            msg: "Waiting..."
        });

        targetRecord = targetInfo.findRecord('name', tarSeled.getData().text);
        Ext.Msg.confirm("waring", "Are you sure that you want to delete?", function (btn) {
            if (btn == 'yes') {
                delMask.show();
                Ext.Ajax.request({
                    url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
                    method: 'POST',
                    params: {
                        op: 'delete_target_node',
                        target_id: targetRecord.id
                    },
                    success: function (form, action) {

                        Ext.defer(function() {
                            delMask.destroy();
                        }, 300);

                        var respText = Ext.util.JSON.decode(form.responseText),
                            msg = respText.msg;
                        if (msg !== '') {
                            Ext.MessageBox.alert('<center>Success</center>', msg);
                        } else {
                            Ext.MessageBox.alert('<center>Success</center>', "<center>Delete Target Success</center>");
                        }

                        mainView.getViewModel('iscsisetup').getStore('targetTree').load();
                    },
                    failure: function (response, options) {
                        var respText = Ext.util.JSON.decode(response.responseText),
                            msg = respText.msg;
                        Ext.MessageBox.alert('<center>Failed</center>', msg);
                        delMask.destroy();
                    }
                });
            }
        });
    },
    onTargetEdit: function (field) {
        var win;
        var targetView;
        var me = this;
        var main_grid = field.up('#Setup').down('#target_name');
        var select_item = main_grid.getSelectionModel().getSelection()[0];
        var targetMainView = Ext.ComponentQuery.query('#generateTargetView')[0];

        var info = {
            mode: "Target",
            action: "Edit",
            target_name: select_item.getData().text,
            iqn: select_item.getData().iqn,
            auth: select_item.getData().auth,
            user_arr: select_item.getData().user_arr,
            domain_user_arr: select_item.getData().domain_user_arr,
            mchap_enabled: select_item.getData().mchap_enabled,
            mchap_user: select_item.getData().mchap_user,
            mchap_passwd: select_item.getData().mchap_passwd
        };

        if (targetMainView !== undefined) {
            targetView = targetMainView;
            targetMainView.show();
        } else {
            targetView = new DESKTOP.StorageManagement.iscsi.view.GeneralTarget(info);
            Ext.ComponentQuery.query('#generateTargetView')[0].show();
        }
        
        win = new Ext.Window({
            itemId: 'targetEditView',
            titleAlign: 'center',
            title: 'Edit Target',
            width: 550,
            height: 450,
            resizable: true,
            modal: true,
            closable: true,
            maximizable: true,
            minimizable: true,
            items: [targetView]
        });
        win.show();
    },
    onUnmap: function (field) {
        var main_grid   = field.up('#Setup').down('#target_name');
        var select_item = main_grid.getSelectionModel().getSelection()[0];
        var setupView   = Ext.ComponentQuery.query('#Setup')[0];
        var upmap       = Ext.data.StoreManager.lookup('unmappedLun');
        var tarTree     = Ext.data.StoreManager.lookup('targetTree');
        var mask        = new Ext.LoadMask({
            msg: 'Unmap...',
            target: setupView
        });

        Ext.Msg.confirm("waring", "Are you sure that you want to unmap?", function (btn) {
            if (btn == 'yes') {
                mask.show();

                Ext.Ajax.request({
                    url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
                    method: 'POST',
                    params: {
                        op: 'unmap_iscsi_lun',
                        target_id: select_item.parentNode.data.indx,
                        lun_id: select_item.data.lun_id  
                    },
                    success: function (form, action) {

                        upmap.load();
                        tarTree.load();

                        Ext.defer(function() {
                            delMask.destroy();
                        }, 300);

                        var respText = Ext.util.JSON.decode(form.responseText),
                            msg = respText.msg;
                        if (msg !== '') {
                            Ext.MessageBox.alert('<center>Success</center>', msg);
                        } else {
                            Ext.MessageBox.alert('<center>Success</center>', "<center>Unmap Lun Success</center>");
                        }

                        mask.destroy();
                    },
                    failure: function (response, options) {
                        upmap.load();
                        tarTree.load();
                        mask.destroy();
                        var respText = Ext.util.JSON.decode(response.responseText),
                            msg = respText.msg;
                        Ext.MessageBox.alert('<center>Failed</center>', msg);
                    }
                });
            }
        });
    },
    onLunMap: function (field) {

        var lunMapView;
        lunMapView = new DESKTOP.StorageManagement.iscsi.view.GeneralLunMap();
        
        win = new Ext.Window({
            itemId: 'lunMapView',
            titleAlign: 'center',
            title: 'Lun Map',
            width: 350,
            height: 150,
            resizable: true,
            modal: true,
            closable: true,
            maximizable: true,
            minimizable: true,
            items: [lunMapView]
        });
        win.show();        
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
    onCancel: function () {},
    lunSelected: function (combo, record, eOpts) {
        var me       = this;
        var mainView = Ext.ComponentQuery.query('#Setup')[0];

        mainView.down('#info_lun').show();    
        mainView.down('#info_target').hide();        
        mainView.down('#grid_masking').show();
        me.maskLoad(combo, record, eOpts, 'lunGrid');
    },
    tarSelected: function (combo, record, eOpts) {
        var tarValue;
        var me       = this;
        var mainView = Ext.ComponentQuery.query('#Setup')[0];
        var node     = record.isLeaf() ? 'lunGrid' : 'targetTree';

        if (record.isLeaf()) {
            mainView.down('#grid_masking').show();
            mainView.down('#info_lun').show();       
            mainView.down('#info_target').hide();
        } else {
            mainView.down('#grid_masking').hide();
            mainView.down('#info_lun').hide();       
            mainView.down('#info_target').show();

            tarValue = (record.data.is_enabled == 'No') ? false : true;
            Ext.ComponentQuery.query('#Setup')[0].down('#target_on_off').setValue(tarValue);
        }
        me.maskLoad(combo, record, eOpts, node);
    },
    maskSelected: function (combo, record, eOpts) {
        var mainView = Ext.ComponentQuery.query('#Setup')[0];
        if (record.data.name.toLowerCase().indexOf('default') != -1) {
            mainView.down('#mask_add_btn').setDisabled(false);
            mainView.down('#mask_edit_btn').setDisabled(false);
            mainView.down('#mask_del_btn').setDisabled(true);
        } else {
            mainView.down('#mask_add_btn').setDisabled(false);
            mainView.down('#mask_edit_btn').setDisabled(false);
            mainView.down('#mask_del_btn').setDisabled(false);
        }
    },
    maskLoad: function(combo, record, eOpts, from) {
        var tmp;
        var mainView = Ext.ComponentQuery.query('#Setup')[0];
        var info = {
            target: {
                indx: '',
                iqn: '',
                name: ''
            },
            lun:{
                name: '',
                poolName: '',
                avail: '',  
                used: '',
                type: '',
                capacity: ''
            }
        };

        if (from == 'targetTree') {
            info['target']['indx'] = record.get('indx');
            info['target']['iqn']  = record.get('iqn');
            info['target']['name'] = record.get('text');

            mainView.getViewModel().set('tar_iqn',      info['target']['iqn']);
            mainView.down('#tarEdit').setDisabled(false);
            mainView.down('#tarDel').setDisabled(false);
            mainView.down('#tarUnMap').setDisabled(true);
            mainView.down('#lun_edit').setDisabled(true);
            mainView.down('#lun_del').setDisabled(true);
            mainView.down('#lun_map').setDisabled(true);
        } else if (from == 'lunGrid') {
            info['lun']['name']     = record.get('lun_name');
            info['lun']['poolName'] = record.get('pool_name');
            info['lun']['avail']    = record.get('avail_gb');
            info['lun']['used']     = record.get('used_gb');
            info['lun']['type']     = (record.get('thin')=='disable') ? 'thick' : 'non-thick';
            info['lun']['capacity'] = record.get('capacity_gb');

            mainView.getViewModel().set('lun_name',      info['lun']['name']);
            mainView.getViewModel().set('lun_type',      info['lun']['type']);
            mainView.getViewModel().set('lun_capacity',  info['lun']['capacity']);
            mainView.getViewModel().set('lun_used',      info['lun']['used']);
            mainView.getViewModel().set('lun_available', info['lun']['avail']);

            var maskLun = this.getViewModel().getStore('maskLun');
            if (record.data.policy_arr !== undefined) {
                maskLun.loadData(record.data.policy_arr);    
            }
            
            mainView.down('#tarEdit').setDisabled(true);
            mainView.down('#tarDel').setDisabled(true);
            mainView.down('#tarUnMap').setDisabled(false);
            mainView.down('#lun_edit').setDisabled(false);
            mainView.down('#lun_del').setDisabled(false);
            mainView.down('#lun_map').setDisabled(false);
        }
    },
    onBeforeLinuxPermChange: function(checkBox, rowIndex, checked) {

    },
    addGlobalButton: function (windowEl, panelEl) {
        windowEl.getController().addItemtoToolbarGlobalButton(windowEl, panelEl, this.globalButton);
    },
    dirtycheck: function () {
    	var mainView     = Ext.ComponentQuery.query('#Setup')[0];
    	var main_grid    = mainView.down('#target_name');
    	var select_item  = main_grid.getSelectionModel().getSelection()[0];
    	var trigger      = select_item.data.is_enabled;
    	var targetOnFlag = false;
    	var on           = Ext.ComponentQuery.query('#Setup')[0].down('#target_on_off').value;
    	var trans = {
    		Yes : true,
    		No  : false
    	};

		if (on != trans[trigger]) {
			targetOnFlag = true;
		} else {
			targetOnFlag = false;		
		}

    	return targetOnFlag;
    },
    on_Apply_All: function (form, me) {
        var opram;
        var appwindow   = me;
        var mainView    = Ext.ComponentQuery.query('#Setup')[0];
        var main_grid   = mainView.down('#target_name');
        var select_item = main_grid.getSelectionModel().getSelection()[0];
        var on      = Ext.ComponentQuery.query('#Setup')[0].down('#target_on_off').value;
        var upmap   = Ext.data.StoreManager.lookup('unmappedLun');
        var tarTree = Ext.data.StoreManager.lookup('targetTree');

        if (on) {
            opram = 'enable_target_node';
        } else {
            opram = 'disable_target_node';
        }

        appwindow.showLoadingMask();

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
            method: 'POST',
            params: {
                op: opram,
                target_id: select_item.data.indx
            },
            success: function (form, action) {
                appwindow.hideLoadingMask();
                upmap.store.on('load',function(){
                	mainView.down('#grid_unmappedLun').unmask();
                });
                tarTree.load();

                if (Ext.JSON.decode(action.response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'Setup');
                }
            },
            failure: function (response, options) {
            	upmap.store.on('load',function(){
                	mainView.down('#grid_unmappedLun').unmask();
                });
                tarTree.load();

                appwindow.hideLoadingMask();
                var msg = (Ext.JSON.decode(action.response.responseText)).msg;
                var ref = msg;
                appwindow.getresponse(ref, 'Setup');
            }
        });
    }
});
