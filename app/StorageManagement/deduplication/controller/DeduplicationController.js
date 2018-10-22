Ext.define('DESKTOP.StorageManagement.deduplication.controller.DeduplicationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.deduplication',
    requires: [
        'DESKTOP.StorageManagement.ssdcache.view.SsdCacheCreate'
    ],
    on_Apply_All: function (form, me) {
        var win = this.getView(),
            appwindow = me,
            store_folderAndLun = win.down('#tree_folderAndLun').getStore();
        store_folderAndLun.clearFilter();
        var data = store_folderAndLun.getData().items,
            store_folder = Ext.data.StoreManager.lookup('store_folder'),
            zfs_arr = [],
            controller = this,
            params = {};
        /* Get the zfs-array for apply dedup */
        Ext.each(data, function (obj, index) {
            if (obj.data.checked !== obj.data.is_dedup) {
                var tmp = {};
                tmp.zfs_name = obj.data.zfs_name;
                tmp.dedup = obj.data.checked === true ? 'on' : 'off';
                zfs_arr.push(tmp);
            }
        });
        this.apply_filter();
        zfs_arr = Ext.JSON.encode(zfs_arr);
        if (zfs_arr.length > 0) {
            params.op = 'set_dedup';
            params.zfs_arr = zfs_arr;
        } else {
            params.op = 'set_dedup';
        }
        Ext.Msg.show({
            title: 'Edit deduplication confirm',
            message: 'Do you really want to edit deduplication ?',
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
                        url: 'app/StorageManagement/backend/deduplication/Deduplication.php',
                        method: 'POST',
                        params: params,
                        success: function (response) {
                            mask.destroy();
                            store_folderAndLun.destroy();
                            store_folder.reload();
                            if ((Ext.JSON.decode(response.responseText)).success === false) {
                                var msg = (Ext.JSON.decode(response.responseText)).msg;
                                Ext.Msg.alert("Error", msg, function () {});
                            } else {
                                appwindow.getresponse(0, 'Deduplication');
                            }
                        },
                        failure: function (response) {
                            mask.destroy();
                            store_folderAndLun.destroy();
                            store_folder.reload();
                            Ext.Msg.alert("Something wrong ! ", "Something wrong happened,</br>please try again !");
                        }
                    });
                }
            }
        });
    },
    dirtycheck: function () {
        var win = this.getView(),
            store_folderAndLun = win.down('#tree_folderAndLun').getStore();
        store_folderAndLun.clearFilter();
        var data = store_folderAndLun.getData().items,
            zfs_arr = [],
            check_enable = win.down('#check_enable');
        Ext.each(data, function (obj, index) {
            if (obj.data.checked !== obj.data.is_dedup) {
                var tmp = {};
                tmp.zfs_name = obj.data.zfs_name;
                tmp.dedup = obj.data.checked === true ? 1 : 0;
                zfs_arr.push(tmp);
            }
        });
        this.apply_filter();
        return (zfs_arr.length > 0 && check_enable.getValue());
    },
    /*  Initial create add read cache window */
    on_addCache: function (me) {
        var info = {},
            form = me.up('form'),
            pool_name = form.down('treepanel').getSelectionModel().getSelection()[0].data.text;
        info = {
            op: 'Create',
            pool_name: pool_name,
            cache_type: 'Read',
            caller: 'Deduplication',
            store: 'pool_info'
        };
        var addCache = new DESKTOP.StorageManagement.ssdcache.view.SsdCacheCreate(info);
        addCache.show();
    },
    /*  Initial create edit read cache window */
    on_editCache: function (me) {
        var info = {},
            form = me.up('form'),
            pool_name = form.down('treepanel').getSelectionModel().getSelection()[0].data.text;
        info = {
            op: 'Edit',
            pool_name: pool_name,
            cache_type: 'Read',
            caller: 'Deduplication',
            store: 'pool_info'
        };
        var addCache = new DESKTOP.StorageManagement.ssdcache.view.SsdCacheCreate(info);
        addCache.show();
    },
    on_poolTree_click: function (me, record) {
        this.apply_filter();
    },
    on_comboFilter: function (me, newVal, oldVal) {
        me.resetOriginalValue(newVal);
        this.apply_filter();
    },
    apply_filter: function () {
        var combo_value = this.getView().down('#combo_filter').getValue(),
            pool_name = this.getView().down('#tree_pool').getSelectionModel().getSelection()[0].data.text,
            treepanel_store = this.getView().down('#tree_folderAndLun').getStore();
        treepanel_store.clearFilter();
        switch (combo_value) {
        case '1':
            treepanel_store.filterBy(function (rec, index) {
                if (rec.get('type') === 'folder' && rec.get('pool_name') === pool_name) {
                    return true;
                } else {
                    return false;
                }
            });
            break;
        case '2':
            treepanel_store.filterBy(function (rec, index) {
                if (rec.get('type') === 'lun' && rec.get('pool_name') === pool_name) {
                    return true;
                } else {
                    return false;
                }
            });
            break;
        default:
            treepanel_store.filterBy(function (rec, index) {
                if (rec.get('pool_name') === pool_name) {
                    return true;
                } else {
                    return false;
                }
            });
            break;
        }
    }
});
