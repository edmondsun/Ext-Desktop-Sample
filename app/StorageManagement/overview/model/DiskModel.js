Ext.define('DESKTOP.StorageManagement.overview.model.DiskModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.overviewdisk',
    requires: ['DESKTOP.StorageManagement.overview.controller.DiskController'],
    stores: {
        encInfo: {
            storeId: 'encInfo',
            fields: [''],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/disk/Disk.php',
                method: 'GET',
                extraParams: {
                    op: 'get_enclosure',
                    md5sum: 0
                },
                reader: {
                    type: 'json',
                    // rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records) {
                        store.view.getViewModel().prepare_data('encInfo', store, records);
                        var pdStore = Ext.data.StoreManager.lookup('pdStore');
                        pdStore.load();
                    }
                }
            }
        },
        pdStore: {
            storeId: 'pdStore',
            fields: [''],
            autoSync: true,
            proxy: {
                type: 'ajax',
                url: 'app/StorageManagement/backend/disk/Disk.php',
                method: 'GET',
                extraParams: {
                    enc_id: 0
                },
                reader: {
                    type: 'json',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, successful) {
                        store.view.getViewModel().prepare_data('pdStore', store, records);
                        store.view.getController().set_right_left_button(store);
                        var encInfo = Ext.data.StoreManager.lookup('encInfo');
                        store.view.getController().on_create_boxs(encInfo.data.items[0].data, encInfo);
                    }
                }
            }
        }
    },
    prepare_data: function (type, store, records) {
        var record = records[0];
        var form = store.view;
        var params = {
            md5sum: record.data.md5sum
        };
        switch (type) {
        case 'encInfo':
            store.loadData(record.data.data);
            form.down('combobox').setValue(record.data.data[0].enc_id);
            params.op = 'get_enclosure';
            break;
        case 'pdStore':
            if (typeof (records[0].data.data[0]) !== 'undefined') {
                store.loadData(records[0].data.data[0].pd_arr);
                var treedata = records[0].data.data[0].pd_arr;
                Ext.each(treedata, function (obj, index) {
                    treedata[index].leaf = true;
                    treedata[index].text = 'disk' + obj.slot;
                    treedata[index].qtip = 'disk' + obj.slot;
                });
                var disk_compositon = Ext.create('Ext.data.TreeStore', {
                    type: 'tree',
                    text: "My Root",
                    fields: [{
                        name: 'text',
                        mapping: 'text'
                    }],
                    root: {
                        expanded: true,
                        children: treedata
                    },
                    proxy: {
                        type: 'localstorage'
                    }
                });
                form.down('#tree').setStore(disk_compositon);
            } else {
                store.removeAll();
                form.down('#btnTest').setDisabled(true);
                form.down('#displayField').setVisible(false);
                form.down('#tree').getRootNode().removeAll();
            }
            params.enc_id = store.proxy.extraParams;
            break;
        }
        if (typeof (store.enc_status) !== 'undefined') {
            clearInterval(store.enc_status);
        }
        store.enc_status = setInterval(function () {
            get_data(type, store, form, params);
        }, 3000);
        get_data = function (type, store, form, params) {
            //Ext.getCmp('diskView').getController().on_create_diskboxs();
            Ext.Ajax.request({
                url: 'app/StorageManagement/backend/disk/Disk.php',
                method: 'GET',
                async: false,
                params: params,
                success: function (response) {
                    var res = Ext.JSON.decode(response.responseText);
                    if (res.data.length !== 0) {
                        clearInterval(store.enc_status);
                        switch (type) {
                        case 'encInfo':
                            store.reload();
                            var pdStore = form.getViewModel().getStore('pdStore');
                            pdStore.proxy.extraParams = {
                                enc_id: 0
                            };
                            pdStore.reload();
                            break;
                        case 'pdStore':
                            store.reload();
                            break;
                        }
                    }
                }
            });
        };
    }
});
