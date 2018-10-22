Ext.define('DESKTOP.AppWindow.AppWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.appwindow',
    init: function () {
        this.responseStatus = [];
        this.loadedItem = [];
        this.treenode_id = '';
        this.lastTreeRecord = null;
        this.tabpanelObj = {};
        this.treeActive = null;
        /* navigation record */
        /*         this.nav_record = [{
            tree: "treeGeneralSetting",
            tab: "tabSystem"
        }, {
            tree: "treeGeneralSetting",
            tab: "tabTime"
        }]; */
    },
    /* apply setings for mutiple tabs  */
    apply_all: function () {
        var me = this;
        me.responseStatus = [];
        var dirtycount = 0,
            i,
            tab_obj,
            dirty;
        for (i = 0; i < me.loadedItem.length; i++) {
            tab_obj = Ext.ComponentQuery.query('#' + me.loadedItem[i])[0];
            dirty = tab_obj.getForm().isDirty();
            if (typeof tab_obj.getController().dirtycheck === "function") {
                dirty = tab_obj.getController().dirtycheck();
            }
            if (dirty) {
                tab_obj.getController().on_Apply_All(tab_obj.getForm(), me);
                dirtycount++;
            }
        }
        if (dirtycount === 0) {
            Ext.Msg.alert('Warning', 'No setting were changed!');
        } else {
            me.checkFormPrecess(dirtycount, me);
        }
    },
    /* record each controller's respose to "responseStatus" */
    getresponse: function (ref, id) {
        var me = this;
        me.responseStatus[id] = ref;
    },
    /* After all settings done, system will display success message at "apply button" or pop up failed message.  */
    checkFormPrecess: function (formDirtyCount, me) {
        var response_result = me.responseStatus,
            success_count,
            fail_record,
            children,
            insertIndex,
            resultarea;
        setTimeout(function () {
            if (Object.keys(response_result).length < formDirtyCount) {
                me.checkFormPrecess(formDirtyCount, me);
            } else {
                success_count = 0;
                fail_record = [];
                for (var key in response_result) {
                    if (response_result[key] === 0)
                        success_count++;
                    else
                        fail_record[key] = response_result[key];
                }
                if (success_count == formDirtyCount) {
                    children = Ext.ComponentQuery.query('#tabsouth')[0].items.items;
                    Ext.Object.each(children, function (index, child) {
                        if (child.itemId == "applyallbtn") {
                            insertIndex = index - 1;
                            Ext.ComponentQuery.query('#tabsouth')[0].insert(insertIndex, {
                                xtype: 'tbtext',
                                text: 'Changes applied',
                                id: 'applyresult'
                            });
                        }
                    });
                    resultarea = Ext.get('applyresult');
                    resultarea.setStyle("color", "blue");
                    resultarea.fadeIn({
                        duration: 2000,
                        remove: false,
                        endOpacity: 1,
                        easing: "easeOut"
                    }).fadeOut({
                        duration: 1000,
                        remove: false,
                        endOpacity: 0,
                        easing: "easeOut",
                        callback: function () {
                            Ext.ComponentQuery.query('#tabsouth')[0].remove('applyresult');
                        }
                    });
                } else {
                    for (key in fail_record) {
                        Ext.Msg.alert('Failed', 'The ' + key + ' set failed for ' + fail_record[key]);
                    }
                }
            }
        }, 1000);
    },
    /* handle clicked operation of treepanel */
    menuClick: function (view, record) {
        var me = this,
            meView = me.getView(),
            tabs_objs = meView.down('#tabs'),
            tabsouth_objs = meView.down('#tabsouth'),
            trees_objs = meView.down('#trees'),
            checkdirty = false,
            isSearch = record.isSearch || false,
            tabObj,
            lastselected,
            i;
        if (me.treeActive == record.data.itemId) {
            if (!meView.historyTrack) {
                return false;
            }
        }
        me.treeActive = record.data.itemId;
        for (i = 0; i < me.loadedItem.length; i++) {
            tabObj = Ext.ComponentQuery.query('#' + me.loadedItem[i])[0];
            checkdirty = tabObj.isDirty();
            if (typeof tabObj.getController().dirtycheck === "function") {
                checkdirty = tabObj.getController().dirtycheck();
            }
            if (checkdirty) {
                break;
            }
            if (me.tabpanelObj[i].pageInit === false) {
                continue;
            }
        }
        if (checkdirty && me.lastTreeRecord.data.applyAll) {
            Ext.Msg.confirm("Warning", "Are you sure that you want to leave without save?", function (btn) {
                if (btn == 'yes') {
                    me.loadedItem = [];
                    tabs_objs.removeAll();
                    me.tabpanelObj = {};
                    tabsouth_objs.hide();
                    me.lastTreeRecord = record;
                    if (Object.keys(record.data.tabs).length > 0) {
                        /**
                         * Most elegant way to clone a JavaScript object
                         * If you do not use functions within your object, a very simple one liner can be the following:
                         * var cloneOfA = JSON.parse(JSON.stringify(a));
                         * source: http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
                         */
                        me.tabpanelObj = JSON.parse(JSON.stringify(record.data.tabs));
                        me.addItemtoTabpanel(record.data.applyAll, record.data.tabs, Object.keys(record.data.tabs).length, 0, me, record.isSearch);
                        me.treenode_id = record.data.id;
                    }
                } else {
                    lastselected = trees_objs.getStore().getNodeById(me.treenode_id);
                    trees_objs.getSelectionModel().select(lastselected);
                }
            });
        } else {
            me.loadedItem = [];
            tabs_objs.removeAll();
            me.tabpanelObj = {};
            tabsouth_objs.hide();
            if (Object.keys(record.data.tabs).length > 0) {
                me.tabpanelObj = JSON.parse(JSON.stringify(record.data.tabs));
                me.addItemtoTabpanel(record.data.applyAll, record.data.tabs, Object.keys(record.data.tabs).length, 0, me, record.isSearch);
                me.treenode_id = record.data.id;
                me.lastTreeRecord = record;
            }
        }
    },
    /* add tabs to tabpanel dynamically */
    addItemtoTabpanel: function (tabApply, tabObj, tabObjLen, currentIndex, me, isSearch) {
        var meView = me.getView(),
            tabs_objs = meView.down('#tabs'),
            tabsouth_objs = meView.down('#tabsouth'),
            currentTab;
        me.showLoadingMask();
        if (tabObjLen == 1) {
            tabs_objs.getTabBar().hide();
        } else {
            tabs_objs.getTabBar().show();
        }
        if (currentIndex < tabObjLen) {
            currentTab = tabObj[currentIndex];
            if (tabApply) {
                tabsouth_objs.show();
                tabApply = false;
            }
            me.tabpanelObj[currentIndex].pageInit = false;
            tabs_objs.add({
                qLanguage: {
                    "title": currentTab.qLanguage
                },
                // title: DESKTOP.config.language[DESKTOP.config.language.current][currentTab.qLanguage.key] || currentTab.qLanguage.str,
                itemId: currentTab.itemId,
                tabIndex: currentIndex,
                iconCls: '',
                closable: false,
                autoScroll: true,
                qLanguageFn: function (language) {
                    var me = this;
                    var lang = '';
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
            currentIndex++;
            me.addItemtoTabpanel(tabApply, tabObj, tabObjLen, currentIndex, me, isSearch);
        } else {
            // tabs_objs.setActiveItem( Ext.ComponentQuery.query("#" + this.tabItemId[0])[0]);
            if (!isSearch) {
                tabs_objs.setActiveItem(0);
            }
            // me.hideLoadingMask();
        }
    },
    /* add global buttons to #toolbarGlobalButton dynamically */
    addItemtoToolbarGlobalButton: function (windowEl, panelEl, globalButtonList) {
        var toolbarGlobalButtonEl = windowEl.down('#toolbarGlobalButton');
        Ext.each(globalButtonList, function (item, index, allItems) {
            toolbarGlobalButtonEl.add({
                xtype: 'button',
                text: item.defaultName,
                handler: panelEl.getController()[item.handler]
            });
        });
    },
    /* remove all global buttons from #toolbarGlobalButton */
    removeAllItemfromToolbarGlobalButton: function (windowEl) {
        var toolbarGlobalButtonEl = windowEl.down('#toolbarGlobalButton');
        toolbarGlobalButtonEl.removeAll();
    },
    /* mask this window if status of process is running. */
    showLoadingMask: function (iconActive) {
        iconActive = typeof iconActive !== "undefined" ? iconActive : true;
        var me = this,
            meView = me.getView();
        if (iconActive) {
            // meView.mask("Loading", "loadingx");
        } else {
            meView.mask();
        }
    },
    /* unmask this window if status of process is done. */
    hideLoadingMask: function () {
        var me = this,
            meView = me.getView();
        meView.unmask();
    },
    /* How to add global button in tabs,
                copy and paste following code to single page's controller. */
    // addGlobalButton: function (windowEl) {
    // console.log("time controller addGlobalButton()");
    // windowEl.getController().addItemtoToolbarGlobalButton(windowEl);
    // }
    onTabchange: function (tabPanel, newCard, oldCard, eOpts) {
        var me = this,
            meView = me.getView(),
            tabs = me.tabpanelObj,
            currentTab = tabs[newCard.tabIndex],
            history,
            historyPosition;
        me.showLoadingMask();
        me.tabPanelStoreNum = 0;
        me.tmpstoreNum = 0;
        /* require related class if switch to another tab */
        Ext.require([currentTab.require], function () {
            if (me.tabpanelObj[newCard.tabIndex].pageInit !== true) {
                me.loadedItem.push(currentTab.contentItemId);
                newCard.add({
                    xtype: currentTab.xtype,
                    title: '',
                    padding: '20px',
                    frame: false,
                    header: false,
                    listeners: {
                        afterrender: function (newPanel, eOpts) {
                            newPanel.updateLayout();
                            if (newPanel.getViewModel() !== null) {
                                Ext.Object.each(newPanel.getViewModel().storeInfo, function (key, value) {
                                    // console.log("store", Ext.data.StoreManager.lookup(value.storeId), Ext.data.StoreManager.lookup(value.storeId).needOnLoad)
                                    var store = value;
                                    if (store.needOnLoad) {
                                        me.tabPanelStoreNum++;
                                    } else {
                                        return true;
                                    }
                                    store.on({
                                        load: {
                                            fn: function (store, records, options) {
                                                me.storeLoadingHandler(store);
                                            },
                                            scope: this,
                                            single: true
                                        }
                                    });
                                });
                            }
                            if (me.tabPanelStoreNum === 0) {
                                me.hideLoadingMask();
                            }
                        }
                    }
                });
                me.tabpanelObj[newCard.tabIndex].pageInit = true;
            } else {
                me.hideLoadingMask();
            }
            /* check if function addGlobalButton() exists; TRUE: add global buttons, FALSE: do nothing */
            me.removeAllItemfromToolbarGlobalButton(meView);
            if (typeof newCard.items.items[0].getController().addGlobalButton === "function") {
                // console.log("addGlobalButton y");
                newCard.items.items[0].getController().addGlobalButton(meView, newCard.items.items[0]);
            } else {
                // console.log("addGlobalButton n");
            }
            history = meView.history;
            historyPosition = meView.historyPosition;
            if (meView.historyTrack) {
                meView.historyTrack = false;
                return false;
            } else {
                /* remove right-hand-side records of history (array) if new tree/tab node is clicked */
                if (historyPosition != history.length - 1) {
                    meView.history.splice(historyPosition + 1, history.length - (historyPosition + 1));
                }
            }
            meView.history.push({
                'tree': meView.down('#trees').getSelectionModel().getSelection()[0].data.itemId,
                'tab': newCard.itemId
            });
            meView.historyPosition = meView.history.length - 1;
            me.controlHistoryButton();
            // me.hideLoadingMask();
        });
    },
    storeLoadingHandler: function (justLoadedStore) {
        var me = this;
        me.tmpstoreNum++;
        /*TODO : must handle Prev and Next function */
        if (me.tmpstoreNum > me.tabPanelStoreNum) {
            return true;
        }
        me.showLoadingMask();
        // console.log(me.tmpstoreNum)
        // console.log("total store", me.tabPanelStoreNum)
        if (me.tabPanelStoreNum == me.tmpstoreNum || me.tabPanelStoreNum === 0) {
            me.hideLoadingMask();
        }
    },
    toggleDisplay: function () {
        var me = this,
            meView = me.getView(),
            changeState = false,
            topDownIndex,
            isActived = false;
        // console.log("meView.isMinimized", meView, meView.isMinimized)
        if (meView.isMasked()) {
            return false;
        }
        if (meView.isMinimized) {
            meView.show();
            changeState = true;
        } else {
            topDownIndex = 0;
            Ext.WindowManager.eachTopDown(function (cmp) {
                if (topDownIndex <= 1) {
                    if (cmp.id == meView.id) {
                        isActived = true;
                        return false;
                    }
                } else {
                    return false;
                }
                // console.log(cmp);
                topDownIndex++;
            });
            if (isActived) {
                meView.hide();
                changeState = true;
            } else {
                Ext.WindowManager.bringToFront(meView.id);
            }
        }
        if (changeState) {
            meView.isMinimized = !meView.isMinimized;
        }
    },
    toolClose: function (event, toolEl, panel) {
        /* Remove extId from DESKTOP_APP[appKey].extId after close window. (dynamic extId for window) */
        var me = this,
            meView = me.getView(),
            desktop = Ext.getCmp('desktop'),
            dockContainer = Ext.getCmp('dockContainer'),
            qsan_app_obj = DESKTOP_APP[meView.appKey],
            remove_id = qsan_app_obj.extId.indexOf(meView.id),
            remove_id_desktop = desktop.windowOpened.indexOf(meView.id);
        if (remove_id > -1) {
            qsan_app_obj.extId.splice(remove_id, 1);
            desktop.windowOpened.splice(remove_id_desktop, 1);
        }
        dockContainer.getController().dockRemoveItem(meView);
        meView.close();
    },
    toolMinimize: function (event, toolEl, panel) {
        var me = this,
            meView = me.getView();
        meView.isMinimized = true;
        meView.hide();
    },
    searchPositionFn: function (position) {
        var me = this,
            meView = me.getView(),
            treepanelEl = meView.down('#trees'),
            tabpanelEl = meView.down('#tabs'),
            tabItemId = position.tab,
            treepanelElRootNodeObjs = treepanelEl.getRootNode().childNodes,
            tabElItemObjs = tabpanelEl.items.items,
            selectTabIndex = 0,
            selectId;
        Ext.each(treepanelElRootNodeObjs, function (item, index, allItems) {
            if (position.tree == item.data.itemId ||
                position.tree.length === 0 && index === 0) {
                item.isSearch = true;
                selectId = treepanelEl.getStore().getNodeById(item.data.id);
                treepanelEl.getSelectionModel().select(selectId);
                me.menuClick(treepanelEl.view, item);
                return false;
            }
        });
        Ext.each(tabElItemObjs, function (item, index) {
            if (item.itemId == tabItemId) {
                selectTabIndex = index;
                return false;
            }
        });
        tabpanelEl.setActiveItem(selectTabIndex);
    },
    /* handle clicked operation of prev/next button */
    trackHistory: function (action) {
        var me = this,
            meView = me.getView();
        switch (action) {
        case 'prev':
            meView.historyPosition -= 1;
            break;
        case 'next':
            meView.historyPosition += 1;
            break;
        default:
            break;
        }
        me.selectTreeTab();
        me.controlHistoryButton();
    },
    /* set selected tree's and tab's node by currentHistory */
    selectTreeTab: function () {
        var me = this,
            meView = me.getView(),
            history = meView.history,
            historyPosition = meView.historyPosition,
            currentHistory = history[historyPosition];
        me.showLoadingMask();
        me.selectTree(currentHistory);
    },
    /* set selected tree's node by currentHistory */
    selectTree: function (currentHistory) {
        var me = this,
            meView = me.getView(),
            treeEl = meView.down('#trees'),
            treeElRootNodeObjs = treeEl.getRootNode().childNodes,
            dataObjs,
            selectId;
        Ext.each(treeElRootNodeObjs, function (item, index) {
            dataObjs = item.data;
            if (dataObjs.itemId == currentHistory.tree) {
                meView.historyTrack = true;
                selectId = treeEl.getStore().getNodeById(dataObjs.id);
                treeEl.getSelectionModel().select(selectId);
                me.menuClick(treeEl.view, item);
                me.selectTab(currentHistory);
                return false;
            }
        });
    },
    /* set selected tab's node by currentHistory */
    selectTab: function (currentHistory) {
        var me = this,
            meView = me.getView(),
            tabpanelEl = meView.down('#tabs'),
            tabElItemObjs = tabpanelEl.items.items;
        Ext.each(tabElItemObjs, function (item, index) {
            if (item.itemId == currentHistory.tab) {
                /* Add filter for index: 0. If index of active item is 0, setActiveItem() will do nothing. */
                if (index !== 0) {
                    meView.historyTrack = true;
                    tabpanelEl.setActiveItem(index);
                }
                me.hideLoadingMask();
                return false;
            }
        });
    },
    /* set state of history buttons as enable/disable by historyPosition */
    controlHistoryButton: function () {
        var me = this,
            meView = me.getView(),
            topToolbarEl = meView.down('toolbar[cls=app-win-tbar]');
        if (meView.historyPosition === 0) {
            topToolbarEl.down('#historyPrev').setDisabled(true);
        } else {
            topToolbarEl.down('#historyPrev').setDisabled(false);
        }
        if (meView.historyPosition === meView.history.length - 1) {
            topToolbarEl.down('#historyNext').setDisabled(true);
        } else {
            topToolbarEl.down('#historyNext').setDisabled(false);
        }
    },
    historyPrev: function () {
        var me = this;
        me.trackHistory("prev");
    },
    historyNext: function () {
        var me = this;
        me.trackHistory("next");
    },
    navswitch: function (buttonEl) {
        /* navswitch: collapse/expand treepanel */
        var me = this,
            meView = me.getView(),
            treeEl = meView.down('#trees'),
            trees_root_node_objs = treeEl.getRootNode().childNodes,
            current_width = treeEl.getWidth();
        if (current_width == 199) {
            buttonEl.setIconCls('win-btn-navswitch-expand');
            treeEl.setWidth(70);
            Ext.each(trees_root_node_objs, function (item, index, allItems) {
                treeEl.getStore().getNodeById(item.id).set('text', '');
            });
        } else {
            buttonEl.setIconCls('win-btn-navswitch-collapse');
            treeEl.setWidth(199);
            Ext.each(trees_root_node_objs, function (item, index, allItems) {
                treeEl.getStore().getNodeById(item.id).set('text', item.data.qLanguage.str);
            });
        }
    },
    adjustPosition: function (containerEl, windowEl, desktop, newWin) {
        newWin = typeof newWin != "undefined" ? newWin : true;
        var limit_container = {
                "top": 0,
                "right": containerEl.getWidth(),
                "bottom": containerEl.getHeight(),
                "left": 0
            },
            limit_window = {
                "top": windowEl.y,
                "right": windowEl.x + windowEl.getWidth(),
                "bottom": windowEl.y + windowEl.getHeight(),
                "left": windowEl.x,
                "height": windowEl.getHeight(),
                "headerBottom": windowEl.x + Ext.get(windowEl.id + '_header').getHeight()
            },
            windowLastPosition = desktop.windowLastPosition.slice(0),
            x = windowEl.x,
            y = windowEl.y;
        if (newWin) {
            if (limit_window.right > limit_container.right) {
                x = 0;
                y = 0;
            } else {
                if (limit_window.bottom > limit_container.bottom) {
                    y = 0;
                }
            }
        }
        return [x, y];
    }
});
