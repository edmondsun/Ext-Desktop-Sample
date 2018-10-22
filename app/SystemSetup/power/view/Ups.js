Ext.define('DESKTOP.SystemSetup.power.view.Ups', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ups',
    requires: [
        'DESKTOP.SystemSetup.power.model.UpsModel',
        'DESKTOP.SystemSetup.power.controller.UpsController'
    ],
    controller: 'ups',
    viewModel: {
        type: 'ups'
    },
    itemId: 'Ups',
    title: 'UPS',
    frame: true,
    width: 750,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    fieldDefaults: {
        msgTarget: 'qtip'
    },
    items: [{
        xtype: 'container',
        qDefault: true,
        customLayout: 'vlayout',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'UPS',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                itemId: 'u_type',
                xtype: 'combobox',
                qDefault: true,
                name: 'ups_type',
                fieldLabel: 'UPS type:',
                valueField: 'ups_type',
                displayField: 'ups_type_str',
                listeners: {
                    change: 'dicideItems'
                }
            }]
        }, {
            /* Megatec-Ups field*/
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            itemId: 'snmpfield',
            items: [{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'textfield',
                    qDefault: true,
                    itemId: 'u_ip',
                    name: 'ups_IP_address',
                    fieldLabel: 'IP address:',
                    emptyText: 'Please Input IP address',
                    allowBlank: false,
                    maskRe: /[\d\.]/,
                    regexText: 'Invalid IP address',
                    validateOnChange: false,
                    msgTarget: 'qtip',
                    validator: function () {
                        var check = new DESKTOP.lib.isIpIn();
                        if (check.verify_ip(this.getValue()))
                            return true;
                        return this.regexText;
                    }
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'textfield',
                    qDefault: true,
                    itemId: 'u_community',
                    name: 'ups_community',
                    fieldLabel: 'Community:',
                    emptyText: 'Please Input Community',
                    allowBlank: false
                }]
            }]
        }, {
            /* Smart UPS (Serial port) field*/
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            itemId: 'serialfield',
            items: [{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    maskOnDisable: true,
                    itemId: 'u_batt_level',
                    name: 'ups_batt_level',
                    fieldLabel: 'Shutdown battery level (%):',
                    valueField: 'ups_batt_level',
                    displayField: 'ups_batt_level',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['ups_batt_level'],
                        data: [
                            {'ups_batt_level': 0},
                            {'ups_batt_level': 5},
                            {'ups_batt_level': 20},
                            {'ups_batt_level': 35},
                            {'ups_batt_level': 50},
                            {'ups_batt_level': 65},
                            {'ups_batt_level': 80},
                            {'ups_batt_level': 90}
                        ]
                    })
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    maskOnDisable: true,
                    itemId: 'u_delay_level',
                    name: 'ups_delay_level',
                    fieldLabel: 'Shutdown delay (s):',
                    valueField: 'ups_delay_level',
                    displayField: 'ups_delay_level',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['ups_delay_level'],
                        data: [
                            {'ups_delay_level': 0},
                            {'ups_delay_level': 30},
                            {'ups_delay_level': 60},
                            {'ups_delay_level': 90},
                            {'ups_delay_level': 120},
                            {'ups_delay_level': 150},
                            {'ups_delay_level': 180}
                        ]
                    })
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    maskOnDisable: true,
                    itemId: 'u_auto_shutdown',
                    name: 'ups_auto_shutdown',
                    fieldLabel: 'Shutdown UPS:',
                    valueField: 'ups_auto_shutdown',
                    displayField: 'ups_auto_shutdown',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['ups_auto_shutdown'],
                        data: [
                            {'ups_auto_shutdown': 'On'},
                            {'ups_auto_shutdown': 'Off'}
                        ]
                    })
                }]
            }]
        }, {
            /* Smart-Ups (SNMP) field */
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            itemId: 'megaUpsField',
            // defaults: {
            //     xtype: 'combobox'
            // },
            items: [{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    maskOnDisable: true,
                    itemId: 'u_max_battery_vol',
                    name: 'volt_max',
                    fieldLabel: 'Maximum battery voltage:',
                    valueField: 'volt_max',
                    displayField: 'volt_max',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['volt_max'],
                        data: [
                            {'volt_max': 0},
                            {'volt_max': 1},
                            {'volt_max': 2}
                        ]
                    })
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    maskOnDisable: true,
                    itemId: 'u_min_battery_vol',
                    name: 'volt_min',
                    fieldLabel: 'Minimum battery voltage:',
                    valueField: 'volt_min',
                    displayField: 'volt_min',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['volt_min'],
                        data: [
                            {'volt_min': 0},
                            {'volt_min': 1},
                            {'volt_min': 2}
                        ]
                    })
                }]
            }]
        }, {
            /* UPS Status */
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                itemId: 'u_status',
                xtype: 'displayfield',
                qDefault: true,
                name: 'ups_status',
                fieldLabel: 'Status:'
            }]
        }, {
            /* Show Battery Level */
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            name: 'batt_progress',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Battery level (%):'
                    // width: 200
            }, {
                xtype: 'progressbar',
                qDefault: true,
                itemId: 'u_battery_level',
                width: 200
            }, {
                xtype: 'displayfield',
                qDefault: true,
                itemId: 'u_battery_level_text'
            }]
        }]
    }]
});
