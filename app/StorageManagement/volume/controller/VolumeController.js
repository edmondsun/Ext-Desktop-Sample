Ext.define('DESKTOP.StorageManagement.volume.controller.VolumeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.volume',
    requires: [
        'DESKTOP.StorageManagement.volume.view.VolumeExpand'
    ],
    init: function() {
        var mainView = Ext.ComponentQuery.query('#Volume')[0];

        mainView.getViewModel().getStore('poolInfo').load();
        mainView.getViewModel().getStore('volumeInfo').load();

        this.globalButton = [{
            defaultName : 'Create',
            nameIndex   : 'CreateVolume',
            handler     : 'onCreateVolume'
        }];

        if (mainView.down('#notify_enable').checked) {
            mainView.down('#capacity_notification').enable();    
        } else {
            mainView.down('#capacity_notification').disable();    
        }
    },
    onNotifyChange: function (el,newVal,eOpts) {
        
        var mainView = Ext.ComponentQuery.query('#Volume')[0];
        var me       = this;
        var boolEdit = newVal ? true : false;

        if (newVal) {
            mainView.down('#capacity_notification').enable();    
        } else {
            mainView.down('#capacity_notification').disable();    
        }
    },
    onCreateVolume: function() {

        var volumeView;

        volumeView = Ext.create('DESKTOP.StorageManagement.volume.view.VolumeCreate', {
                        titleAlign:'center',
                        title: 'Create Volume',
                        modal: true
                     });  

        volumeView.show();
    },
    onExpand: function() {

        var volumeView;
        var poolRecord;
        var me       = this;
        var mainView = Ext.ComponentQuery.query('#Volume')[0];
        var poolInfo = me.getViewModel().getStore('poolInfo');
        
        poolRecord   = poolInfo.findRecord('pool_name', mainView.down('#tree_pool').getSelectionModel().getSelection()[0].data.text);

        volumeView = Ext.create('DESKTOP.StorageManagement.volume.view.VolumeExpand', {
                        titleAlign:'center',
                        title: 'Expand Volume',
                        modal: true,
                        seletedVol: mainView.down('#tree_volume').getSelectionModel().getSelection()[0],
                        seletedPool: poolRecord
                     });  
        volumeView.show();
    },
    onDelete: function() {

        var msg;
        var me         = this;
        var win        = me.getView();
        var mainView   = Ext.ComponentQuery.query('#Volume')[0];
        var seletedVol = mainView.down('#tree_volume').getSelectionModel().getSelection()[0];

        Ext.Msg.show({
            title: 'Delete Volume Confirm',
            message: "Are you sure that you want to delete " + seletedVol.data.vol_name + " ?",
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
                        url: 'app/StorageManagement/backend/volume/Volume.php',
                        method: 'POST',
                        params: {
                            op        : 'volume_delete',
                            pool_name : seletedVol.data.pool_name,
                            name      : seletedVol.data.vol_name
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
    onPoolTreeClick: function (me, record) {

        var treepanel_store = Ext.ComponentQuery.query('#tree_volume')[0].getStore();

        treepanel_store.clearFilter();

        treepanel_store.filterBy(function (rec, index) {
            if (rec.get('pool_name') === record.get('text'))
                return true;
            return false;
        });
    },
    onVolumeTreeClick: function (me, record) {

        var pieStore   = this.getViewModel().getStore('pie');
        var pieData    = [];
        var freeGB     = {
            name     : 'Free',
            capacity : record.data.avail_gb
        };
        var usedGB     = {
            name     : 'Used',
            capacity : record.data.used_gb
        };
        var notifyInfo = {
            null  : false,
            false : false,
            true  : true
        };
        var mainView   = Ext.ComponentQuery.query('#Volume')[0];
        var expandBtn  = mainView.down('#expand_button');
        var deleteBtn  = mainView.down('#delete_button');

        pieData.push(freeGB);
        pieData.push(usedGB);
        pieStore.loadData(pieData);        

        expandBtn.enable();
        deleteBtn.enable();
        
        this.getViewModel().set('VolumeName',      record.data.text);
        this.getViewModel().set('TotalSize',       record.data.total_gb);
        this.getViewModel().set('FreeGB',          record.data.avail_gb);
        this.getViewModel().set('UsedGB',          record.data.used_gb);
        this.getViewModel().set('FreePer',         record.data.avail_ratio);
        this.getViewModel().set('UsedPer',         record.data.used_ratio);
        this.getViewModel().set('Notify',          notifyInfo[record.data.threshold_notice_enable]);
        this.getViewModel().set('Info',            record.data.threshold_info_level);
        this.getViewModel().set('Warn',            record.data.threshold_warn_level);
        this.getViewModel().set('NotifyThreshold', [record.data.threshold_info_level, record.data.threshold_warn_level]);
    },
    onSliderChange: function (el,newVal,eOpts) {

        var mainView = Ext.ComponentQuery.query('#Volume')[0];
        var setInfo  = el.getValues()[0];
        var setWarn  = el.getValues()[1];
        var me       = this;

        if (el.getValues()[0] == el.getValues()[1]) {
            if (el.getValues()[0] === 0) {
                setInfo = 0;
                setWarn = el.getValues()[0] + 1;
            }else if (el.getValues()[0] == 100) {
                setInfo = el.getValues()[0] - 1;
                setWarn = 100;
            } else {
                setInfo = el.getValues()[0];
                setWarn = el.getValues()[1] + 1;
            }
        }

        me.getViewModel().set('Info', setInfo);
        me.getViewModel().set('Warn', setWarn);
        mainView.down("#capacity_notification").setValue(0,setInfo);
        mainView.down("#capacity_notification").setValue(1,setWarn);
    },
    on_Apply_All: function (form, me) {
        
        var operation;
        var paramInfo  = {};
        var appwindow  = me;
        var selfThis   = this;
        var win        = selfThis.getView();
        var mainView   = Ext.ComponentQuery.query('#Volume')[0];
        var seletedVol = mainView.down('#tree_volume').getSelectionModel().getSelection()[0];

    
        if (mainView.down("#notify_enable").checked == false) {
            paramInfo = {
                op        : "volume_disable_threshold",
                pool_name : seletedVol.get('pool_name'),
                name      : seletedVol.get('vol_name')
            }
        } else {
            paramInfo = {
                op         : "volume_enable_threshold",
                pool_name  : seletedVol.get('pool_name'),
                name       : seletedVol.get('vol_name'),
                info_level : mainView.down("#vol_info").getValue().split('%')[0],
                warn_level : mainView.down("#vol_warn").getValue().split('%')[0]
            }
        }

        var mask = new Ext.LoadMask({
            msg: 'Waiting...',
            target: win
        });

        mask.show();

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/volume/Volume.php',
            method: 'POST',
            params: paramInfo,
            success: function (response) {
                
                Ext.defer(function() {
                    mask.destroy();
                }, 300);
                mainView.getViewModel().getStore('poolInfo').load();
                mainView.getViewModel().getStore('volumeInfo').load();

                if (Ext.JSON.decode(response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'Volume');
                }
            },
            failure: function (response) {
                mask.destroy();
                Ext.Msg.alert('Failed', response.responseText);
            }
        });
    },
    addGlobalButton: function(windowEl, panelEl) {
        windowEl.getController().addItemtoToolbarGlobalButton(windowEl, panelEl, this.globalButton);
    }
});
