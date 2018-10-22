Ext.define('DESKTOP.StorageManagement.volume.controller.VolumeExpandController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.volumeexpand',
    init: function() {

        var me         = this;
        var volHandle  = me.getView().config.seletedVol;
        var poolHandle = me.getView().config.seletedPool;
        var mainView   = Ext.ComponentQuery.query('#volumeExpand')[0];

        mainView.down('#volume_name').setValue(volHandle.data.vol_name);
        mainView.down('#expand_pool_name').setValue(volHandle.data.pool_name);
        mainView.down('#expand_volume_size').setValue(0);
        mainView.down('#expand_pool_slider').setMaxValue(poolHandle.data.total_gb);
        mainView.down('#expand_pool_slider').setValue(poolHandle.data.used_gb.toFixed(2));

        me.getViewModel().set('PoolSize',      (poolHandle.data.total_gb).toFixed(2) + 'GB');
        me.getViewModel().set('PoolUsed',      (poolHandle.data.used_gb).toFixed(2)  + 'GB');
        me.getViewModel().set('PoolAvailable', (poolHandle.data.avail_gb).toFixed(2) + 'GB');  

        mainView.down('#expand_pool_size').hiddenValue  = poolHandle.data.total_gb;
        mainView.down('#expand_pool_used').hiddenValue  = poolHandle.data.used_gb;
        mainView.down('#expand_pool_avail').hiddenValue = poolHandle.data.avail_gb;    
    },
    onPoolUnitClick: function(field, newVal, oldVal) {
        
        var me         = this;  
        var poolSize   = {};
        var mainView   = Ext.ComponentQuery.query('#volumeExpand')[0];
        var poolHandle = me.getView().config.seletedPool;

        poolSize.totalSize = poolHandle.data.total_gb;
        poolSize.usedSize  = poolHandle.data.used_gb;
        poolSize.availSize = poolHandle.data.avail_gb;

        mainView.getController().unitConversion(field, poolSize, newVal);
    },
    unitConversion: function(field, poolSize, poolUnit) {
        
        var me       = this;
        var form     = field.up('form');
        var curSize  = Number(form.down("#expand_volume_size").hiddenValue);

        switch(poolUnit) {
        case 'TB':
            me.getViewModel().set('PoolSize',      (poolSize.totalSize/1024).toFixed(2) + 'TB');
            me.getViewModel().set('PoolUsed',      (poolSize.usedSize/1024).toFixed(2)  + 'TB');
            me.getViewModel().set('PoolAvailable', (poolSize.availSize/1024).toFixed(2) + 'TB');      

            form.down('#expand_volume_size').setValue((curSize/1024).toFixed(2));
            form.down('#expand_pool_slider').maxValue = (poolSize.totalSize/1024);
            form.down('#expand_pool_slider').value = (poolSize.usedSize + curSize)/1024;
            break;

        case 'GB':
            me.getViewModel().set('PoolSize',      (poolSize.totalSize).toFixed(2) + 'GB');
            me.getViewModel().set('PoolUsed',      (poolSize.usedSize).toFixed(2)  + 'GB');
            me.getViewModel().set('PoolAvailable', (poolSize.availSize).toFixed(2) + 'GB');      

            form.down('#expand_volume_size').setValue((curSize).toFixed(2));
            form.down('#expand_pool_slider').maxValue = poolSize.totalSize;
            form.down('#expand_pool_slider').value    = (poolSize.usedSize + curSize);
            break;    
        }
    },
    onCancel: function() {
        
        var mainView = Ext.ComponentQuery.query('#volumeExpand')[0];
        mainView.close();
    }, 
    onApply: function() {

        var mainView = Ext.ComponentQuery.query('#volumeExpand')[0];
        var me       = this;
        var win      = me.getView();
        var form     = mainView.down('form').getForm();
        var mask     = new Ext.LoadMask({
            msg: 'Saving...',
            target: win
        });

        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }

        var volumeName = mainView.down('#volume_name').getValue();
        var volumeSize = mainView.down('#expand_volume_size').getValue();
        var volumeUnit = mainView.down('#expand_pool_unit').getValue();

        if (volumeSize == 0) {
            Ext.Msg.alert('Volume Size', 'Please input none zero size.');
            return;
        }

        mask.show();

        switch(volumeUnit) {
        case 'TB':
            form.findField('size_mb').setValue(volumeSize*1024*1024);
            break;
        case 'GB':
            form.findField('size_mb').setValue(volumeSize*1024);
            break;
        }

        form.submit({
            url: 'app/StorageManagement/backend/volume/Volume.php',
            method: 'post',
            params: {
                op: 'volume_expand',
                name: mainView.down('#volume_name').getValue()
            },
            success: function (form, action) {
                mainView.getViewModel().getStore('poolInfo').load();
                mainView.getViewModel('volume').getStore('volumeInfo').load();
                Ext.Msg.alert('Success', 'Expand volume success');
                mainView.destroy();
                mask.destroy();
            },
            failure: function (form, action) {
                mainView.getViewModel().getStore('poolInfo').load();
                mainView.getViewModel('volume').getStore('volumeInfo').load();
                Ext.Msg.alert('Failed', 'Failed to expand volume: '+ volumeName);
                mainView.destroy();
                mask.destroy();
            }
        });   
    }
});
