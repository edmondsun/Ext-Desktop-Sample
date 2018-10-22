Ext.define('DESKTOP.StorageManagement.iscsi.controller.GeneralLunController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lunsetting',
    requires: [
    ],
    init: function () {
        var me       = this;
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
        var viewSingleBtn = mainView.lookupReference('select_lun_btn');
        var viewWizardBtn = mainView.lookupReference('select_winzard_lun_btn');

        if (mainView.hasConfigView !== undefined) {
            if (me.view.mix == true) {
        	  if (viewWizardBtn !== undefined) {
        	    viewWizardBtn.show();
        	  }
        	}
            return;
        }

        switch (me.view.mode) {
        case "Lun":
            viewSingleBtn.down('#btn_cancel').on('click', me.onCancel, me);
            viewSingleBtn.down('#btn_confirm').on('click', me.onConfirm, me);
            viewSingleBtn.show();
            break;
        case "Wizard_Lun":
            viewWizardBtn.down('#btn_winzard_cancel').on('click', me.onWinzardCancel, me);
            viewWizardBtn.down('#btn_winzard_back').on('click', me.onWinzardBack, me);
            viewWizardBtn.down('#btn_winzard_confirm').on('click', me.onWinzardConfirm, me);
            viewWizardBtn.show();
            break;
        }

        if (mainView.down('#lun_enable_compression').checked) {
            mainView.down('#lun_compression_type').enable();
        } else {
            mainView.down('#lun_compression_type').disable();
        }
    },
    onWinzardConfirm: function () {
        var me = this;
        var createWin = Ext.ComponentQuery.query('#generalView')[0];
        Ext.Msg.confirm("waring", "Are you sure that you want to save?", function (btn) {
            if (btn == 'yes') {
                me.showMask(createWin, "Saving");
                if (me.view.mix == false) {
                    me.createISCSILUN();    
                } else if (me.view.mix == true) {
                    me.createISCSTargetLUN();
                }
            }
        });
    },
    createISCSTargetLUN: function () {
        var form;
        var mainView;
        var oriSize;
        var unit;
        var me         = this;
        var createWin  = Ext.ComponentQuery.query('#generalView')[0];
        var setupView  = Ext.ComponentQuery.query('#Setup')[0];
        var targetView = Ext.ComponentQuery.query('#generateTargetView')[0];
        var lunView    = Ext.ComponentQuery.query('#generateLunView')[0];
        var editView   = Ext.ComponentQuery.query('#generalView')[0];

        oriSize = lunView.down("#lun_capacity").value;
        unit = lunView.down("#lun_unit_size").value;
        if (unit == "GB") {
            lunView.down("#lun_capacity").pValue = oriSize * 1024;
        } else if (unit == "TB") {
            lunView.down("#lun_capacity").pValue = oriSize * 1024 * 1024;
        }

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
            method: 'POST',
            waitMsg: 'Saving...',
            waitMsgTarget: true,
            params: {
                op: 'create_target_and_map_lun',
                target_name: targetView.down('#target_name').value,
                pool: lunView.down("#lun_location").value,
                lun: lunView.down("#lun_name").value,
                size_mb: lunView.down("#lun_capacity").pValue,
                thin: lunView.down("#lun_thin_provsioning").value ? 1 : 0,
                compress: lunView.down("#lun_enable_compression").pValue ? mainView.down("#lun_enable_compression").pValue : "disable"
            },
            success: function (form, action) {
                var respText = Ext.util.JSON.decode(form.responseText),
                    msg = respText.msg;
                if (msg !== '') {
                    Ext.MessageBox.alert('<center>Success</center>', msg);
                } else {
                    Ext.MessageBox.alert('<center>Success</center>', "<center>Create Target and Lun Success</center>");
                }

                setupView.getViewModel('iscsisetup').getStore('targetTree').load();
                setupView.getViewModel('iscsisetup').getStore('unmappedLun').load();
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
    createISCSILUN: function () {
        var form;
        var mainView;
        var oriSize;
        var unit;
        var me = this;
        var createWin = Ext.ComponentQuery.query('#generalView')[0];
        var setupView = Ext.ComponentQuery.query('#Setup')[0];
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
                lun: mainView.down("#lun_name").value,
                size_mb: mainView.down("#lun_capacity").pValue,
                thin: mainView.down("#lun_thin_provsioning").value ? 1 : 0,
                compress: mainView.down("#lun_enable_compression").pValue ? mainView.down("#lun_enable_compression").pValue : "disable"
            },
            success: function (form, action) {
                var respText = Ext.util.JSON.decode(form.responseText),
                    msg = respText.msg;
                if (msg !== '') {
                    Ext.MessageBox.alert('Success', msg);
                } else {
                    Ext.MessageBox.alert('Success', "Create LUN Success");
                }
                setupView.getViewModel('iscsisetup').getStore('unmappedLun').load();
                me.closeWindow(createWin);
            },
            failure: function (response, options) {
                var respText = Ext.util.JSON.decode(response.responseText),
                    msg = respText.msg;
                Ext.MessageBox.alert('Failed', msg);
                me.hideMask(createWin);
            }
        });
    },
    onWinzardBack: function () {
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
			lunView.hasConfigView = 'Wizard_Lun';
		}

		if (wizardView === undefined) {
			winzardView   = new DESKTOP.StorageManagement.iscsi.view.GenerateWizard();
			responseArray.push(winzardView);
			mainView.setConfig({title: "Create Wizard", width: 600, height: 165});
			mainView.add({items: responseArray});
			Ext.ComponentQuery.query('#generateLunView')[0].down("#lun_location").readOnly = false;
		} else {
			wizardView.show();
			mainView.setConfig({title: "Create Wizard", width: 600, height: 165});
		}
    },
    onWinzardCancel: function () {
        var mainView = Ext.ComponentQuery.query('#generalView')[0];
        mainView.removeAll();
        Ext.ComponentQuery.query('#generalView')[0].close();
    },
    onCancel: function () {
        Ext.ComponentQuery.query('#lunEditView')[0].close();
    },
    onConfirm: function () {
        var me = this;
        var editWin = Ext.ComponentQuery.query('#lunEditView')[0];
        Ext.Msg.confirm("waring", "Are you sure that you want to save?", function (btn) {
            if (btn == 'yes') {
                me.showMask(editWin, "Saving");
                me.editISCSILUN();
            }
        });
    },
    editISCSILUN: function () {
        var me = this;
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
        var editView = Ext.ComponentQuery.query('#lunEditView')[0];
        var setupView = Ext.ComponentQuery.query('#Setup')[0];
        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
            method: 'post',
            waitMsg: 'Saving...',
            waitMsgTarget: true,
            params: {
                op: 'edit_iscsi_lun',
                pool: mainView.down("#lun_location").value,
                lun: mainView.down("#lun_name").oriValue,
                new_lun: mainView.down("#lun_name").value,
                size_mb: mainView.down("#lun_capacity").pValue * 1024,
                thin: mainView.down("#lun_thin_provsioning").value ? 1 : 0,
                compress: mainView.down("#lun_enable_compression").pValue
            },
            success: function (form, action) {
                var respText = Ext.util.JSON.decode(form.responseText),
                    msg = respText.msg;
                if (msg !== '') {
                    Ext.MessageBox.alert('Success', msg);
                } else {
                    Ext.MessageBox.alert('Success', "Edit LUN Success");
                }
                setupView.getViewModel('iscsisetup').getStore('unmappedLun').load();
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
    showMask: function (el, str) {
        el.mask(str);
    },
    hideMask: function (el) {
        el.unmask();
    },
    closeWindow: function (el) {
        el.destroy();
    },
    onProvsion: function (el) {
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
        var unit = mainView.down('#lun_unit_size').value;
        var availableCap = mainView.down("#pool_capacity").getValue();
        var usedSize = mainView.down("#lun_pool_used").value;
        var poolSize = mainView.down("#lun_pool_size").value;
        var realSize = availableCap - Number(usedSize.split(unit)[0]);
        if (el.checked) {
            mainView.down("#lun_capacity").setValue(availableCap);
        } else {
            if (realSize >= 0) {
                mainView.down("#lun_capacity").setValue(realSize);
            } else {
                mainView.down("#lun_capacity").setValue(Number(usedSize.split(unit)[0]));
                mainView.down("#pool_capacity").setValue(Number(usedSize.split(unit)[0]));
            }
        }
    },
    onCompression: function () {
        var me = this;
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
        if (mainView.down('#lun_enable_compression').checked) {
            mainView.down('#lun_compression_type').enable();
            me.onCompressSelect(mainView.down("#lun_compression_type").value);
        } else {
            mainView.down('#lun_compression_type').disable();
            mainView.down("#lun_enable_compression").pValue = 'disable';
        }
    },
    onCompressSelect: function (combo, record) {
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
        var comOptions = [
            "Enable",
            "Zero Reclaim",
            "Generic zero Reclaim"
        ];
        var tranOptions = [
            "enable",
            "gen_zero",
            "zero_reclaim"
        ];
        for (var i = 0; i < comOptions.length; i++) {
            if (record === undefined) {
                if (combo == comOptions[i]) {
                    mainView.down("#lun_enable_compression").pValue = tranOptions[i];
                    break;
                }
            } else {
                if (record.getData().CompressionType == comOptions[i]) {
                    mainView.down("#lun_enable_compression").pValue = tranOptions[i];
                    break;
                }
            }
        }
    },
    onCapacity: function () {
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
    },
    onChangeSlider: function (el, newVal, oldVal) {
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
        var unit = mainView.down('#lun_unit_size').value;
        var poolUsed = mainView.down('#lun_pool_used').value.split(unit)[0];
        if (newVal <= Number(poolUsed)) {
            mainView.down("#lun_capacity").setValue(Number(poolUsed));
            mainView.down("#pool_capacity").setValue(Number(poolUsed));
        }
    },
    onPoolNameChange: function (combo, records, index) {
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
        var poolStore = mainView.getViewModel('lunsetting').getStore('poolInfo');
        var size = mainView.down('#lun_capacity').value;
        var poolInfo = {};
        for (var i = 0; i < poolStore.getCount(); i++) {
            if (records.getData().pool_name == poolStore.getAt(i).getData().pool_name) {
                poolInfo = {
                    index: i,
                    avail_gb: poolStore.getAt(i).getData().avail_gb.toFixed(0),
                    avail_mb: poolStore.getAt(i).getData().avail_mb.toFixed(0),
                    used_gb: poolStore.getAt(i).getData().used_gb.toFixed(0),
                    used_mb: poolStore.getAt(i).getData().used_mb.toFixed(0),
                    total_gb: poolStore.getAt(i).getData().total_gb.toFixed(0),
                    total_mb: poolStore.getAt(i).getData().total_mb.toFixed(0)
                };
                break;
            }
        }
        switch (mainView.down('#lun_unit_size').value) {
        case 'TB':
            mainView.down('#lun_pool_size').setValue((poolInfo.total_gb / 1024).toFixed(3) + "TB");
            mainView.down('#lun_pool_used').setValue((poolInfo.used_gb / 1024).toFixed(3) + "TB");
            mainView.down('#lun_pool_available').setValue((poolInfo.avail_gb / 1024).toFixed(3) + "TB");
            mainView.down('#lun_capacity').setValue((poolInfo.avail_gb / 1024).toFixed(3));
            mainView.down("#pool_capacity").maxValue = (poolInfo.total_gb / 1024).toFixed(3);
            mainView.down("#pool_capacity").setValue((Number(poolInfo.used_gb) / 1024).toFixed(3));
            break;
        case 'GB':
            mainView.down('#lun_pool_size').setValue(poolInfo.total_gb + "GB");
            mainView.down('#lun_pool_used').setValue(poolInfo.used_gb + "GB");
            mainView.down('#lun_pool_available').setValue(poolInfo.avail_gb + "GB");
            mainView.down('#lun_capacity').setValue(poolInfo.avail_gb);
            mainView.down("#pool_capacity").maxValue = poolInfo.total_gb;
            mainView.down("#pool_capacity").setValue(Number(poolInfo.used_gb));
            break;
        }
        mainView.down("#pool_used_percent_bar").setValue(Number(poolInfo.used_gb) / Number(poolInfo.total_gb));
        mainView.down('#lun_pool_size').hValue = poolInfo.total_gb;
        mainView.down('#lun_pool_used').hValue = poolInfo.used_gb;
        mainView.down('#lun_pool_available').hValue = poolInfo.avail_gb;
    },
    onUnitSizeChange: function (combo, records, index) {
        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
        var size = mainView.down('#lun_pool_available').hValue;
        var total = mainView.down('#lun_pool_size').hValue;
        var used = mainView.down('#lun_pool_used').hValue;
        var avai = mainView.down('#lun_pool_available').hValue;
        switch (mainView.down('#lun_unit_size').value) {
        case 'TB':
            mainView.down('#lun_capacity').setValue((size / 1024).toFixed(3));
            mainView.down('#lun_pool_size').setValue((total / 1024).toFixed(3) + "TB");
            mainView.down('#lun_pool_used').setValue((used / 1024).toFixed(3) + "TB");
            mainView.down('#lun_pool_available').setValue((avai / 1024).toFixed(3) + "TB");
            mainView.down("#pool_capacity").maxValue = (total / 1024).toFixed(3);
            break;
        case 'GB':
            mainView.down('#lun_capacity').setValue(size);
            mainView.down('#lun_pool_size').setValue(total + "GB");
            mainView.down('#lun_pool_used').setValue(used + "GB");
            mainView.down('#lun_pool_available').setValue(avai + "GB");
            mainView.down("#pool_capacity").maxValue = total;
            break;
        }
    }
});
