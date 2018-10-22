Ext.define('DESKTOP.SystemSetup.network.view.Advanced', {
    extend: 'Ext.form.Panel',
    alias: 'widget.advanced',
    requires: [
        'DESKTOP.SystemSetup.network.controller.AdvancedController',
        'DESKTOP.SystemSetup.network.model.AdvancedModel',
        'DESKTOP.lib.isIpIn'
    ],
    controller: 'advanced',
    viewModel: {
        type: 'advanced'
    },
    itemId: 'Advanced',
    title: "Advanced",
    frame: true,
    // width: 600,
    //bodyPadding: 20,
    url: 'app/SystemSetup/backend/network/Advanced.php',
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    fieldDefaults: {
        msgTarget: 'qtip'
    },
    trackResetOnLoad: true,
    listeners: {
        beforedestroy: function (form) {
            Ext.TaskManager.stopAll();
        }
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
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                text: 'Ping / Traceroute'
            }]
        }, {
            xtype: 'label',
            qDefault: true,
            text: 'Diagnostic tools provides ping and traceroute to diag out what happen between host and system.'
        }, {
            xtype: 'toolbar',
            qDefault: true,
            border: false,
            width: '100%',
            items: [{
                xtype: 'combobox',
                qDefault: true,
                width: 100,
                store: Ext.create('Ext.data.Store', {
                    fields: ['diagmode'],
                    data: [{
                        "diagmode": "Ping"
                    }, {
                        "diagmode": "Traceroute"
                    }]
                }),
                value: 'Ping',
                //typeAhead: true,
                queryMode: 'local',
                valueField: 'diagmode',
                displayField: 'diagmode',
                editable: false,
                fields: ["diagmode"],
                listeners: {
                    change: function (combo, newvaule) {
                        combo.resetOriginalValue(newvaule);
                    }
                }
            }, {
                xtype: 'textfield',
                qDefault: true,
                itemId: 'pingip',
                fieldLabel: 'IP Address',
                validateOnChange: false,
                listeners: {
                    change: function (text, newvaule) {
                        text.resetOriginalValue(newvaule);
                    }
                }
            }, {
                xtype: 'combobox',
                qDefault: true,
                width: 100,
                store: Ext.create('Ext.data.Store', {
                    fields: ['ipmode'],
                    data: [{
                        "ipmode": "IPv4"
                    }, {
                        "ipmode": "IPv6"
                    }]
                }),
                value: 'IPv4',
                //typeAhead: true,
                queryMode: 'local',
                valueField: 'ipmode',
                editable: false,
                displayField: 'ipmode',
                fields: ["ipmode"],
                listeners: {
                    change: function (combo, newvaule) {
                        combo.resetOriginalValue(newvaule);
                    }
                }
            }, '->', {
                xtype: 'button',
                qDefault: true,
                text: 'Start',
                handler: 'onStart'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'textareafield',
                qDefault: true,
                width: '100%',
                height: 100,
                readOnly: true,
                scrollable: true,
                listeners: {
                    change: function (text, newvaule) {
                        text.resetOriginalValue(newvaule);
                    }
                }
                // preventScrollbars: true
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
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Loopback',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                itemId: 'loopbackchd',
                name: 'loopback_enable',
                inputValue: 1,
                uncheckedValue: 0,
                listeners: {
                    change: function (checkbox, isChecked) {
                        var ct = checkbox.up('form').down('#conLoopbackchd');
                        var combo = ct.down('combobox');
                        if (isChecked) {
                            if (combo.getValue() === null) {
                                var comboval = combo.getStore().getAt(0);
                                if (comboval !== null) {
                                    combo.select(comboval);
                                    combo.fireEvent('select', combo, comboval);
                                }
                            }
                            ct.enable();
                        } else {
                            ct.disable();
                        }
                    }
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            itemId: 'conLoopbackchd',
            disabled: true,
            items: [{
                xtype: 'combobox',
                qDefault: true,
                labelWidth: 0,
                reference: 'loopback',
                width: 150,
                name: 'loopback_nic_id',
                bind: {
                    store: '{lobkcombo}'
                },
                queryMode: 'local',
                valueField: 'id',
                displayField: 'name',
                editable: false,
                fields: ['name', 'id'],
                //typeAhead: true,
                listeners: {
                    select: function (combobox, record) {
                        combobox.next('textfield').setValue(record.data.address);
                    }
                }
            }, {
                xtype: 'textfield',
                qDefault: true,
                name: 'loopback_addr',
                fieldLabel: 'IP Address',
                readOnly: true
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
                text: 'ARP',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'label',
            qDefault: true,
            text: 'Diagnostic ARP (Address Resolution Protocol) provides table mapping IP-address-to-MAC-address.'
        }, {
            xtype: 'toolbar',
            qDefault: true,
            border: false,
            width: '100%',
            items: [{
                xtype: 'radiofield',
                qDefault: true,
                boxLabel: 'All',
                fieldLabel: 'Condition',
                name: 'type',
                inputValue: 'all',
                value: 'all',
                checked: true
            }, {
                xtype: 'radiofield',
                qDefault: true,
                name: 'type',
                inputValue: 'ip',
                listeners: {
                    change: function (checkbox, isChecked) {
                        var tf = checkbox.next('textfield');
                        if (isChecked) {
                            tf.enable();
                        } else {
                            tf.disable();
                        }
                    }
                }
            }, {
                xtype: 'textfield',
                qDefault: true,
                fieldLabel: 'IP Address',
                disabled: true,
                maskRe: /[\d\.]/
            }, '->', {
                xtype: 'button',
                qDefault: true,
                text: 'Flush',
                handler: 'onFlush'
            }, {
                xtype: 'button',
                qDefault: true,
                text: 'Cancel',
                handler: 'onCancel'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'gridpanel',
                qDefault: true,
                width: '100%',
                height: 300,
                bind: '{arpGrid}',
                forceFit: true,
                columns: [{
                    text: 'IP Address',
                    dataIndex: 'addr',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'MAC address',
                    dataIndex: 'mac',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Interface',
                    dataIndex: 'iface',
                    sortable: false,
                    menuDisabled: true
                }]
            }]
        }]
    }]
});
