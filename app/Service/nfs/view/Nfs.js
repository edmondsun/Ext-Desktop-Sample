Ext.define('DESKTOP.Service.nfs.view.Nfs', {
    extend: 'Ext.form.Panel',
    alias: 'widget.nfs',
    requires: [
        'DESKTOP.Service.nfs.controller.NfsController',
        'DESKTOP.Service.nfs.model.NfsModel'
    ],
    controller: 'nfs',
    viewModel: {
        type: 'nfs'
    },
    itemId: 'Nfs',
    title: "Nfs",
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    bodyPadding: 20,
    fieldDefaults: {
        labelWidth: 130,
        msgTarget: 'side'
    },
    items: [{
        xtype: 'form',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                reference: 'NFS_ENABLE',
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable NFS service',
                itemId: 'nfs_enable',
                name: 'enable',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                inputValue: true,
                uncheckedValue: false
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'textfield',
                    itemId: 'nfs_domain',
                    name: 'nfs4_domain',
                    fieldLabel: 'NFSv4 domain',
                    allowBlank: true,
                    regexText: 'Invalid IP address',
                    validateOnChange: false,
                    validator: function () {
                        var check = new DESKTOP.lib.isIpIn();
                        var me    = this;
                        if (check.verify_ip(me.getValue())) {
                            return true;
                        } else {
                            return me.regexText;
                        }
                    },
                    bind: {
                        disabled: '{!NFS_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'port',
                    name: 'port',
                    fieldLabel: 'Port number',
                    allowBlank: false,
                    msgTarget: 'qtip',
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    minValue: 1,
                    maxValue: 65535,
                    listeners: {
                        blur: function(el) {
                            var me = this;

                            if (me.getValue() === undefined) {
                                return;
                            }

                            if (me.getValue().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!NFS_ENABLE.checked}'
                    }
                }]
            }]
        }]
    }]
});
