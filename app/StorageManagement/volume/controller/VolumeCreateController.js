Ext.define('DESKTOP.StorageManagement.volume.controller.VolumeCreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.volumecreate',
    init: function() {
        var me         = this;
        var mainView   = Ext.ComponentQuery.query('#volumeCreate')[0];
        var volSize    = mainView.lookupReference('create_volume_size');
        var poolSlider = mainView.lookupReference('create_pool_slider');

        mainView.getViewModel('volume').getStore('poolInfo').reload();

        volSize.on('blur',     me.onVolumeSize, me);
        poolSlider.on('change', me.sliderChange, me);
    },
    onVolumeSize: function(self, e, eOpts) {
    	
        var mainView  = Ext.ComponentQuery.query('#volumeCreate')[0];
        var unit      = mainView.down('#create_pool_unit').value;
        var curSize   = Number(mainView.down("#create_volume_size").getValue().split(unit)[0]);
        var poolUsed  = mainView.down('#create_pool_used_size').hiddenValue;
        var poolAvail = mainView.down('#create_pool_available_size').hiddenValue;
        var poolSize  = mainView.down('#create_pool_total_size').hiddenValue;

        switch(unit) {
        case 'TB':
            poolSize = poolSize/1024;
            poolUsed = poolUsed/1024;
            mainView.down("#create_volume_size").hiddenValue = curSize*1024;
            break;

        case 'GB':
            mainView.down("#create_volume_size").hiddenValue = curSize;
            break;
        }

        if (curSize < poolAvail) {
            mainView.down("#create_pool_slider").setValue(curSize + poolUsed);
        } else {
            mainView.down("#create_volume_size").setValue(poolAvail);
            mainView.down("#create_pool_slider").setValue(poolSize);
        }
    },
    sliderChange: function(slider, newValue, thumb, eOpts) {

		var mainView  = Ext.ComponentQuery.query('#volumeCreate')[0];
		var unit      = mainView.down('#create_pool_unit').value;
		var curSize   = mainView.down('#create_pool_slider').getValue();
		var poolSize  = mainView.down('#create_pool_total_size').hiddenValue;
		var poolUsed  = mainView.down('#create_pool_used_size').hiddenValue;
		var poolAvail = mainView.down('#create_pool_available_size').hiddenValue;
		var poolInfo  = [];
		var curAvail;

		switch(unit) {
		case 'TB':
		    poolInfo['poolSize']  = poolSize/1024;
		    poolInfo['poolUsed']  = poolUsed/1024;
		    poolInfo['poolAvail'] = poolAvail/1024;
		    if ((curSize != 0) && (curSize*1024 - poolUsed) > 0)
		        mainView.down("#create_volume_size").hiddenValue = curSize*1024 - poolUsed;
		    else
		        mainView.down("#create_volume_size").hiddenValue = 0;
		    break;

		case 'GB':
		    poolInfo['poolSize']  = poolSize;
		    poolInfo['poolUsed']  = poolUsed;
		    poolInfo['poolAvail'] = poolAvail;
		    if ((curSize != 0) && (curSize*1024 - poolUsed) > 0)
		        mainView.down("#create_volume_size").hiddenValue = curSize - poolUsed;
		    else
		        mainView.down("#create_volume_size").hiddenValue = 0;
		    break;    
		}

		if (newValue <= poolInfo.poolUsed) {
		    mainView.down("#create_pool_slider").setValue(poolInfo.poolUsed);
		    mainView.down("#create_volume_size").setValue(0);
		} else {
		    curAvail = newValue - poolInfo.poolUsed;

		    if (curAvail <= poolInfo.poolAvail) {
		        mainView.down("#create_volume_size").setValue(curAvail.toFixed(2));
		    } else {
		        mainView.down("#create_volume_size").setValue(poolInfo.poolAvail);
		    }
		    
		}
    },
    afterview: function() {
        
        var me       = this;
        var poolVM   = me.getViewModel();
        var poolInfo = poolVM.getStore('poolInfo');

        poolInfo.selfVM = poolVM;
    },
    onPoolLocationClick: function(field, record, eOpts) {
        
        var poolSize = {};
        var mainView = Ext.ComponentQuery.query('#volumeCreate')[0];
        var poolUnit = field.up('form').down('#create_pool_unit').getValue();

        poolSize.totalSize = record.data.total_gb;
        poolSize.usedSize  = record.data.used_gb;
        poolSize.availSize = record.data.avail_gb;

        mainView.down('#create_pool_total_size').hiddenValue     = record.get('total_gb');
        mainView.down('#create_pool_used_size').hiddenValue      = record.get('used_gb');
        mainView.down('#create_pool_available_size').hiddenValue = record.get('avail_gb');  

        mainView.getController().unitConversion(field, poolSize, poolUnit);
    },
    onPoolUnitClick: function(field, newVal, oldVal) {
        
        var poolRecord;
        var me       = this;  
        var poolSize = {};
        var mainView = Ext.ComponentQuery.query('#volumeCreate')[0];
        var poolInfo = me.getViewModel().getStore('poolInfo');
        
        poolRecord         = poolInfo.findRecord('pool_name', field.up('form').down('#create_pool_name').getValue());
        poolSize.totalSize = poolRecord.data.total_gb;
        poolSize.usedSize  = poolRecord.data.used_gb;
        poolSize.availSize = poolRecord.data.avail_gb;

        mainView.getController().unitConversion(field, poolSize, newVal);
    },
    unitConversion: function(field, poolSize, poolUnit) {
        
        var me       = this;
        var form     = field.up('form');
        var curSize  = Number(form.down('#create_volume_size').hiddenValue);

        switch(poolUnit) {
        case 'TB':
            me.getViewModel().set('PoolSize',      (poolSize.totalSize/1024).toFixed(2) + 'TB');
            me.getViewModel().set('PoolUsed',      (poolSize.usedSize/1024).toFixed(2)  + 'TB');
            me.getViewModel().set('PoolAvailable', (poolSize.availSize/1024).toFixed(2) + 'TB');      

            form.down('#create_volume_size').setValue((curSize/1024).toFixed(2));
            form.down('#create_pool_slider').maxValue = (poolSize.totalSize/1024);
            form.down('#create_pool_slider').value    = (poolSize.usedSize + curSize)/1024;    
            break;

        case 'GB':
            me.getViewModel().set('PoolSize',      (poolSize.totalSize).toFixed(2) + 'GB');
            me.getViewModel().set('PoolUsed',      (poolSize.usedSize).toFixed(2)  + 'GB');
            me.getViewModel().set('PoolAvailable', (poolSize.availSize).toFixed(2) + 'GB');        

            form.down('#create_volume_size').setValue((curSize).toFixed(2));
            form.down('#create_pool_slider').maxValue = poolSize.totalSize;
            form.down('#create_pool_slider').value    = (poolSize.usedSize + curSize);
            break;    
        }
    },
    onApply: function() {

        var mainView = Ext.ComponentQuery.query('#volumeCreate')[0];
        var topView  = Ext.ComponentQuery.query('#Volume')[0];
        var form     = mainView.down('form').getForm();
        var me       = this;
        var win      = me.getView();
        var mask = new Ext.LoadMask({
            msg: 'Saving...',
            target: win
        });

        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }

        var volumeSize = mainView.down('#create_volume_size').getValue();
        var volumeName = form.findField('name').getSubmitValue();
        var volumeUnit = mainView.down('#create_pool_unit').getValue();

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
                op: 'volume_create'
            },
            success: function (form, action) {
                topView.getViewModel().getStore('poolInfo').load();
                topView.getViewModel().getStore('volumeInfo').load();
                Ext.Msg.alert('Success', 'Create volume success');
                mainView.destroy();
                mask.destroy();
            },
            failure: function (form, action) {
                topView.getViewModel().getStore('poolInfo').load();
                topView.getViewModel().getStore('volumeInfo').load();
                Ext.Msg.alert('Failed', 'Failed to create volume: '+ volumeName);
                mainView.destroy();
                mask.destroy();
            }
        });
    }
});
