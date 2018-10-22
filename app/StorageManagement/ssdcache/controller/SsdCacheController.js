Ext.define('DESKTOP.StorageManagement.ssdcache.controller.SsdCacheController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ssdcache',
    requires: [
        'DESKTOP.StorageManagement.ssdcache.view.SsdCacheCreate'
    ],
    init: function () {
        this.mapArr = [];
        this.globalButton = [{
            defaultName: "Create",
            nameIndex: "Create",
            handler: "on_create"
        }];
    },
    addGlobalButton: function (windowEl, panelEl) {
        windowEl.getController().addItemtoToolbarGlobalButton(windowEl, panelEl, this.globalButton);
    },
    /* Initial create SSD cache window */
    on_create: function () {
        var info = {
            op: 'Create',
            cache_type: 'Both'
        };
        var win = new DESKTOP.StorageManagement.ssdcache.view.SsdCacheCreate(info);
        win.show();
    },
    afterview: function (me) { //me = view/Ssdcache
        me.getViewModel().getStore('encInfo').view = me;
        me.getViewModel().getStore('cacheInfo').view = me;
    },
    beforeDestroy: function () {
        Ext.TaskManager.stopAll();
    },
    /* Initial edit SSD cache window */
    on_edit: function () {
        var form = Ext.ComponentQuery.query('#SsdCache')[0];
        var selected = form.down('#poollist').getSelectionModel().getSelection()[0];
        var p_name = selected.get('pool_name');
        var c_type = selected.get('cache_type');
        /* Filter out write cache with mirror type (delete only)*/
        var filter_arr = this.on_filter_mirror(p_name);
        var info = {
            op: 'Edit',
            pool_name: p_name,
            cache_type: c_type,
            filter_arr: filter_arr
        };
        var win = new DESKTOP.StorageManagement.ssdcache.view.SsdCacheCreate(info);
        win.show();
    },
    on_delete: function () {
        var form = Ext.ComponentQuery.query('#SsdCache')[0];
        var selected = form.down('#poollist').getSelectionModel().getSelection()[0];
        var remove_pd = [];
        /*
        When write cache type is RAID 0 (mirror),
        delete must using write cache name.
        ex. 'mirror-1' , 'mirror-2'
        */
        if (selected.get('cache_name').slice(0, 6) === 'mirror') {
            remove_pd.push(selected.get('cache_name'));
        } else {
            remove_pd = selected.get('pd_arr').map(function (val) {
                return val.pd_id;
            });
        }
        remove_pd = Ext.JSON.encode(remove_pd);
        var p_name = selected.get('pool_name');
        var c_type = selected.get('cache_type');
        Ext.Msg.show({
            title: 'Delete cache confirm',
            message: 'Do you really want to delete ' + c_type + 'cache of ' + p_name,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function (btn) {
                if (btn === 'yes') {
                    var mask = new Ext.LoadMask({
                        msg: 'Please wait processing your request',
                        target: form
                    });
                    mask.show();
                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/ssdcache/SsdCache.php',
                        method: 'post',
                        params: {
                            op: 'remove_write_cache',
                            pool_name: p_name,
                            remove_cache_arr: remove_pd
                        },
                        success: function (response) {
                            mask.destroy();
                            if ((Ext.JSON.decode(response.responseText)).success === false) {
                                var msg = (Ext.JSON.decode(response.responseText)).msg;
                                Ext.Msg.alert("Error", msg);
                            } else {
                                // Ext.Msg.alert("Success", "Cache edit saving success !");
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
    },
    rightclick: function (view, record, htmlItem, index, event) {
        var me = this,
            menu = me.menu;
        // prevent default right click behaviour
        event.stopEvent();
        if (!menu) {
            menu = Ext.create('Ext.menu.Menu', {
                controller: 'ssdcache',
                items: [{
                    text: 'Edit',
                    listeners: {
                        click: 'on_edit'
                    }
                }, {
                    text: 'Delete',
                    listeners: {
                        click: 'on_delete'
                    }
                }]
            });
        }
        menu.contextRecord = record;
        menu.showAt(event.getXY());
    },
    on_gridselect: function (grid, record) {
        this.getViewModel().set('poolname', record.data.pool_name);
        var slotobj = record.get('pd_arr');
        var cls = Ext.ComponentQuery.query('[cls=disk_bay]');
        var form = this.getView();
        var btn_edit = form.down('#btn_edit');
        var mapArr = slotobj.map(function (obj) {
            return obj.slot;
        });
        if (record.get('cache_type') === 'Write' && record.get('raid_type') === 'RAID 1') {
            btn_edit.setDisabled(true);
        } else {
            btn_edit.setDisabled(false);
        }
        /* Clear last selected disk slot */
        this.mapArr.map(function (arr) {
            var slot = "#" + 'disk_bay' + (arr - 1);
            form.down(slot).setStyle({
                border: '1px solid #fdfdfd',
                backgroundColor: 'initial',
                position: 'absolute'
            });
        });
        /* Drawing diks slot */
        mapArr.map(function (arr) {
            var slot = "#" + 'disk_bay' + (arr - 1);
            form.down(slot).setStyle({
                border: '1px solid #32c1c7',
                backgroundColor: '#32c1c7',
                position: 'absolute'
            });
        });
        this.mapArr = mapArr;
    },
    on_create_boxs: function (record, encInfo_store) {
        var cls = Ext.ComponentQuery.query('[cls=disk_bay]');
        var form = encInfo_store.view;
        var enc_col = record.col;
        var enc_row = record.row;
        var enc_seq = record.sequence.split(" ");
        var boxs = [];
        var c = form.down('#drawing');
        Ext.Array.each(enc_seq, function (name, index, countriesItSelf) {
            var v = Ext.create('Ext.Component', {
                cls: 'disk_bay',
                itemId: 'disk_bay' + (name - 1),
                border: true,
                x: 20 + parseInt((name - 1) / enc_row, 10) * 79,
                y: 57 + ((name - 1) % enc_row) * 21,
                width: 78,
                height: 20,
                style: "overflow:hidden;border:1px solid #fdfdfd;border-radius:2px;position:absolute"
                // listeners: {
                //     afterrender: function (obj) {
                //         if (index + 1 == enc_col * enc_row) {
                //             var pdStore = Ext.data.StoreManager.lookup('pdStore');
                //             obj.up('form').getController().on_create_diskboxs(pdStore);
                //         }
                //         obj.el.on({
                //             mouseover: function () {
                //                 this.setStyle({
                //                     //border: '1px solid #0ff'
                //                     // backgroundImage: 'url(app/StorageManagement/images/clicked.png)'
                //                 });
                //             },
                //             mouseout: function () {
                //                 this.setStyle({
                //                     //border: '1px solid #fdfdfd'
                //                     // backgroundImage: 'none'
                //                 });
                //             },
                //             click: function () {
                //                 Ext.each(boxs, function (obj, index) {
                //                     this.setStyle({
                //                         border: '1px solid #fdfdfd'
                //                             // backgroundImage: 'none'
                //                     });
                //                 });
                //                 this.setStyle({
                //                     border: '2px solid #ff0'
                //                 });
                //             }
                //         });
                //     }
                // }
            });
            boxs.push(v);
        });
        c.add(boxs);
        c.doLayout();
        /* For first time selection */
        cache_store = Ext.StoreManager.lookup('cacheInfo');
        if (cache_store.count() > 0) {
            form.down('#poollist').getSelectionModel().select(0);
        }
    },
    /* Filter out write cache type with mirror (delete only) */
    on_filter_mirror: function (pool_name) {
        var win_store = Ext.StoreManager.lookup('cacheInfo');
        var filter = [];
        win_store.getData().items.map(function (val) {
            if (val.data.pool_name === pool_name && val.data.cache_name.slice(0, 6) === 'mirror') {
                val.data.pd_arr.map(function (val) {
                    filter.push(val.pd_id);
                });
            }
        });
        return filter;
    }
});
