Ext.define('DESKTOP.StorageManagement.iscsi.controller.GeneralWizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.generalwizard',
    init: function () {
        var me = this;
        var mainView = Ext.ComponentQuery.query('#wizardView')[0];
        var viewHandleBtn = mainView.lookupReference('select_target_lun_btn');
        me.globalButton = [{
            defaultName: "Create",
            nameIndex: "CreateWizard",
            handler: "onCreateWizard"
        }];
        viewHandleBtn.down('#btn_cancel').on('click', me.onCancel, me);
        viewHandleBtn.down('#btn_next').on('click', me.onNext, me);
        mainView.lookupReference('select_target_lun_btn').show();
    },
    onCancel: function () {
        var mainView = Ext.ComponentQuery.query('#generalView')[0];
        var wizardView = Ext.ComponentQuery.query('#wizardView')[0];
        if (mainView !== undefined) {
            mainView.removeAll();
            Ext.ComponentQuery.query('#generalView')[0].destroy();
        }
    },
    onNext: function () {
        var me = this;
        var mainView = Ext.ComponentQuery.query('#generalView')[0];
        var wizardView = Ext.ComponentQuery.query('#wizardView')[0];
        var targetView = Ext.ComponentQuery.query('#generateTargetView')[0];
        var lunView = Ext.ComponentQuery.query('#generateLunView')[0];
        var radioHandle = Ext.ComponentQuery.query('[name=create_target_lun]');

        for (var i = 0; i < radioHandle.length; i++) {

            if (radioHandle[i].checked === false) {
                continue;
            }

            switch (i) {
            case 0:
            default:
		        if (lunView === undefined || targetView === undefined) {
		            var propConfig;
		            var configItemsArray = me.selectMode();
		            me.configItemsArray = configItemsArray;
		            me.propConfig = configItemsArray.pop();
		            wizardView.hide();
		            mainView.setConfig(me.propConfig);
		            mainView.add({
		                items: configItemsArray
		            });
		            return;
		        }

				mainView.setConfig({title: 'Create Target and Map LUN', width: 600, height: 600});

				var viewTargetWizardBtn = targetView.lookupReference('select_winzard_target_btn');
				var viewLunWizardBtn    = lunView.lookupReference('select_winzard_lun_btn');

				if(viewTargetWizardBtn !== undefined) {
					viewTargetWizardBtn.hide();
					viewLunWizardBtn.show();
				}

				targetView.show();
				lunView.show();
				wizardView.hide();
                break;
            case 1:
		        if (targetView === undefined) {
		            var propConfig;
		            var configItemsArray = me.selectMode();
		            me.configItemsArray = configItemsArray;
		            me.propConfig = configItemsArray.pop();
		            wizardView.hide();
		            mainView.setConfig(me.propConfig);
		            mainView.add({
		                items: configItemsArray
		            });
		            return;
		        }
		        
				mainView.setConfig({title: 'Create Target', width: 550, height: 450});

				var viewWizardBtn = targetView.lookupReference('select_winzard_target_btn');

				if(viewWizardBtn !== undefined) {
					viewWizardBtn.show();
				}

				targetView.show();
				lunView.hide();
				wizardView.hide();
                break;
            case 2:
		        if (lunView === undefined) {
		            var propConfig;
		            var configItemsArray = me.selectMode();
		            me.configItemsArray = configItemsArray;
		            me.propConfig = configItemsArray.pop();
		            wizardView.hide();
		            mainView.setConfig(me.propConfig);
		            mainView.add({
		                items: configItemsArray
		            });
		            Ext.ComponentQuery.query('#generateLunView')[0].down("#lun_location").readOnly = false;
		            return;
		        }
		        
				mainView.setConfig({title: 'Create LUN', width: 600, height: 300});
				targetView.hide();
				lunView.show();
				wizardView.hide();
                break;
            }
        }
    },
    selectMode: function () {
        var lunView, targetView;
        var lunInfo = {},
            tarInfo = {};
        var wizardBtnConfigModules = [{
            text: 'Cancel',
            handler: 'onCancel'
        }, {
            text: 'Back',
            handler: 'onBack'
        }, {
            text: 'Confirm',
            handler: 'onConfirm'
        }];
        var radioHandle = Ext.ComponentQuery.query('[name=create_target_lun]');
        var responseArray = [];
        var switchView;
        var msg;
        var setIndex;
        var setWidth;
        var setHeight;
        var upmap = Ext.data.StoreManager.lookup('iscsiService');

        for (var i = 0; i < radioHandle.length; i++) {
            if (radioHandle[i].checked === false) {
                continue;
            }
            switch (i) {
            case 0:
            default:
            	lunInfo = {
	                mode: "Wizard_Lun",
	                action: "Create",
	                mix: true
	            },
	            tarInfo = {
	                mode: "Wizard_Target",
	                action: "Create",
                    iqn: upmap.getAt(0).get('entity_name'),
	                mix: true
	            };
                msg = "Create Target and Map LUN";
                setWidth = 600;
                setHeight = 600;
                setIndex = 0;
                lunView = new DESKTOP.StorageManagement.iscsi.view.GeneralLun(lunInfo);
                targetView = new DESKTOP.StorageManagement.iscsi.view.GeneralTarget(tarInfo);
                lunView.setConfig({hidden: false});
                targetView.setConfig({hidden: false});
                responseArray.push(targetView);
                responseArray.push(lunView);
                break;
            case 1:
                lunInfo = {
	                mode: "Wizard_Lun",
	                action: "Create",
	                mix: false
	            };
            	tarInfo = {
                	mode: "Wizard_Target",
                	action: "Create",
                    iqn: upmap.getAt(0).get('entity_name'),
                	mix: false
            	};
                msg = "Create Target";
                setWidth = 550;
                setHeight = 450;
                setIndex = 1;
                lunView = new DESKTOP.StorageManagement.iscsi.view.GeneralLun(lunInfo);
                targetView = new DESKTOP.StorageManagement.iscsi.view.GeneralTarget(tarInfo);
                lunView.setConfig({hidden: true});
                targetView.setConfig({hidden: false});
                responseArray.push(targetView);
                responseArray.push(lunView);
                break;
            case 2:
	            lunInfo = {
	                mode: "Wizard_Lun",
	                action: "Create",
	                mix: false
	            };
            	tarInfo = {
                	mode: "Wizard_Target",
                	action: "Create",
                    iqn: upmap.getAt(0).get('entity_name'),
                	mix: false
            	};
                msg = "Create LUN";
                setWidth = 600;
                setHeight = 300;
                setIndex = 2;
                lunView = new DESKTOP.StorageManagement.iscsi.view.GeneralLun(lunInfo);
                targetView = new DESKTOP.StorageManagement.iscsi.view.GeneralTarget(tarInfo);
                lunView.setConfig({hidden: false});
                targetView.setConfig({hidden: true});
                responseArray.push(targetView);
                responseArray.push(lunView);
                break;
            }
        }
        this.createIndex = setIndex;
        responseArray.push({
            title: msg,
            width: setWidth,
            height: setHeight
        });
        return responseArray;
    },
    createISCSILUN: function () {
        var form;
        var mainView;
        var secondView;
        var oriSize;
        var unit;
        var createLunFlag = false;
        var me = this;
        var createLunParam = {};
        var createWin = Ext.ComponentQuery.query('#generalView')[0];
        switch (me.createIndex) {
        case 0:
        default:
            mainView = Ext.ComponentQuery.query('#generateTargetView')[0];
            secondView = Ext.ComponentQuery.query('#generateLunView')[0];
            break;
        case 1:
            mainView = Ext.ComponentQuery.query('#generateTargetView')[0];
            break;
        case 2:
            mainView = Ext.ComponentQuery.query('#generateLunView')[0];
            oriSize = mainView.down("#lun_capacity").value;
            unit = mainView.down("#lun_unit_size").value;
            if (unit == "GB") {
                mainView.down("#lun_capacity").pValue = oriSize * 1024;
            } else if (unit == "TB") {
                mainView.down("#lun_capacity").pValue = oriSize * 1024 * 1024;
            }
            Ext.Ajax.request({
                url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
                method: 'post',
                waitMsg: 'Saving...',
                waitMsgTarget: true,
                params: {
                    op: 'create_iscsi_lun',
                    pool: mainView.down("#lun_location").value,
                    name: mainView.down("#lun_name").value,
                    size_mb: mainView.down("#lun_capacity").pValue,
                    thin: mainView.down("#lun_thin_provsioning").value ? 1 : 0,
                    compress: mainView.down("#lun_enable_compression").pValue
                },
                success: function (form, action) {
                    var respText = Ext.util.JSON.decode(form.responseText),
                        msg = respText.msg;
                    if (msg !== '') {
                        Ext.MessageBox.alert('Success', msg);
                    } else {
                        Ext.MessageBox.alert('Success', "Create LUN Success");
                    }
                    Ext.MessageBox.alert('Success', "Create LUN Success");
                    me.closeWindow(createWin);
                },
                failure: function (response, options) {
                    var respText = Ext.util.JSON.decode(response.responseText),
                        msg = respText.msg;
                    Ext.MessageBox.alert('Failed', msg);
                    me.hideMask(createWin);
                }
            });
            break;
        }
    },
    onConfirm: function () {
        var me = this;
        var createWin = Ext.ComponentQuery.query('#generalView')[0];
        Ext.Msg.confirm("waring", "Are you sure that you want to save?", function (btn) {
            if (btn == 'yes') {
                me.showMask(createWin, "Saving");
                me.createISCSILUN();
            }
        });
    },
    onBack: function () {
        var me = this;
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
        var wizardView = Ext.ComponentQuery.query('#wizardView')[0];
        var lunInfo = {};
        var wizardBtnConfigModules = [{
            text: 'Cancel',
            handler: 'onCancel'
        }, {
            text: 'Back',
            handler: 'onBack'
        }, {
            text: 'Confirm',
            handler: 'onConfirm'
        }];
        lunInfo = {
            mode: 'Wizard_Lun',
            action: 'Create',
            lun_name: mainView.down("#lun_name").value,
            lun_location: mainView.down("#lun_location").value,
            pool_capacity: mainView.down("#pool_capacity").value,
            lun_pool_size: mainView.down("#lun_pool_size").value,
            lun_pool_used: mainView.down("#lun_pool_used").value,
            lun_pool_available: mainView.down("#lun_pool_available").value,
            lun_capacity: mainView.down("#lun_capacity").value,
            lun_unit_size: mainView.down("#lun_unit_size").value,
            lun_thin_provsioning: mainView.down("#lun_thin_provsioning").checked,
            lun_enable_compression: mainView.down("#lun_enable_compression").checked,
            lun_compression_type: mainView.down("#lun_compression_type").value
        };
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
    addGlobalButton: function (windowEl, panelEl) {
        windowEl.getController().addItemtoToolbarGlobalButton(windowEl, panelEl, this.globalButton);
    }
});
