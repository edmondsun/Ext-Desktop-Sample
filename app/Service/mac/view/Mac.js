Ext.define('DESKTOP.Service.mac.view.Mac', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mac',
    requires: [
        'DESKTOP.Service.mac.controller.MacController',
        'DESKTOP.Service.mac.model.MacModel'
    ],
    controller: 'mac',
    viewModel: {
        type: 'mac'
    },
    itemId: 'Mac',
    title: "Mac",
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
                reference: 'AFP_ENABLE',
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable AFP service',
                itemId: 'mac_afp_enable',
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
                    xtype: 'numberfield',
                    itemId: 'mac_port',
                    name: 'port',
                    fieldLabel: 'Port number',
                    msgTarget: 'qtip',
                    maskRe: /^[0-9]*/,
                    regex: /^[0-9]*/,
                    regexText: 'Invalid number',
                    minValue: 1,
                    maxValue: 65535,
                    allowBlank: false,
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
                        disabled: '{!AFP_ENABLE.checked}'
                    }
                }]
            }]
        }]
    }]
});
