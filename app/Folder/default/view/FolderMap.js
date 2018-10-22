Ext.define('DESKTOP.Folder.default.view.FolderMap', {
    extend: 'Ext.form.Panel',
    alias: 'widget.folderfoldermap',
    requires: [
        'DESKTOP.Folder.default.controller.FolderMapController',
        'DESKTOP.Folder.default.model.FolderMapModel',
        'DESKTOP.Folder.default.view.FolderMapItem'
    ],
    controller: 'foldermap',
    viewModel: {
        type: 'foldermap'
    },
    itemId: 'FolderMap',
    // height: changeable
    // height: 390,
    width: 'auto',
    frame: true,
    collapsible: true,
    waitMsgTarget: true,
    listeners: {
        resize: function (me, width, height, oldWidth, oldHeight, eOpts) {
            var tabContainer = me.up("appwindow").down("#tabs");
            var tabBar_height = tabContainer.getTabBar().getHeight();
            var tabSouth_height = tabContainer.down("#tabsouth").getHeight();
            var tabContainer_toolbar_height = me.down("#searchtoolbar").getHeight();
            //40 is padding
            var new_height = tabContainer.getHeight() - tabBar_height - tabSouth_height - tabContainer_toolbar_height - 40;
            //30 is padding ,240 is folder name + access title containers width
            var searchPanel_new_width = me.down("#folderACLs").getWidth() - 30 - 240;
            if (me.down('[cls=folderaccess]') !== null) {
                me.down('[cls=folderaccess]').setWidth(searchPanel_new_width);
            }
            me.down("#folderACLs").setHeight(new_height);
        },
        beforedestroy: function (me) {
            me.getViewModel().set("Acl_Request_stop", true);
        }
    },
    items: [{
        xtype: 'toolbar',
        itemId: 'searchtoolbar',
        qDefault: true,
        bind: {
            disabled: '{!Folder_status}'
        },
        width: 'auto',
        height: 50,
        scrollable: false,
        items: [{
            xtype: 'segmentedbutton',
            listeners: {
                toggle: 'ChangeDomainUser'
            },
            items: [{
                text: 'User',
                itemId: 'user',
                pressed: true
            }, {
                text: 'Group',
                itemId: 'group'
            }]
        }, {
            xtype: 'combobox',
            qDefault: true,
            bind: {
                store: '{domainOptions}'
            },
            editable: false,
            emptyText: "",
            queryMode: 'local',
            valueField: 'value',
            displayField: 'name',
            listeners: {
                select: 'onDomainTypeSelect'
            }
        }, '->', {
            xtype: 'textfield',
            qDefault: true,
            itemId: 'searchtext',
            emptyText: 'enter search term',
            enableKeyEvents: true,
            listeners: {
                keyup: 'onSearchKeyup',
                keydown: 'onSearchKeydown'
            }
        }, {
            xtype: 'button',
            qDefault: true,
            itemId: 'searchPrev',
            text: '<',
            listeners: {
                click: function (buttonEl) {
                    buttonEl.up('#FolderMap').getController().trackHistory("prev");
                }
            }
        }, {
            xtype: 'button',
            qDefault: true,
            itemId: 'searchNext',
            text: '>',
            listeners: {
                click: function (buttonEl) {
                    buttonEl.up('#FolderMap').getController().trackHistory("next");
                }
            }
        }]
    }, {
        xtype: 'panel',
        itemId: 'searchcontainer',
        scrollable: true,
        width: '100%',
        items: [{
            xtype: 'container',
            width: '100%',
            height: 320,
            itemId: 'folderACLs'
        }]
    }]
});
