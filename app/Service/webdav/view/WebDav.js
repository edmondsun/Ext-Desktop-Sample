Ext.define('DESKTOP.Service.webdav.view.WebDav', {
    extend: 'Ext.form.Panel',
    alias: 'widget.webdav',
    requires: [
        'DESKTOP.Service.webdav.controller.WebDavController',
        'DESKTOP.Service.webdav.model.WebDavModel'
    ],
    controller: 'webdav',
    viewModel: {
        type: 'webdav'
    },
    itemId: 'WebDav',
    title: 'WebDav',
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
                reference: 'WEBDAV_ENABLE',
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable WebDAV service',
                itemId: 'webdav_enable',
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
                    itemId: 'webdav_port',
                    name: 'webdav_port',
                    fieldLabel: 'WebDAV Port',
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

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!WEBDAV_ENABLE.checked}'
                    }
                }]
            },{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'numberfield',
                    itemId: 'webdavs_port',
                    name: 'webdavs_port',
                    fieldLabel: 'WebDAVS Port',
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

                            if (me.getValue() === null) {
                                return;
                            }

                            if (me.getValue().toString().indexOf('.') != -1) {
                                el.reset();
                            }
                        }
                    },
                    bind: {
                        disabled: '{!WEBDAV_ENABLE.checked}'
                    }
                }]
            }]
        }]
    }]
});
