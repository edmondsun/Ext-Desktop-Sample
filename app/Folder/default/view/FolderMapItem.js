Ext.define('DESKTOP.Folder.default.view.FolderMapItem', {
    extend: 'Ext.container.Container',
    alias: 'widget.folderfoldermapitem',
    cls: 'folderfoldermapitemCls',
    padding: '5 0 0 30',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'left'
    },
    config: {
        /**
         * shareList: anything
         * default: {}
         * e.g. {rwList}
         */
        shareList: {
            // rwIndex: 1,2,3....,
            // foldername: 'home',
            // readwriteList: [],
            // readonlyList: [],
            // denyList: []
        }
    },
    items: [{
        xtype: 'container',
        width: 80,
        height: 150,
        layout: {
            type: 'vbox'
            // pack: 'center'
        },
        items: [{
            xtype: 'container',
            width: 80,
            height: 120,
            layout: {
                type: 'vbox',
                pack: 'center'
            },
            items: [{
                xtype: 'container',
                layout: 'vbox',
                style: {
                    'text-align': 'center'
                },
                items: [{
                    xtype: 'image',
                    itemId: 'folderImage',
                    width: 60,
                    height: 60,
                    src: 'app/Folder/images/icon_Common_file_01.png'
                }, {
                    xtype: 'label',
                    qDefault: true,
                    itemId: 'searchpanel',
                    cls: 'foldername',
                    style: {
                        margin: '0 auto'
                    },
                    text: 'Home'
                }]
            }]
        }]
    }, {
        xtype: 'container',
        width: 150,
        height: 150,
        layout: {
            type: 'vbox'
            // pack: 'center'
        },
        items: [{
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            height: 30,
            margin: '0 0 10 0',
            items: [{
                xtype: 'image',
                width: 30,
                height: 30,
                margin: '0 6 0 0',
                cls: 'readwrite'
            }, {
                xtype: 'label',
                qDefault: true,
                text: 'Read / Write:'
            }]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            height: 30,
            margin: '0 0 10 0',
            items: [{
                xtype: 'image',
                width: 30,
                height: 30,
                margin: '0 6 0 0',
                cls: 'readonly'
            }, {
                xtype: 'label',
                text: 'Read only:'
            }]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            margin: '0 0 10 0',
            height: 30,
            items: [{
                xtype: 'image',
                width: 30,
                height: 30,
                margin: '0 6 0 0',
                cls: 'deny'
            }, {
                xtype: 'label',
                qDefault: true,
                text: 'Deny:'
            }]
        }]
    }, {
        xtype: 'panel',
        itemId: 'searchpanel',
        cls: 'folderaccess',
        // width: 650,
        height: 150,
        scrollable: true,
        layout: {
            type: 'vbox'
            // pack: 'center'
        },
        listeners: {
            afterrender: function (view) {
                var me = this;
                //30 is padding ,250 is folder name + access title containers widt
                //TODO:it can be better
                me.setWidth(me.up("#folderACLs").getWidth() - 30 - 250);
                var topEl = me.up();
                topEl.mask("Loading");
                var shareListObj = topEl.getShareList();
                Ext.defer(function () {
                    Ext.Object.each(shareListObj, function (key, value) {
                        var valueLength = value.length;
                        switch (key) {
                        case 'readwriteList':
                            Ext.each(value, function (item, index) {
                                var newObj = Ext.create('Ext.form.Label', {
                                    text: item
                                });
                                me.down('#read_write_list').add({
                                    xtype: 'label',
                                    qDefault: true,
                                    text: item
                                });
                                if (index != valueLength - 1) {
                                    me.down('#read_write_list').add({
                                        xtype: 'label',
                                        qDefault: true,
                                        cls: 'splitter',
                                        margin: {
                                            right: 6
                                        },
                                        text: ','
                                    });
                                }
                            });
                            break;
                        case 'readonlyList':
                            Ext.each(value, function (item, index) {
                                var newObj = Ext.create('Ext.form.Label', {
                                    text: item
                                });
                                me.down('#read_only_list').add({
                                    xtype: 'label',
                                    qDefault: true,
                                    text: item
                                });
                                if (index != valueLength - 1) {
                                    me.down('#read_only_list').add({
                                        xtype: 'label',
                                        qDefault: true,
                                        cls: 'splitter',
                                        margin: {
                                            right: 6
                                        },
                                        text: ','
                                    });
                                }
                            });
                            break;
                        case 'denyList':
                            Ext.each(value, function (item, index) {
                                var newObj = Ext.create('Ext.form.Label', {
                                    text: item
                                });
                                me.down('#deny_list').add({
                                    xtype: 'label',
                                    qDefault: true,
                                    text: item
                                });
                                if (index != valueLength - 1) {
                                    me.down('#deny_list').add({
                                        xtype: 'label',
                                        qDefault: true,
                                        cls: 'splitter',
                                        margin: {
                                            right: 6
                                        },
                                        text: ','
                                    });
                                }
                            });
                            break;
                        case 'foldername':
                            if (value.length > 10) {
                                value = value.substring(0, 7) + '...';
                            }
                            me.up().down('[cls =foldername]').setText(value);
                            break;
                        }
                        // return false;
                    });
                    topEl.unmask();
                }, 100);
                view.up("#FolderMap").getController().Hideloadingmask();
                // view.unmask();
            }
        },
        defaults: {
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            width: 'auto',
            height: 30,
            margin: '0 0 10 0'
        },
        items: [{
            xtype: 'container',
            itemId: 'read_write_list'
        }, {
            xtype: 'container',
            itemId: 'read_only_list'
        }, {
            xtype: 'container',
            itemId: 'deny_list'
        }]
    }]
});
