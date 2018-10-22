Ext.define('DESKTOP.FileManager.FileManager', {
    extend: 'DESKTOP.ux.qcustomize.window.MainWindow',
    alias: 'widget.appwindow',
    requires: [
        'DESKTOP.FileManager.FileManagerController',
        'DESKTOP.FileManager.FileManagerModel',
        'DESKTOP.FileManager.uploader.UploaderWindow',
        'DESKTOP.FileManager.uploader.UploaderButton'
    ],
    controller: 'appwindow',
    viewModel: {
        type: 'appwindow'
    },
    config: {
        /**
         * historyTrack: false/true
         * true: skip tabchange for tabpanel
         */
        historyTrack: false,
        /**
         * history: []
         * navigation history: {'tree': itemId, 'tab': itemId}
         */
        history: [],
        /**
         * historyPosition: integer
         * history index: current history position
         */
        historyPosition: 0,
        /**
         * isMinimized: boolean
         */
        isMinimized: false
    },
    width: 1000,
    height: 550,
    resizable: false,
    layout: {
        type: 'border',
        padding: '0 0 0 0',
        border: 1
    },
    header: {
        titlePosition: 99,
        titleAlign: "center",
        style: 'padding-right:70px;'
    },
    itemId: 'appwindow',
    closable: false,
    maximizable: true,
    tools: [{
        type: 'close',
        handler: 'toolClose'
    }, {
        type: 'minimize',
        handler: 'toolMinimize'
    }],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        cls: 'app-win-tbar',
        items: [{
                xtype: 'button',
                itemId: 'historyPrev',
                buttonLocation: 'toolbar',
                iconCls: 'win-btn-prev'
                    // handler: 'historyPrev'
            }, {
                xtype: 'button',
                itemId: 'historyNext',
                buttonLocation: 'toolbar',
                iconCls: 'win-btn-next'
                    // handler: 'historyNext'
            },
            ' ', {
                xtype: 'button',
                itemId: 'navswitch',
                buttonLocation: 'toolbar',
                iconCls: 'win-btn-navswitch-collapse'
                    // handler: 'navswitch'
            },
            ' ', {
                xtype: 'segmentedbutton',
                listeners: {
                    toggle: 'changeMainView'
                },
                items: [{
                    text: 'DataView',
                    itemId: 'dataViewbtn',
                    pressed: true
                }, {
                    text: 'Grid',
                    itemId: 'gridViewbtn'
                }, {
                    text: 'Grid-Detail',
                    itemId: 'gridViewDetailbtn'
                }]
            }, {
                itemId: 'toolbarGlobalButton',
                xtype: 'toolbar',
                cls: 'app-win-tbar-globalbutton',
                width: 300,
                layout: {
                    overflowHandler: 'menu'
                },
                padding: '0 0 0 0',
                style: 'background:transparent;border:0;'
            },
            '->', {
                xtype: 'triggerfield',
                triggerCls: Ext.baseCSSPrefix + 'form-search-trigger'
            }, {
                xtype: 'button',
                buttonLocation: 'toolbar',
                iconCls: 'win-btn-help'
            }
        ],
        listeners: {
            afterrender: function (me, eOpts) {
                me.down('#historyPrev').setDisabled(true);
                me.down('#historyNext').setDisabled(true);
            }
        }
    }],
    items: [{
        xtype: 'treepanel',
        region: 'west',
        itemId: 'trees',
        cls: 'west-menuX',
        width: 199,
        lines: false,
        bind: {
            store: '{menuTree}'
        },
        rootVisible: false,
        expanded: true,
        style: 'overflow:hidden;',
        listeners: {
            itemclick: 'menuClick'
        }
    }, {
        region: 'center',
        xtype: 'panel',
        itemId: 'tabs',
        // id: 'centerPanel',
        layout: 'fit',
        // id: 'file_drop_zone',
        listeners: {
            afterrender: function (me) {
                    if (!me.dropArea) {
                        me.dropArea = Ext.create('Ext.window.Window', {
                            width: 100,
                            height: 100,
                            closable: false,
                            header: false,
                            border: false,
                            frame: false,
                            shadow: false,
                            resizable: false,
                            // id: 'centerPanel',
                            layout: {
                                type: 'vbox',
                                pack: 'center',
                                align: 'center'
                            },
                            renderTo: me.getId(),
                            style: {
                                'background-color': '#33ccff',
                                border: '3px',
                                'border-style': 'dashed',
                                'font-size': '30px',
                                // 'text-align': 'center',
                                // display: 'table',
                                opacity: 0.3
                            },
                            items: [{
                                xtype: 'label',
                                text: 'Drop file(s) here.',
                                style: 'font-size:40px'
                            }],
                            traverseFileTree: function (item, path) {
                                path = path || "";
                                if (item.isFile) {
                                    // Get file
                                    item.file(function (file) {
                                        // console.log("File:", path + file.name);
                                        // console.log("File",file);
                                    });
                                } else if (item.isDirectory) {
                                    // Get folder contents
                                    var dirReader = item.createReader();
                                    dirReader.readEntries(function (entries) {
                                        for (var i = 0; i < entries.length; i++) {
                                            var tabs = Ext.ComponentQuery.query('#tabs')[0];
                                            tabs.dropArea.traverseFileTree(entries[i], path + item.name + "/");
                                        }
                                    });
                                }
                            },
                            listeners: {
                                afterrender: function (win) {
                                    if (!win.uploadbtn) {
                                        win.uploader = Ext.create('DESKTOP.FileManager.uploader.UploaderButton', {
                                            // xtype: 'uploadbutton',
                                            text: 'Select files',
                                            // id: 'browse_button',
                                            itemId: 'btn_upload',
                                            renderTo: win.getId(),
                                            hidden: true,
                                            uploadButtonText: 'Restart',
                                            plugins: [{
                                                ptype: 'ux.upload.window',
                                                title: 'Upload',
                                                width: 1000,
                                                height: 550
                                            }],
                                            uploader: {
                                                url: 'app/FileManager/backend/FileUpload.php',
                                                autoStart: true,
                                                autoRemoveUploaded: false,
                                                max_file_size: '10240mb',
                                                drop_element: win.getId(),
                                                statusQueuedText: 'Ready to upload',
                                                statusUploadingText: 'Uploading ({0}%)',
                                                statusFailedText: '<span style="color: red">Error</span>',
                                                statusDoneText: '<span style="color: green">Complete</span>',
                                                statusInvalidSizeText: 'File too large',
                                                statusInvalidExtensionText: 'Invalid file type',
                                                chunk_size: '8mb'
                                            },
                                            listeners: {
                                                filesadded: function (uploader, files, fi) {
                                                    // console.log('filesadded', fi);
                                                    return true;
                                                },
                                                beforeupload: function (uploader, file) {
                                                    // uploader.uploader.settings.multipart_params.file_path = file_path;
                                                },
                                                fileuploaded: function (uploader, file) {},
                                                uploadcomplete: function (uploader, success, failed) {},
                                                scope: this
                                            }
                                        });
                                    }
                                    if (Ext.isIE10 || !Ext.isIE) {
                                        win.el.on('dragleave', function (e) {
                                            console.log('dragleave');
                                            e.preventDefault();
                                            // win.hide();
                                        }, false);
                                        win.el.on('dragenter', function (e) {
                                            e.preventDefault();
                                            // win.show();
                                        }, false);
                                        win.el.on('dragover', function (e) {
                                            e.preventDefault(); // // e.dataTransfer.dropEffect = 'copy';
                                            // win.show();
                                        }, false);
                                        win.el.on('drop', function (e) {
                                            e.preventDefault();
                                            win.hide();
                                            // var inputFiles = e.browserEvent.dataTransfer.files;
                                            // var inputItems = e.browserEvent.dataTransfer.items;
                                            // console.log(inputFiles);
                                            // console.log(inputItems);
                                            // // var file = inputFiles || inputItems;
                                            // for (var i = 0; i < inputItems.length; i++) {
                                            //     // webkitGetAsEntry is where the magic happens
                                            //     var item = inputItems[i].webkitGetAsEntry();
                                            //     if (item) {
                                            //         win.traverseFileTree(item);
                                            //     }
                                            // }
                                            // console.log('file', file);
                                            // var files = [];
                                            // if (inputFiles.length == 0) {
                                            //     return;
                                            // }
                                        }, false);
                                    }
                                },
                                afterlayout: function (win) {
                                    var body_id = win.getId() + '-body';
                                    var body = Ext.getDom(body_id);
                                    body.style.backgroundColor = 'transparent';
                                },
                                beforeshow: function (win) {
                                    var mask = Ext.ComponentQuery.query('#tabs')[0];
                                    var winW = mask.getSize().width,
                                        winH = mask.getSize().height;
                                    win.setSize(winW, winH - 84);
                                },
                                show: function (win) {
                                    // var manager = new Ext.ZIndexManager();
                                    // manager.bringToFront(win);
                                }
                            }
                        });
                    }
                    me.el.on('dragenter', function (e) {
                        e.preventDefault();
                        // console.log('dragenter');
                        // if (!me.dropArea.isVisible()) {
                        //     me.dropArea.show();
                        // }
                    }, false);
                    me.el.on('dragover', function (e) {
                        // console.log('dragover');
                        e.preventDefault();
                        var maxX = me.getX() + me.getWidth() - 30;
                        var minX = me.getX() + 30;
                        var maxY = me.getY() + me.getHeight() - 42;
                        var minY = me.getY() + 42;
                        if (e.pageX < maxX && e.pageX > minX && e.pageY < maxY && e.pageY > minY) {
                            me.dropArea.show();
                        } else if (e.pageX > maxX || e.pageX < minX || e.pageY > maxY || e.pageY < minY) {
                            me.dropArea.hide();
                        }
                    }, false);
                    me.el.on('dragleave', function (e) {
                        e.preventDefault();
                    }, false);
                }
                // me.dropZone = Ext.create('Ext.dd.DropZone', me.el, {
                //     //      If the mouse is over a target node, return that node. This is
                //     //      provided as the "target" parameter in all "onNodeXXXX" node event handling functions
                //     getTargetFromEvent: function (e) {
                //         // console.log('getTargetFromEvent');
                //         return e.getTarget('.hospital-target');
                //     },
                //     //      On entry into a target node, highlight that node.
                //     onNodeEnter: function (target, dd, e, data) {
                //         console.log('onNodeEnter');
                //         Ext.fly(target).addCls('hospital-target-hover');
                //     },
                //     //      On exit from a target node, unhighlight that node.
                //     onNodeOut: function (target, dd, e, data) {
                //         console.log('onNodeOut');
                //         Ext.fly(target).removeCls('hospital-target-hover');
                //     },
                //     //      While over a target node, return the default drop allowed class which
                //     //      places a "tick" icon into the drag proxy.
                //     onNodeOver: function (target, dd, e, data) {
                //         console.log('onNodeOver', Ext.dd.DropZone.prototype.dropAllowed);
                //         return Ext.dd.DropZone.prototype.dropAllowed;
                //     },
                //     //      On node drop, we can interrogate the target node to find the underlying
                //     //      application object that is the real target of the dragged data.
                //     //      In this case, it is a Record in the GridPanel's Store.
                //     //      We can use the data set up by the DragZone's getDragData method to read
                //     //      any data we decided to attach.
                //     onNodeDrop: function (target, dd, e, data) {
                //         var rowBody = Ext.fly(target).findParent('.x-grid-rowbody-tr', null, false),
                //             mainRow = rowBody.previousSibling,
                //             h = gridView.getRecord(mainRow),
                //             targetEl = Ext.get(target),
                //             html = targetEl.dom.innerHTML;
                //         if (html == 'Drop Patient Here') {
                //             html = data.patientData.name;
                //         } else {
                //             html = data.patientData.name + ', ' + targetEl.dom.innerHTML;
                //         }
                //         targetEl.update(html);
                //         Ext.Msg.alert('Drop gesture', 'Dropped patient ' + data.patientData.name +
                //             ' on hospital ' + h.data.name);
                //         return true;
                //     }
                // });
                // me.dropZone.el.on("dragover", FileDragHover, false);
                // me.dropZone.el.on("dragleave", FileDragHover, false);
                // v.dropZone.addEventListener("dragover", FileDragHover, false);
                // document.getElementById(me.id).ondrop = function (e) {
                //     console.log('me ondrop');
                //     // me.id.notifyDrop(dd, e, data)
                //     // var items = e.dataTransfer.items,
                //     //     n, item;
                //     // for (n = 0; n < items.length; n++) {
                //     //     item = items[n].webkitGetAsEntry();
                //     //     if (item) {
                //     //         console.log(item);
                //     //         console.log(item.createReader());
                //     //     }
                //     // }
                // };
                // console.log('me', me);
                // console.log('me', me.dropZone);
        },
        items: [{
            xtype: 'dataview',
            liveDrag: true,
            cls: 'images-view',
            // id: 'images-view',
            reference: 'folderview',
            selectionModel: {
                mode: 'MULTI'
            },
            scrollable: true,
            bind: {
                hidden: '{!dataView}',
                store: '{folderView}'
            },
            itemId: 'ima',
            tpl: [
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{title}"  word-break="break-all">',
                '<div class="thumb"><img src="{icon}" title="Type:{type}\nName:{title}\nSize:{size}\nTime:{ctime}"></div>',
                '<div class="x-editable" title="{title}">{title}</div>',
                '</div >',
                '</tpl>',
                '<div class="x-clear"></div>'
            ],
            itemSelector: 'div.thumb-wrap',
            multiSelect: true,
            trackOver: true,
            prepareData: function (data) {
                var fileName = data.title.toString();
                var imgPath = DESKTOP_APP.appPath + 'FileManager' + "/images/";
                // data.ctime = date('Y-m-d H:i:s', data.ctime);
                // data.size = filesize(data.size);
                switch (data.type) {
                case 'Folder':
                    data.icon = imgPath + 'icon_datatype_folder.png';
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
                        data.icon = imgPath + 'icon_datatype_jpg.png';
                        break;
                    case 'ai':
                        data.icon = imgPath + 'icon_datatype_ai.png';
                        break;
                    case 'pdf':
                        data.icon = imgPath + 'icon_datatype_pdf.png';
                        break;
                    case 'rar':
                        data.icon = imgPath + 'icon_datatype_rar.png';
                        break;
                    case 'zip':
                        data.icon = imgPath + 'icon_datatype_zip.png';
                        break;
                    default:
                        data.icon = imgPath + 'icon_datatype_file.png';
                        break;
                    }
                    break;
                }
                return data;
            },
            // plugins: [
            //     Ext.create('Ext.ux.DataView.DragSelector', {})
            //     // Ext.create('Ext.ux.DataView.LabelEditor', {
            //     //     dataIndex: 'name'
            //     // })
            // ],
            listeners: {
                // selectionchange: function (dataview, selections) {
                //     var selected = selections[0];
                //     console.log('selected', selected);
                //     if (selected) {
                //         // this.up('#Dataview').down('#infopanel').loadRecord(selected);
                //         this.up('#Dataview').down('#infopanel').show();
                //     } else {
                //         this.up('#Dataview').down('#infopanel').hide();
                //     }
                // },
                // select: function (view, record) {
                //     console.log('store', view.store.getData());
                // },
                itemdblclick: 'dataViewdbclick',
                itemcontextmenu: 'rightclick',
                containercontextmenu: 'containerRightclick'
            }
        }, {
            xtype: 'grid',
            qDefault: true,
            width: '100%',
            itemId: 'folderGrid',
            // id: 'folderGrid',
            forceFit: true,
            reference: 'folderGrid',
            allowDeselect: true,
            selModel: {
                mode: 'MULTI'
            },
            listeners: {
                itemdblclick: 'griddbclick',
                containerclick: 'gridContainerclick',
                itemcontextmenu: 'rightclick',
                containercontextmenu: 'containerRightclick'
            },
            bind: {
                store: '{folderView}',
                hidden: '{!gridView}'
            },
            columns: [{
                    text: 'Name',
                    dataIndex: 'title',
                    resizable: false,
                    width: 180,
                    menuDisabled: true,
                    sortable: false,
                    renderer: function (value, metaData, record, rowIndex, colIndex, u) {
                        var newValue = '<div style="padding-left:20px;background:url({0}) no-repeat; background-size: 16px 16px;"/>{1}</div>';
                        return Ext.String.format(newValue, record.data.icon, value);
                    }
                }, {
                    text: 'Size',
                    align: 'right',
                    flex: 1,
                    resizable: false,
                    dataIndex: 'size',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Type',
                    flex: 1,
                    resizable: false,
                    dataIndex: 'type',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Modified date',
                    flex: 1,
                    resizable: false,
                    dataIndex: 'mtime',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Create date',
                    flex: 1,
                    resizable: false,
                    dataIndex: 'ctime',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Last accesssed',
                    flex: 1,
                    resizable: false,
                    dataIndex: 'atime',
                    sortable: false,
                    menuDisabled: true
                }]
                // bbar: Ext.create('Ext.toolbar.Paging', {
                //     pageSize: 10,
                //     displayInfo: false
                // })
        }],
        tbar: ['->', {
            xtype: 'button',
            text: 'Refresh',
            handler: function (me) {
                var vm = me.up('#appwindow').getViewModel();
                var folder_store = vm.getStore('folderView');
                folder_store.load();
            }
        }, {
            xtype: 'button',
            text: 'Upload',
            handler: function (me) {
                var btn = Ext.ComponentQuery.query('#btn_upload')[0];
                console.log('btn', btn);
                // var btn = me.prev('#btn_upload');
                console.log("btn", btn);
                btn.getEl().dom.click();
                btn.plugins[0].window.show();
                btn.fireEvent('click');
            }
        }],
        dockedItems: [{
            itemId: 'path',
            xtype: 'toolbar',
            scrollable: true,
            dock: 'bottom'
        }]
    }],
    listeners: {
        activate: function (me) {
            var desktop = Ext.getCmp('desktop'),
                monitorItems = [];
            if (me.isMasked() && me.qIsMasked) {
                desktop.qWinMgr.eachTopDown(function (cmp) {
                    if (cmp.monitorOnWinMgr) {
                        monitorItems.push(cmp.id);
                    }
                });
                /* If zindex of child window is higher than zindex of parent window, do nothing. */
                if (monitorItems.indexOf(me.childWindowId) < monitorItems.indexOf(me.id)) {
                    return false;
                }
                Ext.WindowManager.bringToFront(me.childWindowId);
            }
        }
    },
    qLanguageFn: function (language) {
        var me = this,
            lang = '';
        Ext.Object.each(me.qLanguage, function (key, value) {
            lang = DESKTOP.config.language[language][value.key] || value.str;
            switch (key) {
            case 'title':
                me.setTitle(lang);
                break;
            case '':
                break;
            default:
                break;
            }
        });
    }
});
