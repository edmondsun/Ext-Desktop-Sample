Ext.define('DESKTOP.Service.timemachine.model.GeneralSettingModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.generalsetting',
    data: {
        general_afp_data : null,
        vol_info         : null,
        vol_trans        : null
    },
    stores: {
        generalAFP: {
            storeId: 'generalAFP',
            ori_general_afp_data: null,
            fields: [   
                        'name',
                        'afp_enable', 
                        'pool_name', 
                        'volume_name',
                        'capacity_mb',
                        {
                            name: 'capacity_gb',
                            calculate: function(data) {
                                return data.capacity_mb / 1024;
                            }
                        }
                    ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/Service/backend/timemachine/TimeMachine.php',
                method: 'GET',
                extraParams: {
                    op: 'afp_general_read'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }            
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {    
                        var formatString;
                        var prsentData  = {};
                        var volProperty = {};
                        var form        = Ext.ComponentQuery.query('#GeneralSetting')[0];
                        var generalAFP  = Ext.data.StoreManager.lookup('generalAFP');
                        var volInfo     = records[0].data.volume_info;
                        var last        = (volInfo.length != 0) ? (volInfo.length-1) : null;
                        var unit        = form.down('#vol_unit');
                        var capacity    = form.down('#capacity_gb');
                        var items       = (last === null) ? [{'name': 'None'}] : [];
                        var curIndx;
                        
                        unit.setValue('GB');

                        for (var i=0; i < volInfo.length; i++) {
                            if (volInfo[i].pool_name != store.getAt(0).data.pool_name &&
                                volInfo[i].vol_name != store.getAt(0).data.volume_name) {

                                capacity.setValue(0);
                            } else if (volInfo[i].pool_name == store.getAt(0).data.pool_name &&
                                       volInfo[i].vol_name == store.getAt(0).data.volume_name) {

                                curIndx = i; 
                                continue;
                            }
                        }
                        
                        if (records[0].data.afp_enable == 'true') {
                            volProperty.total    = (last !== null) ? records[0].data.volume_info[curIndx].total_gb : 0;
                            volProperty.used     = (last !== null) ? records[0].data.volume_info[curIndx].used_gb  : 0;
                            volProperty.avail    = (last !== null) ? records[0].data.volume_info[curIndx].avail_gb : 0;
                            volProperty.showUsed = (last !== null) ? records[0].data.volume_info[curIndx].used_gb  : 0;
                        } else {
                            form.down('#volume_name').setValue('Select...');
                            volProperty.total    = 0;
                            volProperty.used     = 0;
                            volProperty.avail    = 0;
                            volProperty.showUsed = 0;
                        }

                        volProperty.times = false;

                        form.getViewModel().set('general_afp_data', records[0].data);
                        form.getViewModel().set('vol_info',         volProperty);

                        formatString = Ext.clone(volProperty);

                        Ext.Object.each(formatString, function(key, value, myself) {
                            if (key != 'times' && key != 'showUsed') {
                                myself[key] = myself[key] + 'GB';
                            }
                        });

                        form.getViewModel().set('vol_trans', formatString);

                        form.down('#vol_slider').setMaxValue(volProperty.total);
                        form.down('#vol_slider').setValue(volProperty.used);
                        
                        generalAFP.ori_general_afp_data = Ext.clone(records[0].data);

                        for (var i=0; i < volInfo.length; i++) {
                            if (volInfo[i].vol_name === null) {
                                continue;
                            }

                            items.push({'name': volInfo[i].vol_name});
                        }
                        
                        var combo    = form.down('#volume_name');
                        var volStore = Ext.create('Ext.data.Store', {
                                         fields: ['name'],
                                         data: items
                                       });
                        
                        combo.bindStore(volStore);
                        
                        if (records[0].data.afp_enable == 'true') {                                        
                            form.getForm().loadRecord(store.getAt(0));
                        }
                    }
                }
            }
        }
    }
});
