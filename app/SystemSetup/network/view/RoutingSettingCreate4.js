Ext.define('DESKTOP.SystemSetup.network.view.RoutingSettingCreate4', {
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
    resizable: false,
    closeAction: 'destroy',
    width: 600,
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
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'Destination',
                    name: 'dst_addr',
                    itemId: 'Destination',
                    maskRe: /[\d\.]/,
                    regexText: 'Invalid IP address',
                    validateOnChange: false,
                    allowBlank: false,
                    validator: function () {
                        var form = this.up('form');
                        var check = new DESKTOP.lib.isIpIn();
                        if (check.verify_ip(form.down('#Destination').getValue())) {
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
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'Subnet Mask',
                    itemId: 'subnetmask',
                    name: 'mask',
                    maskRe: /[\d\.]/,
                    regexText: 'Must be a numeric mask address',
                    validateOnChange: false,
                    allowBlank: false,
                    validator: function () {
                        var form = this.up('form');
                        var check = new DESKTOP.lib.isIpIn();
                        if (check.verify_mask(form.down('#subnetmask').getValue())) {
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
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'Gateway',
                    name: 'gateway',
                    itemId: 'Gateway',
                    maskRe: /[\d\.]/
                    // regexText: 'Must be a numeric Mask address',
                    // validateOnChange: false,
                    // validator: function () {
                    //     var form = this.up('form');
                    //     var check = new DESKTOP.lib.isIpIn();
                    //     if (check.verify_ip(form.down('#Gateway').getValue())) {
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
                            combo.bindStore(Ext.ComponentQuery.query('#Routing')[0].getViewModel('routing').getStore('get_cur_iface'));
                            var selectipv4 = Ext.ComponentQuery.query('#routingipv4')[0].getSelectionModel().getSelection()[0];
                            var store = this.getStore('get_cur_iface');
                            var ifacevalue = null;
                            if (selectipv4) {
                                var idx = store.find('name', selectipv4.get('iface'));
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
                                    var ipv4ip = (Ext.JSON.decode(response.responseText)).data.ipv4_Addr;
                                    win.down('#IP_addr').setValue(ipv4ip);
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
                    itemId: 'IP_addr',
                    name: 'IP Address',
                    xtype: 'textfield',
                    qDefault: true,
                    editable: false,
                    allowBlank: false
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
            click: 'Setting_Apply_ipv4'
        }
    }]
});
