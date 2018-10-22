Ext.define('DESKTOP.SystemSetup.network.view.InterfacesSetting', {
    /* Design UI layout*/
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    //bodyPadding: 20,
    closeAction: 'destroy',
    title: 'Network interface setting',
    requires: [
        'DESKTOP.lib.isIpIn'
    ],
    viewModel:{
        data:null
    },
    width: 600,
    items: [{
        xtype: 'form',
        msgTarget: 'qtip',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                itemId: 'name',
                labelFontColor: 'title',
                labelFontWeight: 'bold',
                bind: {
                    text: '{selectData.name}'
                }
            }, {
                xtype: 'container',
                qDefault: true,
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    text: 'You can select "DHCP" or "BOOTP" to acquire an IP address automatically,or select "Static" to  ' +
                        'specify an IP address manually.'
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    itemId: 'nisradio',
                    xtype: 'radiofield',
                    qDefault: true,
                    indentLevel: 1,
                    boxLabel: 'DHCP',
                    name: 'type',
                    inputValue: 'dhcp',
                    bind: {
                        value: '{selectData.type}'
                    }
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'radiofield',
                    qDefault: true,
                    boxLabel: 'BOOTP',
                    name: 'type',
                    inputValue: 'bootp',
                    indentLevel: 1
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'radiofield',
                    qDefault: true,
                    boxLabel: 'Static',
                    name: 'type',
                    inputValue: 'static',
                    indentLevel: 1,
                    listeners: {
                        change: function (radio, isChecked) {
                            var ctn = radio.up('form').down('#static_status');
                            if (isChecked) {
                                ctn.enable();
                            } else {
                                ctn.disable();
                            }
                        }
                    }
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'vlayout',
                itemId: 'static_status',
                disabled: true,
                items: [{
                    itemId: 'nisadr',
                    xtype: 'textfield',
                    qDefault: true,
                    indentLevel: 2,
                    name: 'address',
                    fieldLabel: 'IP address',
                    bind: '{selectData.address}',
                    allowBlank: false,
                    maskRe: /[\d\.]/,
                    regexText: 'Invalid IP address',
                    // validateOnChange: false,
                    validator: function (val) {
                        var form = this.up('form');
                        var check = new DESKTOP.lib.isIpIn();
                        if (check.verify_ip(val)) {
                            return true;
                        } else {
                            return this.regexText;
                        }
                    }
                }, {
                    itemId: 'nismask',
                    name: 'mask',
                    xtype: 'textfield',
                    qDefault: true,
                    indentLevel: 2,
                    fieldLabel: 'Subnet Mask',
                    bind: '{selectData.mask}',
                    allowBlank: false,
                    maskRe: /[\d\.]/,
                    regexText: 'Invalid IP address',
                    validateOnChange: false,
                    validator: function () {
                        var form = this.up('form');
                        var check = new DESKTOP.lib.isIpIn();
                        if (check.verify_mask(form.down('#nismask').getValue())) {
                            return true;
                        } else {
                            return this.regexText;
                        }
                    }
                }, {
                    itemId: 'nisgw',
                    name: 'gateway',
                    xtype: 'textfield',
                    qDefault: true,
                    indentLevel: 2,
                    fieldLabel: 'Gateway',
                    bind: '{selectData.gateway}',
                    maskRe: /[\d\.]/,
                    regexText: 'Invalid IP address',
                    validateOnChange: false,
                    validator: function (val) {
                        var form = this.up('form');
                        var check = new DESKTOP.lib.isIpIn();
                        if (check.is_ip_in(form.down('#nisadr').getValue(),val,form.down('#nismask').getValue())) {
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
                    xtype: 'combobox',
                    qDefault: true,
                    name: 'mtu_size',
                    itemId: 'nismtu',
                    indentLevel: 1,
                    editable: false,
                    fieldLabel: 'Jumbo Frame',
                    bind: '{selectData.mtu}',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['mtu'],
                        data: [{
                            "mtu": 1500
                        }, {
                            "mtu": 9000
                        }]
                    }),
                    queryMode: 'local',
                    valueField: 'mtu',
                    displayField: 'mtu',
                    fields: ["mtu"]
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    itemId: 'nisvlanck',
                    xtype: 'checkboxfield',
                    qDefault: true,
                    boxLabel: 'Enable VLAN',
                    name: 'enable_vlan',
                    bind: '{selectData.vlan_enable}',
                    inputValue: 1,
                    uncheckedValue: 0,
                    listeners: {
                        change: function (radio, isChecked) {
                            var nisvlan = radio.up('form').down('#nisvlan');
                            if (isChecked) {
                                nisvlan.enable();
                                if(nisvlan.getValue()===0){
                                    nisvlan.setValue(2);
                                }
                            } else {
                                nisvlan.disable();
                            }
                        }
                    }
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    itemId: 'nisvlan',
                    name: 'vlan_id',
                    indentLevel: 1,
                    xtype: 'numberfield',
                    qDefault: true,
                    hideTrigger: true,
                    maskRe: /[\d\.]/,
                    fieldLabel: 'VLAN ID',
                    disabled: 'true',
                    maxValue: 4094,
                    minValue: 2,
                    allowBlank: false,
                    bind: '{selectData.vlan_id}'
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'textfield',
                    qDefault: true,
                    itemId: 'id',
                    name: 'id',
                    hidden: true,
                    bind: '{selectData.id}'
                }]
            }]
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        buttonType: 'cancel',
        qDefault: true,
        handleMouseEvents: false,
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
            click: function () {
                var win = this.up('window');
                var form = win.down('form').getForm();
                if (form.isValid()) {
                    win.mask('Saving...');
                    form.submit({
                        url: 'app/SystemSetup/backend/network/Interfaces.php',
                        params: {
                            op: 'nic_setting'
                        },
                        success: function (form, action) {
                            win.unmask();
                            Ext.Msg.alert('Success', action.result.msg);
                            win.close();
                            //Ext.ComponentQuery.query('#Interface')[0].getViewModel('netinterfaces').getStore('netGrid').reload();
                        },
                        failure: function (form, action) {
                            win.unmask();
                            Ext.Msg.alert('Failed', action.result.msg);
                        }
                    });
                } else {
                    Ext.Msg.alert('Warning', 'Please correct form errors.');
                }
            }
        }
    }]
});
