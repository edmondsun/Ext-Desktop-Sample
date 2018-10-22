Ext.define('DESKTOP.SystemSetup.network.view.Interfaces', {
    extend: 'Ext.form.Panel',
    alias: 'widget.netinterfaces',
    requires: [
        'DESKTOP.SystemSetup.network.controller.InterfacesController',
        'DESKTOP.SystemSetup.network.model.InterfacesModel',
        'DESKTOP.lib.isIpIn',
        'DESKTOP.SystemSetup.network.view.LinkAgg',
        'DESKTOP.SystemSetup.network.view.InterfacesSetting'
    ],
    listeners: {
        beforedestroy: function (form) {
            Ext.TaskManager.stopAll();
        }
    },
    controller: 'netinterfaces',
    viewModel: {
        type: 'netinterfaces'
    },
    itemId: 'Interface',
    title: "Interfaces",
    frame: true,
    // width: 600,
    //bodyPadding: 20,
    url: 'app/SystemSetup/backend/network/Interfaces.php',
    collapsible: true,
    // autoScroll: true,
    waitMsgTarget: true,
    // fieldDefaults : {
    //     labelWidth : 150,
    //     msgTarget : 'side'
    // },
    trackResetOnLoad: true,
    items: [{
        xtype: 'container',
        qDefault: true,
        customLayout: 'vlayout',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'toolbar',
                qDefault: true,
                border: false,
                width: '100%',
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    text: 'Interface',
                    labelFontWeight: 'bold',
                    labelFontColor: 'title'
                }, '->', {
                    xtype: 'button',
                    qDefault: true,
                    text: 'Edit',
                    bind: {
                        disabled: '{!nic2.selection}'
                    },
                    focusable: false, // avoid button being focused after pressed
                    listeners: {
                        click: 'onEdit'
                    }
                }]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'gridpanel',
                qDefault: true,
                itemId: 'nic',
                reference: 'nic2',
                width: '100%',
                enableColumnMove: false,
                // scrollable:true,
                bind: '{netGrid}',
                viewConfig: {
                    loadMask: false
                },
                forceFit: true,
                columns: [{
                    text: 'Link',
                    dataIndex: 'link',
                    sortable: false,
                    menuDisabled: true,
                    // locked: true,
                    width: 55,
                    renderer: function (value) {
                        var result = '';
                        switch (value) {
                        case "Down":
                            result = '<div><div style="margin:0px auto;width:10px;height:10px;background:url(app/SystemSetup/images/light_status.png) 0px -40px;"></div></div>';
                            break;
                        default:
                            result = '<div><div style="margin:0px auto;width:10px;height:10px;background:url(app/SystemSetup/images/light_status.png) 0px -10px;"></div></div>';
                            break;
                        }
                        return result;
                    }
                }, {
                    text: 'Interfaces',
                    dataIndex: 'name',
                    width: 90,
                    // locked: true,
                    sortable: false,
                    menuDisabled: true,
                    hideable: false
                }, {
                    text: 'Jumbo Frame',
                    dataIndex: 'mtu',
                    width: 120,
                    menuDisabled: true,
                    sortable: false
                }, {
                    text: 'VLAN',
                    dataIndex: 'vlan_id',
                    width: 70,
                    menuDisabled: true,
                    sortable: false
                }, {
                    text: 'IP Address',
                    dataIndex: 'address',
                    width: 120,
                    menuDisabled: true,
                    sortable: false
                }, {
                    text: 'Gateway',
                    dataIndex: 'gateway',
                    width: 115,
                    menuDisabled: true,
                    sortable: false
                }, {
                    text: 'Speed',
                    dataIndex: 'link',
                    menuDisabled: true,
                    width: 70,
                    sortable: false
                }, {
                    text: 'MAC address',
                    menuDisabled: true,
                    width: 100,
                    dataIndex: 'mac',
                    sortable: false
                }]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'splitter'
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Default Gateway',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'IPv4 default gateway'
            }, {
                xtype: 'combobox',
                qDefault: true,
                name: 'default_gateway',
                editable: false,
                itemId: 'default_gateway_combo',
                // bind: {
                //     store: '{DefaultLan}'
                // },
                queryMode: 'local',
                valueField: 'name',
                displayField: 'name',
                fields: ["name"],
                listeners: {
                    change: function (combo, val) {
                        var comboStore = combo.getStore();
                        var record = comboStore.findRecord('name', val);
                        var dynamicDNS = combo.up('form').down('#dynamicDNS');
                        if (record !== null) {
                            if (record.get('type') == "static") {
                                dynamicDNS.setDisabled(true);
                                if (dynamicDNS.checked) {
                                    combo.up('form').down('#staticDNS').setValue(true);
                                }
                            } else {
                                dynamicDNS.setDisabled(false);
                            }
                        }
                    }
                }
                //typeAhead: true,
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'splitter'
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'DNS setting',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'DNS (Domain Name Service) provides a means to translate hostname to IP address.\nEnter DNS IP address below.'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'splitter'
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'radiofield',
                qDefault: true,
                itemId: 'dynamicDNS',
                bind: {
                    disabled: '{!dynamic_dns_enable}'
                },
                name: 'dns',
                boxLabel: 'Obtain DNS server address automatically',
                inputValue: 'dynamic',
                listeners: {
                    change: function (radio, isChecked) {
                        if (isChecked) {
                            var dns_manual_arr = [
                                Ext.ComponentQuery.query('#dns_manual_primary'),
                                Ext.ComponentQuery.query('#dns_manual_secondary'),
                                Ext.ComponentQuery.query('#dns_manual_search_path')
                            ];
                            Ext.each(dns_manual_arr, function (item, index) {
                                var item_obj = item[0];
                                item_obj.disable();
                            });
                        }
                    }
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'radiofield',
                qDefault: true,
                itemId: 'staticDNS',
                name: 'dns',
                boxLabel: 'Use the following DNS server address',
                inputValue: 'static',
                listeners: {
                    change: function (radio, isChecked) {
                        var dns_manual_arr = [
                            Ext.ComponentQuery.query('#dns_manual_primary'),
                            Ext.ComponentQuery.query('#dns_manual_secondary'),
                            Ext.ComponentQuery.query('#dns_manual_search_path')
                        ];
                        Ext.each(dns_manual_arr, function (item, index) {
                            var item_obj = item[0];
                            if (isChecked) {
                                item_obj.enable();
                            } else {
                                item_obj.disable();
                            }
                        });
                    }
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                itemId: 'dns_manual_primary',
                xtype: 'textfield',
                qDefault: true,
                name: 'primary',
                fieldLabel: 'Primary DNS',
                indentLevel: 1,
                maskRe: /[\d\.]/,
                regexText: 'Invalid IP address',
                validateOnChange: false,
                msgTarget: 'qtip',
                validator: function () {
                    var check = new DESKTOP.lib.isIpIn();
                    if (check.verify_ip(this.getValue())) {
                        return true;
                    } else {
                        return this.regexText;
                    }
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                itemId: 'dns_manual_secondary',
                xtype: 'textfield',
                qDefault: true,
                name: 'secondary',
                fieldLabel: 'Secondary DNS',
                indentLevel: 1,
                maskRe: /[\d\.]/,
                regexText: 'Invalid IP address',
                validateOnChange: false,
                msgTarget: 'qtip',
                validator: function () {
                    var check = new DESKTOP.lib.isIpIn();
                    if (check.verify_ip(this.getValue())) {
                        return true;
                    } else {
                        return this.regexText;
                    }
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                itemId: 'dns_manual_search_path',
                xtype: 'textfield',
                qDefault: true,
                name: 'search_path',
                fieldLabel: 'DNS search path',
                indentLevel: 1
            }]
        }]
    }]
});
