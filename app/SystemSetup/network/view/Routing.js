Ext.define('DESKTOP.SystemSetup.network.view.Routing', {
    extend: 'Ext.form.Panel',
    alias: 'widget.routing',
    requires: [
        'DESKTOP.SystemSetup.network.controller.RoutingController',
        'DESKTOP.SystemSetup.network.model.RoutingModel'
    ],
    controller: 'routing',
    viewModel: {
        type: 'routing'
    },
    itemId: 'Routing',
    title: "Routing",
    frame: true,
    // width: 600,
    //bodyPadding: 20,
    collapsible: true,
    waitMsgTarget: true,
    fieldDefaults: {
        labelWidth: 150,
        msgTarget: 'side'
    },
    trackResetOnLoad: true,
    // listeners:{
    //     afterrender:function(view){
    //         view.up("#appwindow").down("#tabs").on('tabchange',view.getController().OK,this);
    //     }
    // },
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
                text: 'IPv4 static route',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'toolbar',
                qDefault: true,
                width: '100%',
                defaults: {
                    xtype: 'button',
                    qDefault: true
                },
                items: [{
                    text: 'Add IPv4 static route',
                    listeners: {
                        click: 'CreateIPv4'
                    }
                }, '->', {
                    text: 'Edit',
                    focusable: false, // avoid button being focused after pressed
                    itemId: 'EditIPv4',
                    bind: {
                        disabled: '{!static_routing_ipv4.selection}'
                    },
                    listeners: {
                        click: 'onEdit'
                    }
                }, {
                    text: 'Delete',
                    itemId: 'DeleteIPv4',
                    bind: {
                        disabled: '{!static_routing_ipv4.selection}'
                    },
                    listeners: {
                        click: 'onDelete'
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
                maxHeight: 300,
                itemId: 'routingipv4',
                reference: 'static_routing_ipv4',
                width: '100%',
                bind: '{ipv4_static_route}',
                forceFit: true,
                listeners: {
                    select: 'ipv4gridselect'
                },
                columns: [{
                    text: 'ID',
                    dataIndex: 'id_UI',
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                }, {
                    text: 'Destination',
                    dataIndex: 'dst_addr',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Subnet Mask',
                    dataIndex: 'mask',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Gateway',
                    dataIndex: 'gateway',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Metric',
                    dataIndex: 'metric',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Interfaces',
                    dataIndex: 'iface',
                    sortable: false,
                    menuDisabled: true
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
                text: 'IPv4 routing table',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'gridpanel',
                qDefault: true,
                width: '100%',
                disableSelection: true,
                maxHeight: 300,
                bind: '{ipv4_routing_table}',
                forceFit: true,
                columns: [{
                    text: 'ID',
                    dataIndex: 'id_UI',
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                }, {
                    text: 'Destination',
                    dataIndex: 'dst_addr',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Subnet Mask',
                    dataIndex: 'mask',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Gateway',
                    dataIndex: 'gateway',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Metric',
                    dataIndex: 'metric',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Interfaces',
                    dataIndex: 'iface',
                    sortable: false,
                    menuDisabled: true
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
                text: 'IPv6 static route',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'toolbar',
                bind: {
                    disabled: '{!ipv6_is_enabled}'
                },
                qDefault: true,
                width: '100%',
                defaults: {
                    xtype: 'button',
                    qDefault: true
                },
                items: [{
                    text: 'Add IPv6 static route',
                    handler: 'CreateIPv6'
                }, '->', {
                    text: 'Edit',
                    focusable: false, // avoid button being focused after pressed
                    itemId: 'EditIPv6',
                    bind: {
                        disabled: '{!static_routing_ipv6.selection}'
                    },
                    listeners: {
                        click: 'onEdit'
                    }
                }, {
                    text: 'Delete',
                    itemId: 'DeleteIPv6',
                    bind: {
                        disabled: '{!static_routing_ipv6.selection}'
                    },
                    listeners: {
                        click: 'onDelete'
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
                itemId: 'routingipv6',
                width: '100%',
                reference: 'static_routing_ipv6',
                maxHeight: 300,
                bind: '{ipv6_static_route}',
                forceFit: true,
                listeners: {
                    select: 'ipv6gridselect'
                },
                enableLocking: true,
                columns: [{
                    text: 'ID',
                    dataIndex: 'id_UI',
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                }, {
                    text: 'Destination',
                    dataIndex: 'dst_addr',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Prefix',
                    dataIndex: 'prefix',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Gateway',
                    dataIndex: 'gateway',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Metric',
                    dataIndex: 'metric',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Interfaces',
                    dataIndex: 'iface',
                    sortable: false,
                    menuDisabled: true
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
                text: 'IPv6 routing table',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'gridpanel',
                qDefault: true,
                width: '100%',
                maxHeight: 300,
                disableSelection: true,
                bind: '{ipv6_routing_table}',
                forceFit: true,
                columns: [{
                    text: 'ID',
                    dataIndex: 'id_UI',
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                }, {
                    text: 'Destination',
                    dataIndex: 'dst_addr',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Prefix',
                    dataIndex: 'prefix',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Gateway',
                    dataIndex: 'gateway',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Metric',
                    dataIndex: 'metric',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Interfaces',
                    dataIndex: 'iface',
                    sortable: false,
                    menuDisabled: true
                }]
            }]
        }]
    }]
});
