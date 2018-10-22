Ext.define('DESKTOP.Service.timemachine.controller.GeneralSettingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.generalsetting',
    init: function() {
        var me       = this;
        var form     = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var vol      = form.lookupReference('VOL_NAME_REF');
        var unit     = form.lookupReference('UNIT_REF');
        var capacity = form.lookupReference('CAPACITY_REF');
        var slider   = form.lookupReference('SLIDER_REF');
        
        vol.on('select',     me.onVolSelect,    me);
        unit.on('change',    me.unitConversion, me);
        capacity.on('keyup', me.onVolumeKeyUp,  me);
        slider.on('change',  me.sliderChange,   me);
    },
    formatUnit: function(unit) {
        var form       = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var volInfo    = form.getViewModel().get('vol_info');
        var formatSize = {};

        switch (unit) {
        case 'TB':
            formatSize.total = parseFloat(volInfo.total) / 1024;
            formatSize.avail = parseFloat(volInfo.avail) / 1024;
            formatSize.used  = parseFloat(volInfo.used)  / 1024;
            break;
        
        case ' GB':
        default:    
            formatSize.total = parseFloat(volInfo.total);
            formatSize.avail = parseFloat(volInfo.avail);
            formatSize.used  = parseFloat(volInfo.used);
            break;    
        }

        return formatSize;
    },
    unitConversion: function(field, newVal, oldVal) {
        var showSize;
        var curCapacity;
        var me         = this;
        var form       = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var volInfo    = form.getViewModel().get('vol_info');
        var capacity   = form.down('#capacity_gb');

        form.getViewModel().set('vol_trans.times', false);

        formatSize = me.formatUnit(newVal);

        switch (newVal) {
        case 'TB':
            showSize    = (parseFloat(capacity.value) + parseFloat(volInfo.used)) / 1024; 
            curCapacity = parseFloat(capacity.value) / 1024;
            break;
        
        case ' GB':
        default:    
            showSize    = parseFloat(capacity.value) * 1024 + parseFloat(volInfo.used); 
            curCapacity = parseFloat(capacity.value) * 1024;
            break;    
        }

        form.down('#vol_slider').setMaxValue(formatSize.total);
        form.down('#capacity_gb').setValue(curCapacity);

        form.getViewModel().set('vol_trans.total', formatSize.total + newVal);
        form.getViewModel().set('vol_trans.avail', formatSize.avail + newVal);
        form.getViewModel().set('vol_trans.used',  formatSize.used  + newVal);
        
        if (curCapacity > formatSize.avail) {
            capacity.markInvalid(capacity.regexText);
            showSize = formatSize.total; 
        }

        form.getViewModel().set('vol_trans.showUsed', showSize);
    },
    onVolumeKeyUp: function (self, e, eOpts) {
        var showSize;
        var formatSize;
        var me         = this;
        var form       = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var volInfo    = form.getViewModel().get('vol_info');
        var unit       = form.down('#vol_unit').value;
        var capacity   = form.down('#capacity_gb');  
        var volModInfo = form.getViewModel().get('vol_trans');

        form.getViewModel().set('vol_trans.times', false);

        if (capacity.value.trim() == "") {
            capacity.markInvalid(capacity.regexText);
            return;
        }

        formatSize = me.formatUnit(unit);

        switch (unit) {
        case 'TB':
            showSize    = (parseFloat(capacity.value) + parseFloat(volInfo.used))/ 1024; 
            curCapacity = parseFloat(capacity.value) / 1024;
            break;

        case 'GB':
            showSize    = parseFloat(capacity.value) + parseFloat(volInfo.used); 
            curCapacity = parseFloat(capacity.value);
            break;
        }

        if (curCapacity > formatSize.avail) {
            capacity.markInvalid(capacity.regexText);
            showSize = formatSize.total; 
        }      

        form.down('#vol_slider').setMaxValue(formatSize.total);
        form.getViewModel().set('vol_trans.showUsed', showSize);
    },
    sliderChange: function(slider, newVal, thumb, eOpts) {
        var curCapacity;
        var formatSize;
        var me         = this;
        var form       = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var volInfo    = form.getViewModel().get('vol_info');
        var unit       = form.down('#vol_unit').value;
        var volModInfo = form.getViewModel().get('vol_trans');

        if (!volModInfo.times) {
            form.getViewModel().set('vol_trans.times', true);
            return;
        }        

        formatSize = me.formatUnit(unit);

        switch (unit) {
        case 'TB':
            showSize    = parseFloat(newVal); 
            curCapacity = (parseFloat(newVal)*1024 - parseFloat(volInfo.used)) / 1024;
            break;
        
        case ' GB':
        default:    
            showSize    = parseFloat(newVal); 
            curCapacity = parseFloat(newVal) - parseFloat(volInfo.used);
            break;    
        }
        
        if (showSize < formatSize.used) {
            showSize    = formatSize.used; 
            curCapacity = 0;
        } else if (showSize == formatSize.total) {
            curCapacity = formatSize.avail;
        }

        form.getViewModel().set('vol_trans.showUsed', showSize);   
        form.down('#vol_slider').setValue(showSize);
        form.down('#capacity_gb').setValue(curCapacity);
    },
    onVolSelect: function (comboHandle, record) {
        var items;
        var totalSize;
        var availSize;
        var curCapacity;
        var formatString;
        var volInfo    = {
                avail : 0,
                total : 0,
                used  : 0
            };
        var afpInfo    = Ext.data.StoreManager.lookup('generalAFP').ori_general_afp_data;
        var indx       = 0;
        var select     = comboHandle ? comboHandle.getValue() : 'Select...';
        var form       = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var unit       = form.down('#vol_unit').value;
        var capacity   = form.down('#capacity_gb');

        form.getViewModel().set('vol_trans.times', false);

        if (select.indexOf('Select...') == -1) {
            for (var i=0; i < afpInfo.volume_info.length; i++) {
                if (afpInfo.volume_info[i].vol_name == record.data.name) {
                    indx = i;
                    break;
                }
            }
        }

        if (afpInfo.volume_info.length != 0) {
            volInfo = {
                avail : afpInfo.volume_info[indx].avail_gb,
                total : afpInfo.volume_info[indx].total_gb,
                used  : afpInfo.volume_info[indx].used_gb
            }
        }

        if (afpInfo.volume_info[indx].pool_name == afpInfo.pool_name && 
            afpInfo.volume_info[indx].vol_name == afpInfo.volume_name) {

            capacity.reset();
        } else {

            capacity.setValue(0);
        }

        switch (unit) {
        case 'TB':
            showSize    = parseFloat(volInfo.used)   / 1024; 
            totalSize   = parseFloat(volInfo.total)  / 1024;
            availSize   = parseFloat(volInfo.avail)  / 1024;
            curCapacity = parseFloat(capacity.value) / 1024;
            break;

        case 'GB':
            showSize    = parseFloat(volInfo.used); 
            totalSize   = parseFloat(volInfo.total);
            availSize   = parseFloat(volInfo.avail);
            curCapacity = parseFloat(capacity.value);
            break;
        }

        formatString = Ext.clone(volInfo);

        Ext.Object.each(formatString, function(key, value, myself) {
            if (key != 'times' && key != 'showUsed') {
                myself[key] = myself[key] + unit;
            }
        });

        form.down('#vol_slider').setMaxValue(totalSize);
        form.down('#capacity_gb').setValue(curCapacity);
        form.getViewModel().set('vol_info',  volInfo);
        form.getViewModel().set('vol_trans', formatString);
        form.getViewModel().set('vol_trans.showUsed', showSize);
    },
    dirtycheck: function () {
        var checkFlag = false;
        var checkCol  = ['afp_enable', 'volume_name', 'capacity_gb'];
        var mainView  = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var afp       = Ext.data.StoreManager.lookup('generalAFP');
        var cmpA;
        var cmpB;

        for (var i=0; i < checkCol.length; i++) {
            cmpA = mainView.down('#' + checkCol[i]).value;
            cmpB = afp.ori_general_afp_data[checkCol[i]];

            cmpA = (cmpA === null || cmpA === 'Select...') ? null : cmpA.toString();
            cmpB = (cmpB === null) ? null : cmpB.toString();

            if (cmpA != cmpB) {
                checkFlag = true;
                break;
            }
        }

        return checkFlag;
    },
    on_Apply_All: function (form, me) {
        var size;
        var self      = this;
        var mainView  = Ext.ComponentQuery.query('#GeneralSetting')[0];
        var form      = mainView.down('form').getForm();
        var appwindow = me;
        var unit      = mainView.down('#vol_unit').value;
        var capacity  = mainView.down('#capacity_gb').value;
        var enable    = mainView.down('#afp_enable').value;
        var afp       = Ext.data.StoreManager.lookup('generalAFP');

        if (!form.isValid()) {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
            return;
        }

        formatSize = self.formatUnit(unit);

        if (enable == 'true') {
            if (formatSize.avail < capacity) {
                Ext.Msg.alert('Invalid Data', 'Please input valid capacity size');
                return;
            }
        }

        switch (unit) {
        case 'TB':
            size = parseFloat(capacity)*1024*1024;        
            break;

        case 'GB':
        default:
            size = parseFloat(capacity)*1024;
            break;        
        }
        
        mainView.down('#submit_size_mb').setValue(size);       

        appwindow.showLoadingMask();

        form.submit({
            url: 'app/Service/backend/timemachine/TimeMachine.php',
            method: 'POST',
            params: {
                op: 'afp_general_write'
            },
            success: function (form, action) {
                appwindow.hideLoadingMask();
                afp.load();

                if (Ext.JSON.decode(action.response.responseText).success === false) {
                    var msg = Ext.JSON.decode(response.responseText).msg;
                    Ext.Msg.alert("Error", msg);
                } else {
                    appwindow.getresponse(0, 'GeneralSetting');
                }
            },
            failure: function (form, action) {
                appwindow.hideLoadingMask();
                var msg = (Ext.JSON.decode(action.response.responseText)).msg;
                var ref = msg;
                appwindow.getresponse(ref, 'GeneralSetting');
            }
        });
    }
});
