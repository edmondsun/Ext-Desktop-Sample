Ext.define('DESKTOP.StorageManagement.iscsi.controller.GenerateWizardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.generatewizard',
    requires: [
    ],
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
        var lunView = Ext.ComponentQuery.query('#generateLunView')[0];
        if (lunView === undefined) {
            var propConfig;
            var configItemsArray = me.selectMode();
            me.configItemsArray = configItemsArray;
            me.propConfig = configItemsArray.pop();
            wizardView.hide();
            //mainView.remove(wizardView, true);
            mainView.setConfig(me.propConfig);
            mainView.add({
                items: configItemsArray
            });
            Ext.ComponentQuery.query('#generateLunView')[0].down("#lun_location").readOnly = false;
            return;
        }
        if (lunView.hasConfigView !== undefined) {
            lunView.show();
            wizardView.hide();
        }
    },
    selectMode: function () {
        var lunView, targetView;
        var lunInfo = {
                mode: "Wizard_Lun",
                action: "Create"
            },
            tarInfo = {
                mode: "Wizard_Target",
                action: "Create"
            };
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
        for (var i = 0; i < radioHandle.length; i++) {
            if (radioHandle[i].checked === false) {
                continue;
            }
            switch (i) {
            case 0:
            default:
                msg = "create a target and map a LUN";
                setWidth = 600;
                setHeight = 650;
                setIndex = 0;
                lunView = new DESKTOP.StorageManagement.iscsi.view.GeneralLun(lunInfo);
                targetView = new DESKTOP.StorageManagement.iscsi.view.GeneralTarget(tarInfo);
                responseArray.push(targetView);
                responseArray.push(lunView);
                break;
            case 1:
                msg = "create a target";
                setWidth = 600;
                setHeight = 450;
                setIndex = 1;
                targetView = new DESKTOP.StorageManagement.iscsi.view.GeneralTarget(tarInfo);
                responseArray.push(targetView);
                break;
            case 2:
                msg = "create a LUN";
                setWidth = 600;
                setHeight = 350;
                setIndex = 2;
                lunView = new DESKTOP.StorageManagement.iscsi.view.GeneralLun(lunInfo);
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
