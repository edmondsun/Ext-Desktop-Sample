Ext.define('DESKTOP.Utils.Columnview.controller.ColumnviewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.columnview',
    init: function () {
        this.gridid = [];
    },
    onColumnviewResize: function (me, width, height, oldWidth, oldHeight, eOpts) {
        // console.log("resize")
        // console.log('me, width, height, oldWidth, oldHeight, eOpts', me, width, height, oldWidth, oldHeight, eOpts)
        // me.setWidth(width);
        // me.setHeight(height);
        Ext.each(me.items.items, function (grid, index) {
            grid.setHeight(height - 20);
        });
    },
    columnselect: function (grid, record) {
        var me = this;
        var activeIndex = Ext.Array.indexOf(me.gridid, grid.view.up().id);
        var isEndFn = false;
        var queryPath = grid.getStore().proxy.extraParams.sourcePath + '/' + record.data.title;
        Ext.each(me.gridid, function (value, index) {
            // console.log('value,index', value, index)
            if (index > activeIndex + 1) {
                Ext.getCmp(value).destroy();
                me.gridid.splice(index, 1);
            } else if (index == activeIndex + 1) {
                Ext.getCmp(value).getStore().proxy.extraParams.sourcePath = queryPath;
                Ext.getCmp(value).getStore().load({
                    callback: function () {}
                });
                isEndFn = true;
                return false;
            } else {
                return false;
            }
        }, me, true);
        if (isEndFn) {
            return false;
        }
        if (record.data.type !== "Folder") {
            return false;
        }
        var newColumnStore = me.createStore(queryPath);
        newColumnStore.load({
            callback: function () {
                me.createGrid(me, newColumnStore);
            }
        });
    },
    createStore: function (queryPath) {
        var newColumnStore = Ext.create('Ext.data.Store', {
            fields: ['title', 'type', {
                name: 'icon',
                type: 'string',
                calculate: function (data) {
                    var fileName = data.title.toString();
                    var icon = '';
                    var imgPath = DESKTOP_APP.appPath + 'FileManager' + "/images/";
                    switch (data.type) {
                    case 'Folder':
                        icon = imgPath + 'icon_datatype_folder.png';
                        break;
                    case '':
                        break;
                    default:
                        var extIndex = fileName.lastIndexOf('.'),
                            ext;
                        if (extIndex === -1) {
                            ext = 'noext';
                        } else {
                            ext = fileName.substr(extIndex + 1, fileName.length);
                        }
                        switch (ext) {
                        case 'jpg':
                            icon = imgPath + 'icon_datatype_jpg.png';
                            break;
                        case 'ai':
                            icon = imgPath + 'icon_datatype_ai.png';
                            break;
                        case 'pdf':
                            icon = imgPath + 'icon_datatype_pdf.png';
                            break;
                        case 'rar':
                            icon = imgPath + 'icon_datatype_rar.png';
                            break;
                        case 'zip':
                            icon = imgPath + 'icon_datatype_zip.png';
                            break;
                        default:
                            icon = imgPath + 'icon_datatype_file.png';
                            break;
                        }
                        break;
                    }
                    return icon;
                }
            }],
            proxy: this.getView().config.storeProxy
        });
        newColumnStore.proxy.extraParams.sourcePath = queryPath;
        return newColumnStore;
    },
    createGrid: function (me, newColumnStore) {
        //20 is scrollbar's height
        var gridHeight = me.getView().getHeight() - 20;
        var newGrid = Ext.create({
            xtype: 'grid',
            qDefault: true,
            style: 'border-radius:0',
            // id: 'folderGrid',
            forceFit: true,
            width: 195,
            height: gridHeight,
            hideHeaders: true,
            allowDeselect: true,
            listeners: {
                select: 'columnselect'
            },
            store: newColumnStore,
            columns: [{
                text: 'Name',
                dataIndex: 'title',
                flex: 1,
                resizable: false,
                menuDisabled: true,
                sortable: false,
                renderer: function (value, metaData, record, rowIndex, colIndex, u) {
                    var newValue = '<div style="padding-left:20px;background:url({0}) no-repeat; background-size: 16px 16px;"/>{1}</div>';
                    return Ext.String.format(newValue, record.data.icon, value);
                }
            }]
        });
        me.gridid.push(newGrid.id);
        me.getView().add(newGrid);
        // console.log("me.getView().getScrollX()",me.getView().getScrollX())
        // console.log("newGrid.x",newGrid.x)
        // console.log("me.getView().getScrollX()+(me.gridid.length-2)*newGrid.width", me.getView().getScrollX() + 4 * newGrid.width)
        if (newGrid.x > me.getView().getScrollX() + 3 * newGrid.width) {
            me.getView().scrollTo(newGrid.x, 0, true);
        }
    }
});
