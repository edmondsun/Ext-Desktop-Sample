Ext.define('DESKTOP.StorageManagement.ssdcache.model.SsdCacheCreateModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.ssdcachecreate',
    requires: [],
    data: {
        mask: '',
        render_time: 0,
        reload: true
    },
    stores: {
        SSD_info: {
            fields: [''],
            storeId: 'ssd_info',
            autoDestroy: true,
            autoLoad: true,
            autoSync: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/ssdcache/SsdCache.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function (store, records, success) {
                    if (success) {
                        var win = Ext.ComponentQuery.query('#ssdcacheCreate')[0],
                            record = records[0],
                            diskNum = 0;
                        if (record.data.data.length > 0 && typeof (record.data.data[0]) !== 'undefined') {
                            var pd_arr = record.data.data[0].pd_arr;
                            Ext.each(pd_arr, function (obj, index) {
                                if (obj.pool) {
                                    obj.selection = true;
                                    diskNum++;
                                } else {
                                    obj.selection = false;
                                }
                            });
                            store.loadData(pd_arr);


                            /* Need to check propose*/
                            if (typeof (this.view.filter_arr) !== 'undefined') {
                                store.filterBy(function (val) {
                                    var resul = [];
                                    this.view.filter_arr.map(function (rec) {
                                        if (rec.localeCompare(val.data.pd_id) === 0)
                                            resul.push("1");
                                    });
                                    if (resul.length === 0)
                                        return true;
                                });
                            }
                            /**/

                            // if (diskNum > 0) {
                            //     var raidType = win.getController().on_checkRaidType(diskNum, win.op);
                            //     Ext.getStore('raid_type').loadData(raidType);
                            // }
                            win.down('#grid_ssd').setVisible(true);
                            win.down('#con_RaiType').setVisible(true);
                        } else {
                            win.down('#label_noAvail').setVisible(true);
                        }
                    } else {
                        Ext.Msg.alert('Session expired', 'Session expired. Please login again.');
                    }
                }
            }
        },
        pool_info: {
            fields: ['pool_name'],
            autoDestroy: true,
            autoLoad: true,
            // autoSync: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/pool/Pool.php',
                method: 'GET',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    rootProperty: 'data'
                }
            },
            listeners: {
                load: function (store, records, success) {
                    if (success) {
                        if (store.count() > 0) {
                            var win = Ext.ComponentQuery.query('#ssdcacheCreate')[0];
                            var mask = new Ext.LoadMask({
                                msg: 'Please wait processing your request',
                                target: win
                            });
                            mask.show();
                            win.down('#combo_pool').setValue(records[0].get('pool_name'));
                            mask.destroy();
                        }
                    } else {
                        Ext.Msg.alert('Session expired', 'Session expired. Please login again.');
                    }
                }
            }
        }
    }
});
