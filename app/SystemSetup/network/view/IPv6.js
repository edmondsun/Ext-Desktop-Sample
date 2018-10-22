Ext.define('DESKTOP.SystemSetup.network.view.IPv6', {
    extend: 'Ext.form.Panel',
    alias: 'widget.netipv6',
    requires: [
        'DESKTOP.SystemSetup.network.model.IPv6Model',
        'DESKTOP.SystemSetup.network.controller.IPv6Controller'
    ],
    controller: 'netipv6',
    viewModel: {
        type: 'netipv6'
    },
    itemId: 'Ipv6',
    title: 'IPv6',
    frame: true,
    collapsible: true,
    //autoScroll: true,
    waitMsgTarget: true,
    fieldDefaults: {
        labelWidth: 150,
        msgTarget: 'side'
    },
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
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable IPv6',
                reference: 'enableBox',
                name: 'enableBox',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            reference: 'infotools',
            hidden: true,
            items: [{
                xtype: 'toolbar',
                qDefault: true,
                width: '100%',
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    text: 'Interface'
                }, '->', {
                    text: 'Edit',
                    qDefault: true,
                    focusable: false,
                    listeners: {
                        click: 'onEdit'
                    }
                }]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            reference: 'infopanel',
            hidden: true,
            allowDeselect: true,
            items: [{
                xtype: 'gridpanel',
                reference: 'nic6',
                qDefault: true,
                enableColumnMove: false,
                forceFit: true,
                width: '100%',
                bind: '{netipv6}',
                selModel: {
                    selType: 'rowmodel',
                    mode: 'SINGLE',
                    allowDeselect: true,
                    deselectOnContainerClick: true
                },
                columns: [{
                    text: 'Interfaces',
                    dataIndex: 'name',
                    width: 45,
                    menuDisabled: true,
                    hideable: false
                }, {
                    text: 'IPv6 Address',
                    dataIndex: 'ipv6_global_addr',
                    menuDisabled: true,
                    hideable: false
                }, {
                    text: 'IPv6 Gateway',
                    dataIndex: 'ipv6_gateway',
                    menuDisabled: true,
                    hideable: false
                }, {
                    text: 'IPv6 Type',
                    dataIndex: 'ipv6_type',
                    width: 45,
                    menuDisabled: true,
                    hideable: false
                }]
            }]
        }]
    }]
});
