Ext.define('DESKTOP.StorageManagement.ssdcache.view.SsdCache', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ssdcache',
    itemId: 'SsdCache',
    requires: [
        'DESKTOP.StorageManagement.ssdcache.model.SsdCacheModel',
        'DESKTOP.StorageManagement.ssdcache.controller.SsdCacheController'
    ],
    controller: 'ssdcache',
    viewModel: {
        type: 'ssdcache'
    },
    layout: {
        type: 'border'
    },
    height: 570,
    width: 'auto',
    collapsible: true,
    // autoScroll: true,
    waitMsgTarget: true,
    listeners: {
        afterrender: 'afterview',
        beforedestroy: 'beforeDestroy'
    },
    items: [{
        region: 'west',
        xtype: 'panel',
        border: 1,
        lines: false,
        width: 260,
        layout: {
            type: 'vbox'
        },
        items: [{
            xtype: 'label',
            qDefault: true,
            bind: {
                text: '{poolname} SSD cache'
            },
            labelFontColor: 'title',
            labelFontWeight: 'bold'
        }, {
            xtype: 'form',
            width: 'auto',
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Status',
                labelFontWeight: 'bold',
                bind: {
                    value: '{poollist.selection.status}'
                }
            }, {
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Cache type',
                labelFontWeight: 'bold',
                bind: {
                    value: '{poollist.selection.cache_type}'
                }
            }, {
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'RAID type',
                labelFontWeight: 'bold',
                bind: {
                    value: '{poollist.selection.raid_type}'
                }
            }, {
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Hit rate',
                labelFontWeight: 'bold'
                    // bind: {
                    //     value: '{FreeGB}GB'
                    // }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'splitter'
        }, {
            xtype: 'label',
            qDefault: true,
            text: 'SSD cache size'
        }, {
            xtype: 'panel',
            width: 120,
            height: 120,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 75
            },
            layout: 'fit',
            items: [{
                xtype: 'polar',
                colors: ['#058be7', '#f1f1f1'],
                border: false,
                style: 'border:1px #f00 solid',
                // bind: {
                //     store: '{pie}'
                // },
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'size'],
                    data: [{
                        name: 'Used',
                        size: 30
                    }, {
                        name: 'Available',
                        size: 70
                    }]
                }),
                sprites: [{
                    type: 'text',
                    text: 'Used',
                    textAlign: 'center',
                    x: 60,
                    y: 55
                }, {
                    type: 'text',
                    text: '30%',
                    textAlign: 'center',
                    x: 60,
                    y: 75
                }],
                series: {
                    type: 'pie',
                    showInLegend: true,
                    // highlight: true,
                    tooltip: {
                        trackMouse: true,
                        renderer: function (record, data) {
                            this.setHtml(record.get('name') + ':' + record.get('size') + 'GB');
                        }
                    },
                    // label: {
                    //     field: 'name',
                    //     contrast: true,
                    // },
                    subStyle: {
                        strokeStyle: ['#058be7', '#f1f1f1'],
                        lineWidth: [0, 0, 0]
                    },
                    xField: 'size',
                    donut: 85
                }
            }]
        }]
    }, {
        region: 'center',
        xtype: 'panel',
        items: [{
            xtype: 'label',
            qDefault: true,
            text: 'Hit rate history'
        }, {
            xtype: 'cartesian',
            width: '100%',
            height: 100,
            store: Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'day',
                    type: 'date',
                    dateFormat: 'Y-m-d'
                }, {
                    name: 'data1',
                    type: 'float'
                }],
                data: [{
                    "day": "2015-03-01",
                    "data1": 10
                }, {
                    "day": "2015-03-02",
                    "data1": 20
                }, {
                    "day": "2015-03-03",
                    "data1": 30
                }, {
                    "day": "2015-03-04",
                    "data1": 80
                }, {
                    "day": "2015-03-05",
                    "data1": 100
                }, {
                    "day": "2015-03-06",
                    "data1": 50
                }]
            }),
            // insetPadding: 40,
            // innerPadding: {
            //     left: 40,
            //     right: 40
            // },
            axes: [{
                type: 'numeric',
                fields: 'data1',
                position: 'left',
                grid: true,
                minimum: 0
                    // renderer: function (v, layoutContext) {
                    //     return '$' + layoutContext.renderer(v);
                    // }
            }, {
                type: 'time',
                fields: 'day',
                position: 'bottom',
                dateFormat: 'M d',
                grid: true,
                label: {
                    rotate: {
                        degrees: -90
                    }
                }
            }],
            series: [{
                type: 'line',
                xField: 'name',
                yField: 'data1',
                style: {
                    lineWidth: 4
                },
                marker: {
                    radius: 4
                },
                // label: {
                //     field: 'data1',
                //     display: 'over'
                // },
                highlight: {
                    fillStyle: '#000',
                    radius: 5,
                    lineWidth: 2,
                    strokeStyle: '#fff'
                },
                tooltip: {
                    trackMouse: true,
                    style: 'background: #fff',
                    showDelay: 0,
                    dismissDelay: 0,
                    hideDelay: 0,
                    renderer: function (storeItem, item) {
                        this.setHtml(Ext.Date.format(storeItem.get('day'), "m/d/Y") + ': $' + storeItem.get('data1'));
                    }
                }
            }]
        }, {
            xtype: 'label',
            qDefault: true,
            text: 'SSD cache drive location'
        }, {
            xtype: 'container',
            qDefault: true,
            itemId: 'images',
            style: {
                marginTop: '30px',
                marginLeft: '30px'
            },
            width: 500,
            height: 300,
            // layout: 'absolute',
            items: [{
                xtype: 'container',
                qDefault: true,
                style: {
                    marginLeft: '10px',
                    marginRight: '10px'
                },
                layout: 'absolute',
                itemId: 'drawing',
                width: 350,
                height: 200,
                border: true,
                items: [{
                    xtype: 'image',
                    width: 350,
                    src: 'app/StorageManagement/images/rack_24bay.png'
                }]
            }]
        }]
    }, {
        region: 'south',
        xtype: 'panel',
        height: 170,
        layout: 'vbox',
        items: [{
            xtype: 'toolbar',
            width: '100%',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'SSD cache',
                labelFontColor: 'title',
                labelFontWeight: 'bold'
            }, '->', {
                xtype: 'button',
                qDefault: true,
                itemId: 'btn_edit',
                text: 'Edit',
                disabled: true,
                focusable: false, // avoid button being focused after pressed
                handler: 'on_edit'
            }, {
                xtype: 'button',
                qDefault: true,
                temId: 'btn_delete',
                text: 'Delete',
                disabled: true,
                focusable: false, // avoid button being focused after pressed
                handler: 'on_delete',
                bind: {
                    disabled: '{!poollist.selection}'
                }
            }]
        }, {
            xtype: 'gridpanel',
            qDefault: true,
            width: '100%',
            height: 120,
            itemId: 'poollist',
            reference: 'poollist',
            viewConfig: {
                loadMask: false
            },
            forceFit: true,
            // bind: {
            //     store: '{cacheInfo}'
            // },
            listeners: {
                select: 'on_gridselect',
                itemcontextmenu: 'rightclick'
            },
            columns: [{
                text: 'Status',
                dataIndex: 'region_name',
                width: 100,
                sortable: false,
                resizable: false,
                menuDisabled: true
            }, {
                text: 'Pool name',
                dataIndex: 'pool_name',
                menuDisabled: true,
                resizable: false,
                sortable: false
            }, {
                text: 'Cache type',
                dataIndex: 'cache_type',
                menuDisabled: true,
                resizable: false,
                sortable: false
            }, {
                text: 'Size ',
                dataIndex: 'size',
                menuDisabled: true,
                resizable: false,
                sortable: false,
                renderer: function (val) {
                    return val + ' GB';
                }
            }, {
                text: 'RAID type',
                dataIndex: 'raid_type',
                menuDisabled: true,
                sortable: false
            }]
        }]
    }]
});
