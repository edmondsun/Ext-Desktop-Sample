Ext.define('DESKTOP.StorageManagement.overview.controller.DiskController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.overviewdisk',
    init: function () {
        this.globalButton = [{
            defaultName: "Storage architecture",
            nameIndex: "Storage architecture",
            handler: "Storage_architecture"
        }];
    },
    Storage_architecture: function () {
        alert('123');
    },
    addGlobalButton: function (windowEl, panelEl) {
        windowEl.getController().addItemtoToolbarGlobalButton(windowEl, panelEl, this.globalButton);
    },
    afterview: function (me) {
        me.getViewModel().getStore('encInfo').view = me;
        me.getViewModel().getStore('pdStore').view = me;
    },
    on_test: function (field) {
        var test_el = {};
        test_el.enc_id = field.up('form').down('combo').getValue();
        test_el.slot = field.up('form').down('#dSlot').getValue();
        var test = Ext.create('DESKTOP.StorageManagement.disk.view.SmartTesting', test_el);
        test.show();
    },
    onComboselect: function (combo, record) {
        var form = combo.up('form');
        var pdStore = Ext.data.StoreManager.lookup('pdStore');
        pdStore.proxy.extraParams = {
            enc_id: record.data.enc_id
        };
        pdStore.reload();
        this.on_create_boxs(record.data, combo.getStore());
        form.down('#dStatus').reset();
        form.down('#dSlot').reset();
        form.down('#dDrive').reset();
        form.down('#dCapc').reset();
        form.down('#dTemp').reset();
        form.down('#dHdd').reset();
        form.down('#dTestTime').reset();
        form.down('#dTResult').reset();
    },
    on_create_diskboxs: function (store) {
        var cls = Ext.ComponentQuery.query('[cls=disk_bay]');
        var store_items = store.data.items;
        var form = store.view;
        Ext.each(store_items, function (obj, index) {
            var slot = "#" + 'disk_bay' + (obj.get('slot') - 1);
            switch (obj.get('connect_stat')) {
            case 'Online':
                form.down(slot).setStyle({
                    border: '1px solid #32c1c7',
                    backgroundColor: '#32c1c7',
                    position: 'absolute'
                });
                if (obj.get('ident') === 1) {
                    form.down(slot).setStyle({
                        backgroundImage: 'url(app/StorageManagement/images/turn_on.gif)'
                    });
                }
                break;
            default:
                form.down(slot).setStyle({
                    background: 'red'
                });
            }
            console.log('form.down.slot', form.down(slot));
            form.down(slot).el.on({
                click: function () {
                    form.down('#btnTest').setDisabled(false);
                    form.down('#displayField').setVisible(true);
                    form.down('#dStatus').setValue(store_items[index].get('status'));
                    form.down('#dSlot').setValue(store_items[index].get('slot'));
                    form.down('#dDrive').setValue(store_items[index].get('vendor') + ' ' + store_items[index].get('serial') + '(' + store_items[index].get('rate') + ')');
                    form.down('#dCapc').setValue(store_items[index].get('size_gb') + ' GB');
                    form.down('#dTemp').setValue(store_items[index].get('smart_arr').Temperature.value + ' ℃');
                    form.down('#dHdd').setValue(store_items[index].get('health'));
                    form.down('#dTestTime').setValue(store_items[index].get('smartctl_arr').start_time);
                    form.down('#dTResult').setValue(store_items[index].get('smartctl_arr').status);
                    form.down('#tree').getSelectionModel().select(index);
                }
            });
        });
        if (store_items.length !== 0) {
            var slot = "#" + 'disk_bay' + (store_items[0].get('slot') - 1);
            form.down(slot).el.fireEvent('click');
        }
    },
    on_create_boxs: function (record, encInfo_store) {
        var cls = Ext.ComponentQuery.query('[cls=disk_bay]');
        var form = encInfo_store.view;
        var enc_col = record.col;
        var enc_row = record.row;
        var enc_seq = record.sequence.split(" ");
        Ext.each(cls, function () {
            this.destroy();
        });
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
                style: "overflow:hidden;border:1px solid #fdfdfd;border-radius:2px;position:absolute",
                listeners: {
                    afterrender: function (obj) {
                        console.log('index,enc_col,enc_row', index, enc_col * enc_row);
                        if (index + 1 == enc_col * enc_row) {
                            var pdStore = Ext.data.StoreManager.lookup('pdStore');
                            obj.up('form').getController().on_create_diskboxs(pdStore);
                        }
                        obj.el.on({
                            mouseover: function () {
                                this.setStyle({
                                    //border: '1px solid #0ff'
                                    // backgroundImage: 'url(app/StorageManagement/images/clicked.png)'
                                });
                            },
                            mouseout: function () {
                                this.setStyle({
                                    //border: '1px solid #fdfdfd'
                                    // backgroundImage: 'none'
                                });
                            },
                            click: function () {
                                Ext.each(boxs, function (obj, index) {
                                    this.setStyle({
                                        border: '1px solid #fdfdfd'
                                            // backgroundImage: 'none'
                                    });
                                });
                                this.setStyle({
                                    border: '2px solid #ff0'
                                });
                                form.down('#displayField').setVisible(false);
                                form.down('#btnTest').setDisabled(true);
                                form.down('#dStatus').setValue('No available items.');
                            }
                        });
                    }
                }
            });
            boxs.push(v);
        });
        c.add(boxs);
        c.doLayout();
    },
    set_right_left_button: function (store) {
        var form = store.view;
        var combo = form.down('#com_enc');
        var c_store = combo.getStore();
        var value = combo.getRawValue();
        var index = c_store.findExact('enc_name', value);
        var num = c_store.getCount(index);
        if (index > 0) {
            form.down('#btnLeft').setDisabled(false);
        } else {
            form.down('#btnLeft').setDisabled(true);
        }
        if (num - index <= 1) {
            form.down('#btnRight').setDisabled(true);
        } else {
            form.down('#btnRight').setDisabled(false);
        }
    },
    on_leftBtn_click: function (field) {
        var form = field.up('form');
        var combo = form.down('#com_enc');
        var value = combo.getRawValue();
        var store = combo.getStore();
        var index = store.findExact('enc_name', value);
        var num = store.getCount();
        if (index >= 1) {
            var prerecord = store.getAt(index - 1);
            combo.select(prerecord);
            combo.fireEvent('select', combo, prerecord);
        }
        var a_value = form.down('#com_enc').getRawValue();
        var a_record = store.findRecord('enc_name', a_value);
        var a_index = store.indexOf(a_record);
        if (a_index === 0) {
            field.setDisabled(true);
            field.up('form').down('#btnRight').setDisabled(false);
        } else if (a_index + 1 !== num) {
            field.up('form').down('#btnRight').setDisabled(false);
        } else {
            field.up('form').down('#btnRight').setDisabled(false);
            field.setDisabled(false);
        }
    },
    on_rightBtn_click: function (field) {
        var form = field.up('form');
        var combo = form.down('#com_enc');
        var value = combo.getRawValue();
        var store = combo.getStore();
        var index = store.findExact('enc_name', value);
        var num = store.getCount();
        if (num - index > 1) {
            var nextrecord = store.getAt(index + 1);
            combo.select(nextrecord);
            combo.fireEvent('select', combo, nextrecord);
        }
        var a_value = form.down('#com_enc').getRawValue();
        var a_record = store.findRecord('enc_name', a_value);
        var a_index = store.indexOf(a_record);
        if (a_index + 1 === num) {
            field.setDisabled(true);
            field.up('form').down('#btnLeft').setDisabled(false);
        } else if (a_index > 0) {
            field.up('form').down('#btnLeft').setDisabled(false);
        } else {
            field.up('form').down('#btnLeft').setDisabled(false);
            field.setDisabled(false);
        }
    }
});
