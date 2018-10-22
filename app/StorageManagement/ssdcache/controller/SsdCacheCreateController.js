Ext.define('DESKTOP.StorageManagement.ssdcache.controller.SsdCacheCreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ssdcachecreate',
    requires: [],
    init: function () {
        /* initial configure
        op -> default Create , Create/Edit
        pool_name -> default ''
        cache_type -> default 'Both' , Both/Read/Write
        caller ->   [optional]  for freshing the caller's store
        store ->    [optional]  for freshing the caller's store
        -------------------------------------------------------
        example :
        var info ={
            op: 'Create',
            cache_type: 'Both',
            caller: 'SsdCache',
        };
        var window = new DESKTOP.StorageManagement.ssdcache.view.SsdCacheCreate(info);
        window.show;
        -------------------------------------------------------
        */
        var ssdcacheWindow = this.getView(),
            op = this.view.op,
            cache_type = this.view.cache_type,
            ssd_store = this.getStore('SSD_info'),
            pool_name = this.view.pool_name,
            comboChoice = [];
        /*  For using this.view in SSD_info store */
        ssd_store.view = this.view;
        if (op === 'Edit') {
            ssdcacheWindow.setConfig({
                title: 'Edit SSD Cache'
            });
            /*Set query cache type*/
            if (cache_type === 'Write') {
                ssd_store.proxy.extraParams = {
                    op: 'get_pd_for_pool_write_cache',
                    pool_name: pool_name,
                    enc_id: 0
                };
            } else {
                ssd_store.proxy.extraParams = {
                    op: 'get_pd_for_pool_read_cache',
                    pool_name: pool_name,
                    enc_id: 0
                };
            }
            ssdcacheWindow.down('#btn_confirm').on('click', 'on_editSsdCache');
        } else {
            /* op = 'CREATE' */
            ssdcacheWindow.setConfig({
                title: 'Create SSD Cache'
            });
            ssd_store.proxy.extraParams = {
                op: 'get_pd_for_avail_ssd',
                enc_id: 0
            };
            ssdcacheWindow.down('#btn_confirm').on('click', 'on_addSsdCache');
        }
        if (typeof (pool_name) != 'undefined') {
            ssdcacheWindow.down('#display_pool').setValue(this.view.pool_name);
            ssdcacheWindow.down('#combo_pool').setVisible(false);
        } else {
            ssdcacheWindow.down('#display_pool').setVisible(false);
        }
        if (cache_type != 'Both' && typeof (cache_type) != 'undefined') {
            var type = this.view.cache_type;
            ssdcacheWindow.down('#display_cacheType').setValue(type);
            ssdcacheWindow.down('#combo_cacheType').setVisible(false);
        } else {
            ssdcacheWindow.down('#display_cacheType').setVisible(false);
        }
    },
    on_ssdCheckChange: function (column, recordIndex, checked) {
        var vm = this.getViewModel(),
            win = this.getView(),
            combo_raidType = win.down('#combo_raidType'),
            combo_cacheType = win.down('#combo_cacheType'),
            cache_type = combo_cacheType.isVisible() ? win.down('#combo_cacheType').getValue() : win.down('#display_cacheType').getValue(),
            diskNum = this.getStore('SSD_info').queryBy(function (rec) {
                return rec.get('selection') === true;
            }).count();


        if (cache_type === 'Write' && diskNum > 1) {
            combo_raidType.getStore().clearFilter();
        } else {
            combo_raidType.getStore().filterBy(function (val) {
                return val.get('raid_level') < 1;
            });
        }
        var current_index = combo_raidType.getValue();
        /* Change current selected raidtype if it will not be existed.*/
        if (current_index >= combo_raidType.getStore().count() - 2) {
            combo_raidType.setValue(0);
        }
    },
    on_editSsdCache: function (field) {
        var win = this.getView(),
            pool_name = win.pool_name,
            cache_type = win.cache_type,
            raid_type = win.down('#combo_raidType').getValue(),
            selected_pd = [],
            remove_pd = [];
        win.down('#grid_ssd').getStore().getData().items.map(function (rec) {
            if (rec.selection === true)
                selected_pd.push(rec.data.pd_id);
        });
        win.down('#grid_ssd').getStore().getData().items.map(function (rec) {
            if (rec.pool !== '')
                remove_pd.push(rec.data.pd_id);
        });
        selected_pd = Ext.JSON.encode(selected_pd);
        remove_pd = Ext.JSON.encode(remove_pd);
        var params = [{
            op: 'modify_read_cache',
            pool_name: pool_name,
            remove_cache_arr: remove_pd,
            add_cache_arr: selected_pd
        }, {
            op: 'modify_write_cache',
            pool_name: pool_name,
            remove_cache_arr: remove_pd,
            mirror: raid_type !== null ? raid_type : 0,
            add_cache_arr: selected_pd
        }];
        if (selected_pd.toString() !== remove_pd.toString()) {
            Ext.Msg.show({
                title: 'Edit cache confirm',
                message: 'Do you really want to edit this cache ?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.WARNING,
                fn: function (btn) {
                    if (btn === 'yes') {
                        var mask = new Ext.LoadMask({
                            msg: 'Please wait processing your request',
                            target: win
                        });
                        mask.show();
                        Ext.Ajax.request({
                            url: 'app/StorageManagement/backend/ssdcache/SsdCache.php',
                            method: 'post',
                            params: cache_type === 'Read' ? params[0] : params[1],
                            success: function (response) {
                                mask.destroy();
                                if ((Ext.JSON.decode(response.responseText)).success === false) {
                                    var msg = (Ext.JSON.decode(response.responseText)).msg;
                                    Ext.Msg.alert("Error", msg);
                                } else {
                                    // Ext.Msg.alert("Success", "Cache edit saving success !");
                                    win.destroy();
                                }
                            },
                            failure: function (response) {
                                mask.destroy();
                                Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
                            }
                        });
                    }
                }
            });
        } else {
            Ext.Msg.alert("Change confirm", "No changing is set,</br>please try again !");
        }
    },
    on_addSsdCache: function (field) {
        var win = this.getView(),
            pool_name = win.down('#display_pool').isVisible() ? win.down('#display_pool').getValue() : win.down('#combo_pool').getValue(),
            cache_type = win.down('#display_cacheType').isVisible() ? win.down('#display_cacheType').getValue() : win.down('#combo_cacheType').getValue(),
            raid_type = win.down('#combo_raidType').getValue(),
            pd_store = Ext.data.StoreManager.lookup('ssd_info'),
            records = pd_store.queryBy(function (rec) {
                return rec.get('selection') === true;
            });

        /*  Checking selected items */
        if (records.count() === 0) {
            Ext.Msg.alert('No selection', 'No selected SSD, please try again !');
        } else if (!pool_name) {
            Ext.Msg.alert('No pools', 'To create SSD cache, you must have pool !');
        } else {
            var cache_arr = [];
            records.each(function (obj, index) {
                cache_arr[index] = obj.get('pd_id');
            });
            cache_arr = Ext.JSON.encode(cache_arr);
            var params = [{
                op: 'modify_read_cache',
                pool_name: pool_name,
                add_cache_arr: cache_arr
            }, {
                op: 'modify_write_cache',
                pool_name: pool_name,
                mirror: raid_type,
                add_cache_arr: cache_arr
            }];
            Ext.Msg.show({
                title: 'Create cache confirm',
                message: 'Do you really want to create this cache ?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.WARNING,
                fn: function (btn) {
                    if (btn === 'yes') {
                        var mask = new Ext.LoadMask({
                            msg: 'Please wait processing your request',
                            target: win
                        });
                        mask.show();
                        Ext.Ajax.request({
                            url: 'app/StorageManagement/backend/ssdcache/SsdCache.php',
                            method: 'post',
                            params: cache_type === 'Read' ? params[0] : params[1],
                            success: function (response) {
                                mask.destroy();
                                if ((Ext.JSON.decode(response.responseText)).success === false) {
                                    var msg = (Ext.JSON.decode(response.responseText)).msg;
                                    Ext.Msg.alert("Error", msg);
                                } else {
                                    // Ext.Msg.alert("Success", "Cache creat success !");
                                    win.destroy();
                                }
                            },
                            failure: function (response) {
                                mask.destroy();
                                Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
                            }
                        });
                    } else {}
                }
            });
        }
    },
    /* Checking cache type  */
    on_cacheType_change: function (combo, newval) {
        var diskNum = this.getStore('SSD_info').queryBy(function (rec) {
            return rec.get('selection') === true;
        }).count();
        if (diskNum > 1 && newval === 'Write')
            this.getView().down('#combo_raidType').getStore().clearFilter();
        else {
            this.getView().down('#combo_raidType').getStore().filterBy(function (val) {
                return val.get('raid_level') < 1;
            });
        }
    },
    after_grid_layout: function (me) {
        var win = me.up('window'),
            combo_cacheType = win.down('#combo_cacheType'),
            combo_raidType = win.down('#combo_raidType'),
            cache_type = combo_cacheType.isVisible() ? win.down('#combo_cacheType').getValue() : win.down('#display_cacheType').getValue(),
            diskNum = win.down('#grid_ssd').getStore().queryBy(function (rec) {
                return rec.get('selection') === true;
            }).count();
        /* First time cache type filter */

        if (cache_type === 'Write' && diskNum > 1) {
            combo_raidType.getStore().clearFilter();
        } else {
            combo_raidType.getStore().filterBy(function (val) {
                return val.get('raid_level') < 1;
            });
        }
        /* ------------------------------ */
    }
});
