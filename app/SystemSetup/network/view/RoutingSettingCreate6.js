Ext.define('DESKTOP.SystemSetup.network.view.RoutingSettingCreate6', {
    /* Design UI layout*/
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    requires: [
        'DESKTOP.SystemSetup.network.model.RoutingModel',
        'DESKTOP.lib.isIpIn'
    ],
    controller: 'routing',
    viewModel: {
        type: 'routing'
    },
    //bodyPadding: 20,
    width: 600,
    closeAction: 'destroy',
    modal: true,
    items: [{
        xtype: 'form',
        waitMsgTarget: true,
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    fieldLabel: 'Destination',
                    name: 'dst_addr',
                    itemId: 'Destination',
                    xtype: 'textfield',
                    qDefault: true,
                    //maskRe: /[\d\.]/,
                    regexText: 'Must be a IPv6 address',
                    validateOnChange: false,
                    msgTarget: 'qtip',
                    validator: function () {
                        var check = new DESKTOP.lib.isIpIn();
                        if (check.verify_ipv6(this.getValue())) {
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
                    fieldLabel: 'Prefix',
                    itemId: 'Prefix',
                    xtype: 'textfield',
                    qDefault: true,
                    name: 'mask',
                    maskRe: /[\d\.]/,
                    allowBlank: false,
                    regexText: 'Invalid prefix length',
                    validateOnChange: false,
                    msgTarget: 'qtip',
                    validator: function () {
                        var check = new DESKTOP.lib.isIpIn();
                        if (check.verify_ipv6_prefix(this.getValue())) {
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
                    fieldLabel: 'Gateway',
                    name: 'gateway',
                    itemId: 'Gateway',
                    xtype: 'textfield',
                    qDefault: true
                    // regexText: 'Must be a numeric IPv6 address',
                    // validateOnChange: false,
                    // msgTarget: 'qtip',
                    // validator: function () {
                    //     var check = new DESKTOP.lib.isIpIn();
                    //     if (check.verify_ipv6(this.getValue())) {
                    //         return true;
                    //     } else {
                    //         return this.regexText;
                    //     }
                    // }
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    qDefault: true,
                    hideTrigger: true,
                    fieldLabel: 'Metric',
                    name: 'metric',
                    itemId: 'Metric',
                    maskRe: /[\d\.]/,
                    maxValue: 65535,
                    minValue: 1,
                    allowBlank: false,
                    value: 1
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'combobox',
                    qDefault: true,
                    itemId: 'Interfaces',
                    name: 'iface',
                    fieldLabel: 'Interfaces',
                    editable: false,
                    queryMode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    fields: ["name", "value"],
                    listeners: {
                        beforerender: function (combo, eOpts) {
                            combo.bindStore(Ext.ComponentQuery.query('#Routing')[0].getViewModel('routing').getStore('get_cur_iface_ipv6'));
                            var store = this.getStore('get_cur_iface_ipv6');
                            var ifacevalue = null;
                            var selectipv6 = Ext.ComponentQuery.query('#routingipv6')[0].getSelectionModel().getSelection()[0];
                            if (selectipv6) {
                                var idx = store.find('name', selectipv6.get('iface'));
                                ifacevalue = store.getAt(idx).data.value;
                                combo.setValue(ifacevalue);
                            } else {
                                if (store.getAt(0) !== null) {
                                    ifacevalue = store.getAt(0).data.value;
                                    combo.select(ifacevalue);
                                    combo.fireEvent('select');
                                }
                            }
                        },
                        select: function () {
                            var ifacevalue = this.getValue();
                            var win = this.up('window');
                            Ext.Ajax.request({
                                url: 'app/SystemSetup/backend/network/Interfaces.php',
                                method: 'get',
                                params: {
                                    op: 'get_iface_addr',
                                    iface: ifacevalue
                                },
                                success: function (response, combo) {
                                    var ipv6ip = (Ext.JSON.decode(response.responseText)).data.ipv6_Addr;
                                    win.down('#IP_addr').setValue(ipv6ip);
                                },
                                failure: function () {
                                    Ext.Msg.alert("Failed", "Something wrong!");
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
                    fieldLabel: 'IP Address',
                    name: 'IP Address',
                    itemId: 'IP_addr',
                    xtype: 'textfield',
                    qDefault: true,
                    allowBlank: true,
                    editable: false
                    // regexText: 'Must be IPv6 address',
                    // validateOnChange: false,
                    // msgTarget: 'qtip',
                    // validator: function () {
                    //     var check = new DESKTOP.lib.isIpIn();
                    //     if (check.verify_ipv6(this.getValue())) {
                    //         return true;
                    //     } else {
                    //         return this.regexText;
                    //     }
                    // }
                }]
            }]
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        buttonType: 'cancel',
        qDefault: true,
        listeners: {
            click: function () {
                this.up('window').close();
            }
        }
    }, {
        text: 'Confirm',
        qDefault: true,
        buttonType: 'primary',
        listeners: {
            click: 'Setting_Apply_ipv6'
        }
    }]
});
