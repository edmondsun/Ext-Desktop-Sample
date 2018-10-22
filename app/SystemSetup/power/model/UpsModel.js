Ext.define('DESKTOP.SystemSetup.power.model.UpsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.ups',
    stores: {
        ups: {
            fields: [
                'config_ups_type',
                'ups_type',
                'ups_batt_level',
                'ups_delay_level',
                'ups_auto_shutdown',
                'batt_progress',
                'volt_max',
                'volt_min',
                'ups_status',
                'ups_ip_addr',
                'ups_community'
            ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/power/UPS.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            /* record last config_ups_type */
            lastConfig: 0,
            genUpsTypeItems: function (type) {
                var items = [];
                items.push({
                    'ups_type': 'none',
                    'ups_type_str': 'None'
                });
                // judge by the first bit
                if (type & 1) {
                    items.push({
                        'ups_type': 'smartups',
                        'ups_type_str': 'Smart-UPS(Serial port)'
                    });
                }
                // judge by the second bit
                if (type & 2) {
                    items.push({
                        'ups_type': 'snmp',
                        'ups_type_str': 'Smart-UPS(SNMP)'
                    });
                }

                if (type & 1) {
                    items.push({
                        'ups_type': 'mgtups',
                        'ups_type_str': 'Megatec-UPS'
                    });
                }
                return items;
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var form = Ext.ComponentQuery.query('#Ups')[0];
                        combo = form.down('#u_type'),
                            configType = records[0].data.config_ups_type,
                            batLevel = records[0].data.batt_progress / 100,
                            upsStatus = records[0].data.ups_status;
                        if (store.lastConfig != configType) {
                            var items = store.genUpsTypeItems(configType, store),
                                upsStore = Ext.create('Ext.data.Store', {
                                    fields: ['ups_type'],
                                    data: items
                                });
                            combo.bindStore(upsStore);
                            store.lastConfig = configType;
                            form.getForm().loadRecord(store.getAt(0));
                        }
                        form.down('#u_status').setValue(upsStatus);
                        form.down('#u_battery_level').setValue(batLevel);
                        form.getForm().setValues(form.getForm().getValues());
                        // monitering on ups status and battery level
                        setTimeout(function () {
                            store.load();
                        }, 10000);
                    }
                }
            }
        }
    }
});
