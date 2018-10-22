Ext.define('DESKTOP.SystemSetup.network.view.IPv6Setting', {
    /* Design UI layout*/
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    requires: [
        'DESKTOP.lib.isIpIn'
    ],
    alias: 'widget.IPv6Setting',
    controller: 'netipv6',
    title: 'Network interface setting',
    closeAction: 'destroy',
    resizable: false,
    modal: true,
    width: 500,
    msgTarget: 'qtip',
    items: [{
        xtype: 'form',
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
                    text: 'Checked IPv6, LAN support IPv6 protocol.',
                    labelFontWeight: 'bold',
                    labelFontColor: 'title'
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    text: 'You can select "Automatic" "DHCP" to acquire an IP address automatically, or select "Static" to specify an IP address manually.'
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'radiogroup',
                    qDefault: true,
                    reference: 'radios',
                    layout: 'vbox',
                    maskOnDisable: true, // sloves mask problem
                    items: [
                    {
                        boxLabel: 'Automatic',
                        name: 'ipv6_type',
                        inputValue: 'automatic'
                    }, {
                        boxLabel: 'DHCP',
                        name: 'ipv6_type',
                        inputValue: 'dhcp'
                    }, {
                        boxLabel: 'Static',
                        name: 'ipv6_type',
                        inputValue: 'static',
                        listeners: {
                            change: function (radioBtn, isChecked) {
                                var Turn = radioBtn.up('form').down('#disStatic');
                                if (isChecked)  Turn.enable();
                                else            Turn.disable();
                            }
                        }
                    }]
                }]
            }, {
                xtype: 'container',
                itemId: 'disStatic',
                customLayout: 'vlayout',
                disabled: true,
                qDefault: true,
                items: [
                {
                    xtype: 'container',
                    customLayout: 'hlayout',
                    items: [{
                        xtype: 'textfield',
                        msgTarget: 'qtip',
                        qDefault: true,
                        indentLevel: 1,
                        allowBlank: false,
                        validateOnChange: false,
                        fieldLabel: 'IPv6 address:',
                        name: 'ipv6_global_addr',
                        itemId: 'ipv6_global_addr',
                        regexText: 'Must be a numeric or hexadecimal IP address',
                        maskRe: /[0-9A-Fa-f:.]+/,
                        validator: function () {
                            var check = new DESKTOP.lib.isIpIn();
                            return (check.verify_ipv6(this.getValue()) ? true : this.regexText);
                        }
                    }]
                }, {
                    xtype: 'container',
                    customLayout: 'hlayout',
                    items: [{
                        xtype: 'textfield',
                        msgTarget: 'qtip',
                        qDefault: true,
                        indentLevel: 1,
                        allowBlank: false,
                        validateOnChange: false,
                        fieldLabel: 'Prefix length:',
                        name: 'ipv6_prefix',
                        itemId: 'ipv6_prefix',
                        regexText: 'Must be in range 0 ~ 128',
                        maskRe: /^[\d]$/,
                        validator: function () {
                            var check = new DESKTOP.lib.isIpIn();
                            return (check.verify_ipv6_prefix(this.getValue()) ? true : this.regexText);
                        }
                    }]
                }, {
                    xtype: 'container',
                    customLayout: 'hlayout',
                    items: [{
                        xtype: 'textfield',
                        msgTarget: 'qtip',
                        qDefault: true,
                        indentLevel: 1,
                        allowBlank: false,
                        validateOnChange: false,
                        fieldLabel: 'Gateway:',
                        name: 'ipv6_gateway',
                        itemId: 'ipv6_gateway',
                        regexText: 'Must be a numeric or hexadecimal IP address',
                        maskRe: /[0-9A-Fa-f:.]+/,
                        validator: function () {
                            var check = new DESKTOP.lib.isIpIn();
                            return (check.verify_ipv6(this.getValue()) ? true : this.regexText);
                        }
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
                click: 'Setting_Apply'
            }
        }]
    }]
});
