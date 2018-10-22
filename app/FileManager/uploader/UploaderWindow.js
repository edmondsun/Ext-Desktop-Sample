/**
 * @class Ext.ux.upload.plugin.Window
 * @extends Ext.AbstractPlugin
 *
 * @author Harald Hanek (c) 2011-2012
 * @license http://harrydeluxe.mit-license.org
 */
Ext.define('DESKTOP.FileManager.uploader.UploaderWindow', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.ux.upload.window',
    constructor: function (config) {
        var me = this;
        Ext.apply(me, config);
        me.callParent(arguments);
    },
    init: function (cmp) {
        var me = this,
            uploader = cmp.uploader;
        cmp.on({
            filesadded: {
                fn: function (uploader, files) {
                    me.window.show();
                },
                scope: me
            },
            updateprogress: {
                fn: function (uploader, total, percent, sent, success, failed, queued, speed) {
                    // var t = Ext.String.format('Upload {0}% ({1} von {2})', percent, sent, total);
                    // me.statusbar.showBusy({
                    //     text: t,
                    //     clear: false
                    // });
                },
                scope: me
            },
            uploadprogress: {
                // fn: function (uploader, file, name, size, percent) {
                //     me.statusbar.setText(name + ' ' + percent + '%');
                // },
                // scope: me
            },
            uploadcomplete: {
                fn: function (uploader, success, failed) {
                    // if(failed.length == 0)
                    //     me.window.hide();
                },
                scope: me
            }
        });
        // me.statusbar = new Ext.ux.StatusBar({
        //     dock: 'bottom',
        //     id: 'form-statusbar',
        //     defaultText: 'Ready'
        // });
        me.view = new Ext.grid.Panel({
            itemId: 'gridUploader',
            store: uploader.store,
            qDefault: true,
            stateful: true,
            multiSelect: true,
            // hideHeaders: true,
            stateId: 'stateGrid',
            columns: [{
                    text: 'Name',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'name'
                }, {
                    text: 'Location',
                    width: 200,
                    dataIndex: 'target_dir',
                    renderer: function (val) {
                        var position = val.split("/", 4).join("/").length + 1;
                        return val.substr(position);
                    }
                }, {
                    text: 'Size',
                    width: 100,
                    dataIndex: 'size',
                    renderer: function (val) {
                        return filesize(val);
                    }
                }, {
                    text: 'Speed',
                    width: 100,
                    dataIndex: 'speed'
                }, {
                    text: 'Time left',
                    width: 80,
                    dataIndex: 'rtime'
                }, {
                    text: 'Change',
                    width: 120,
                    sortable: true,
                    // hidden: true,
                    dataIndex: 'percent'
                        // renderer: function(v, m, r) {
                        //     var id = Ext.id();
                        //     Ext.defer(function() {
                        //         Ext.widget('progressbar', {
                        //             renderTo: id,
                        //             value: v / 100,
                        //             width: 100,
                        //             height: 18
                        //         });
                        //     }, 50);
                        //     return Ext.String.format('<div id="{0}"></div>', id);
                        // }
                }, {
                    text: 'Status',
                    width: 200,
                    sortable: true,
                    dataIndex: 'msg'
                }
                // , {
                //     xtype: 'actioncolumn',
                //     width: 40,
                //     tdCls: 'delete',
                //     items: [{
                //         icon: 'Delete-icon.png', // Use a URL in the icon config
                //         tooltip: 'Delete',
                //         handler: function(grid, rowIndex, colIndex) {
                //             grid.getStore().removeAt(rowIndex);
                //         }
                //     }]
                // }
            ],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: false
            },
            dockedItems: [{
                    dock: 'top',
                    enableOverflow: true,
                    xtype: 'toolbar',
                    style: {
                        background: 'transparent',
                        border: 'none',
                        padding: '5px 0'
                    },
                    listeners: {
                        beforerender: function (toolbar) {
                            toolbar.add("->");
                            if (uploader.autoRemoveUploaded === false)
                                toolbar.add(uploader.actions.removeUploaded);
                            toolbar.add(uploader.actions.remove);
                            toolbar.add(uploader.actions.start);
                            toolbar.add(uploader.actions.cancel);
                            // toolbar.add(uploader.actions.removeAll);
                        },
                        scope: me
                    }
                },
                me.statusbar
            ]
        });
        me.window = new DESKTOP.ux.qcustomize.window.SubWindow({
            title: me.title || 'Upload files',
            width: me.width || 640,
            height: me.height || 380,
            // modal : true, // harry
            plain: true,
            constrain: true,
            border: false,
            layout: 'fit',
            items: me.view,
            closeAction: 'hide',
            listeners: {
                hide: function (window) {
                    /*
                     * if(this.clearOnClose) { this.uploadpanel.onDeleteAll(); }
                     */
                },
                scope: this
            },
            buttons: ['->', {
                text: 'Cancel',
                itemId: 'btnCancel',
                listeners: {
                    click: function (me) {
                        me.up('window').close();
                    }
                }
            }]
        });
    }
});
