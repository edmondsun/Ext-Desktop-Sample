Ext.define('DESKTOP.StorageManagement.iscsi.controller.GeneralTargetLunController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.targetlunsetting',
    requires: [],
    init: function () {
        var me = this;
        var configItemsArray = [];
        var newGetModules = me.view;
        var newConfigModules = [{
            title: 'Create a target and map a LUN',
            width: 600,
            height: 600
        }, {
            title: 'Create Target',
            width: 600,
            height: 450
        }, {
            title: 'Create LUN',
            width: 600,
            height: 350
        }, {
            title: 'Create Wizard',
            width: 600,
            height: 250
        }];
        var editConfigModules = [{
            title: 'Edit Target',
            width: 600,
            height: 450
        }, {
            title: 'Edit LUN',
            width: 600,
            height: 350
        }];
        var xtypeConfig = [{
            xtype: 'targetview'
        }, {
            xtype: 'lunview'
        }, {
            xtype: 'wizardview'
        }];
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
        var wizardNextConfigModules = [{
            text: 'Cancel',
            handler: 'onCancel'
        }, {
            text: 'Next',
            handler: 'onNext'
        }];
        var setBtnConfigModules = [{
            text: 'Cancel',
            handler: 'onCancel'
        }, {
            text: 'Confirm',
            handler: 'onConfirm'
        }];
        var btnModule = [
            'select_target_lun_btn',
            'select_lun_btn',
            'select_target_btn'
        ];
        newGetModules.removeAll();
        switch (newGetModules.name) {
        case 'Wizard':
            newGetModules.setConfig(newConfigModules[3]);
            configItemsArray.push(xtypeConfig[2]);
            break;
        }
        newGetModules.add({
            items: configItemsArray
        });
    },
    onNext: function () {
        var me = this;
        me.view.removeAll();
        var configItemsArray = me.selectMode();
        var propConfig = configItemsArray.pop();
        //me.view.removeAll();
        me.view.setConfig(propConfig);
        me.view.add({
            items: configItemsArray
        });
    },
    selectMode: function () {
        var xtypeConfig = [{
            xtype: 'targetview'
        }, {
            xtype: 'lunview'
        }];
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
                responseArray.push(xtypeConfig[0]);
                responseArray.push(xtypeConfig[1]);
                break;
            case 1:
                msg = "create a target";
                setWidth = 600;
                setHeight = 450;
                responseArray.push(xtypeConfig[0]);
                break;
            case 2:
                msg = "create a LUN";
                setWidth = 600;
                setHeight = 350;
                responseArray.push(xtypeConfig[1]);
                break;
            }
        }
        responseArray.push({
            xtype: 'buttongroup',
            buttons: wizardBtnConfigModules
        });
        responseArray.push({
            title: msg,
            width: setWidth,
            height: setHeight
        });
        return responseArray;
    }
});
