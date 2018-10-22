Ext.define('DESKTOP.StorageManagement.disk.model.DiskModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.disk',
    requires: ['DESKTOP.StorageManagement.disk.controller.DiskController'],
    stores: {
        encInfo: {
            storeId: 'encInfo',
            fields: [''],
            autoLoad: true,
            needOnLoad: true,
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
                        store.view.getController().on_create_boxs(records[0].data.data[0], store);
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
            needOnLoad: true,
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
                        store.view.getController().on_create_diskboxs(store);
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
            if (typeof (record.data.data[0]) !== 'undefined') {
                store.loadData(record.data.data[0].pd_arr);
            } else {
                store.removeAll();
            }
            params.enc_id = store.proxy.extraParams;
            break;
        }
        if (typeof (store.enc_status) !== 'undefined') {
            clearInterval(store.enc_status);
        }
        store.enc_status = setInterval(function () {
            get_data(type, store, form, params);
        }, 5000);
        get_data = function (type, store, form, params) {
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
                            var gridstore = form.down('grid').getStore('pdStore');
                            var select_item = form.down('grid').getSelectionModel().getSelection()[0];
                            gridstore.reload();
                            gridstore.on({
                                load: {
                                    fn: function (store, records, options) {
                                        if (typeof (select_item) !== 'undefined') {
                                            var index = gridstore.findExact('pd_id', select_item.data.pd_id);
                                            form.down('grid').getSelectionModel().select(index, true);
                                        }
                                    },
                                    scope: gridstore,
                                    single: true
                                }
                            });
                            break;
                        }
                    }
                }
            });
        };
    }
});
