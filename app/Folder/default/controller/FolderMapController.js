Ext.define('DESKTOP.Folder.default.controller.FolderMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.foldermap',
    init: function () {
        this.el = '';
        this.currentLabelIndex = null;
        this.searchResult = [];
        this.searchtext = '';
        this.queryStr = '';
        this.trackCirculer = true;
        this.currentContainerIndex = null;
        this.currentDomaintype = "loacal";
        this.currentDomainuser = "user";
        var ViewModel = this.getViewModel();
        // ViewModel.getStore("accountPerms").selVM = ViewModel;
        ViewModel.getStore("allfolders").selController = this;
        ViewModel.getStore("allfolders").selVM = ViewModel;
        ViewModel.getStore("allfolders").load();
        ViewModel.getStore("domainOptions").selView = this.getView();
        if (!this.trackCirculer) {
            this.view.down('#searchtoolbar').on({
                afterrender: function (me) {
                    me.down('#searchPrev').setDisabled(true);
                    me.down('#searchNext').setDisabled(true);
                }
            });
        }
        this.getView().up("#appwindow").down("#tabs").on('tabchange', this.FolderMaptabchange, this);
    },
    dirtycheck: function () {
        return false;
    },
    FolderMaptabchange: function (tabPanel, newCard, oldCard, eOpts) {
        if (oldCard.itemId == "tabFolderMap") {
            this.getViewModel().set("Acl_Request_stop", true);
        }
        if (newCard.itemId == "tabFolderMap") {
            var allfolderStore = this.getViewModel().getStore("allfolders");
            this.getViewModel().set("Acl_Request_stop", false);
            allfolderStore.proxy.extraParams.md5sum = allfolderStore.md5sum;
            allfolderStore.reload();
        }
    },
    /* call this function after finished inputting text */
    onSearchKeyup: function (text, el) {
        var me = this;
        // me.currentContainerIndex = null;
        var searchtext = me.getView().down('#searchtext').getValue();
        if (me.searchtext.length == searchtext.length) {
            return false;
        }
        me.currentLabelIndex = null;
        me.searchResult = [];
        if (!me.trackCirculer) {
            me.getView().down('#searchPrev').setDisabled(true);
            me.getView().down('#searchNext').setDisabled(true);
        }
        var container = me.getView().query('#searchpanel');
        Ext.each(container, function (item, index) {
            me.handleSearchBlock(item, index, searchtext);
        });
        /*  if query string is found */
        if (me.searchResult.length > 0) {
            /* set currentLabelIndex as start index for trackHistory */
            me.currentLabelIndex = 0;
            var selectIndex = me.searchResult[0].index;
            me.currentContainerIndex = me.searchResult[0].containerIndex;
            me.selectSearchItem(selectIndex);
        }
    },
    handleSearchBlock: function (container, containerIndex, searchtext) {
        var me = this;
        var queryStr = null;
        me.searchtext = searchtext;
        if (searchtext.match(/\w+/) === null && searchtext !== "") {
            queryStr = new RegExp("(\\" + searchtext + ")", "gi");
        } else {
            queryStr = new RegExp("(" + searchtext + ")", "gi");
        }
        me.queryStr = queryStr;
        var labelObjs = [];
        var tmparr = [];
        if (typeof container.items != "undefined") {
            for (var i = 0; i < container.items.length; i++) {
                tmparr = container.items.items[i].items.items;
                labelObjs = labelObjs.concat(tmparr);
            }
        } else {
            labelObjs = container;
        }
        Ext.each(labelObjs, function (item, index) {
            var dom = item.el.dom;
            if (typeof dom.innerText == 'undefined') {
                dom.innerText = dom.innerHTML;
            }
            /**
             * Cross browser issue: Firefox does not support the attribute innerText
             * source: http://quirksmode.org/dom/html/
             */
            dom.innerHTML = dom.innerText;
            /* mark it if length of query string > 0 and query string is found */
            if (searchtext.length > 0 && item.cls !== 'splitter') {
                var newEl = dom.innerHTML.replace(queryStr, "<span class='highlight other'>$1</span>");
                dom.innerHTML = newEl;
            }
            /*save search result*/
            if (dom.innerHTML.length !== dom.innerText.length) {
                me.searchResult.push({
                    'index': index,
                    'id': item.id,
                    'containerId': container.id,
                    'containerIndex': containerIndex
                });
            }
        });
    },
    //shift:16   enter:13
    onSearchKeydown: function (text, e) {
        var me = this;
        if (e.keyCode == 13) {
            if (e.shiftKey) {
                me.trackHistory("prev");
            } else {
                me.trackHistory("next");
            }
        }
    },
    trackHistory: function (action) {
        var me = this;
        if (me.searchResult.length <= 1) {
            return false;
        }
        switch (action) {
        case 'prev':
            me.currentLabelIndex -= 1;
            break;
        case 'next':
            me.currentLabelIndex += 1;
            break;
        default:
            break;
        }
        if (!me.trackCirculer) {
            me.controlHistoryButton();
        } else {
            if (me.currentLabelIndex < 0) {
                me.currentLabelIndex += me.searchResult.length;
            }
            if (me.currentLabelIndex == me.searchResult.length) {
                me.currentLabelIndex = 0;
            }
        }
        var selectIndex = me.searchResult[me.currentLabelIndex].index;
        me.handleContainer(action, selectIndex);
    },
    handleContainer: function (action, selectIndex) {
        var me = this;
        if (action == "next") {
            if ((typeof me.searchResult[me.currentLabelIndex - 1]) == "undefined") {
                me.currentContainerIndex = me.searchResult[0].containerIndex;
            } else if (me.searchResult[me.currentLabelIndex - 1].containerId !== me.searchResult[me.currentLabelIndex].containerId) {
                me.currentContainerIndex = me.searchResult[me.currentLabelIndex].containerIndex;
            }
        } else if (action == "prev") {
            if ((typeof me.searchResult[me.currentLabelIndex + 1]) == "undefined") {
                me.currentContainerIndex = me.searchResult[me.searchResult.length - 1].containerIndex;
            } else if (me.searchResult[me.currentLabelIndex + 1].containerId !== me.searchResult[me.currentLabelIndex].containerId) {
                me.currentContainerIndex = me.searchResult[me.currentLabelIndex].containerIndex;
            }
        }
        me.selectSearchItem(selectIndex, action);
    },
    selectSearchItem: function (selectIndex, action) {
        var me = this;
        var container = this.getView().query('#searchpanel');
        Ext.each(container, function (item, index) {
            if (me.currentContainerIndex == index) {
                me.handleSelectSearchItem(item, selectIndex, action);
                return false;
            }
        });
    },
    handleSelectSearchItem: function (container, selectIndex, action) {
        var me = this;
        var ownerIndex = container.up('[cls=folderfoldermapitemCls]').config.shareList.rwIndex;
        var ownerPanel = Ext.ComponentQuery.query('#searchcontainer')[0];
        Ext.each(me.searchResult, function (item, index) {
            var newEl = '';
            var tmpEl = Ext.getCmp(item.id);
            var dom = tmpEl.el.dom;
            dom.innerHTML = dom.innerText;
            if (item.index == selectIndex && container.id == item.containerId) {
                newEl = dom.innerHTML.replace(me.queryStr, "<span class='highlight current'>$1</span>");
                if (tmpEl.x > container.getScrollX() + container.width || tmpEl.x < container.getScrollX()) {
                    container.scrollTo(tmpEl.x);
                }
                if ((ownerIndex + 1) * 150 > ownerPanel.getScrollY() + ownerPanel.getHeight() || (ownerIndex + 1) * 150 <= ownerPanel.getScrollY()) {
                    ownerPanel.scrollTo(0, ownerIndex * 150, true);
                }
            } else {
                newEl = dom.innerHTML.replace(me.queryStr, "<span class='highlight other'>$1</span>");
            }
            dom.innerHTML = newEl;
        });
    },
    controlHistoryButton: function () {
        var me = this;
        if (me.currentLabelIndex === 0) {
            me.getView().down('#searchPrev').setDisabled(true);
        } else {
            me.getView().down('#searchPrev').setDisabled(false);
        }
        if (me.currentLabelIndex == me.searchResult.length - 1) {
            me.getView().down('#searchNext').setDisabled(true);
        } else {
            me.getView().down('#searchNext').setDisabled(false);
        }
    },
    generateMapItem: function (Account_acl, domaintype) {
        var itemContainer = Ext.ComponentQuery.query('#folderACLs')[0]; //item container
        var objCount = 0;
        itemContainer.removeAll();
        console.log("Account_acl", Account_acl);
        Ext.Object.each(Account_acl, function (key, value) {
            var roList = [];
            var rwList = [];
            var denyList = [];
            Ext.each(value[domaintype], function (item, index) {
                switch (item.linux_perm) {
                case 1:
                    denyList.push(item.name);
                    break;
                case 2:
                    roList.push(item.name);
                    break;
                case 3:
                    rwList.push(item.name);
                    break;
                }
            });
            itemContainer.add(Ext.create('DESKTOP.Folder.default.view.FolderMapItem', {
                shareList: {
                    readwriteList: rwList,
                    readonlyList: roList,
                    denyList: denyList,
                    foldername: key,
                    rwIndex: objCount
                }
            }));
            objCount++;
        });
    },
    first_generateMapItem: function (Account_acl, domaintype, index, foldername) {
        var itemContainer = Ext.ComponentQuery.query('#folderACLs')[0]; //item container
        var roList = [];
        var rwList = [];
        var denyList = [];
        Ext.each(Account_acl[domaintype], function (item, index) {
            switch (item.linux_perm) {
            case 1:
                denyList.push(item.name);
                break;
            case 2:
                roList.push(item.name);
                break;
            case 3:
                rwList.push(item.name);
                break;
            }
        });
        if (typeof (itemContainer) !== "undefined") {
            itemContainer.add(Ext.create('DESKTOP.Folder.default.view.FolderMapItem', {
                shareList: {
                    readwriteList: rwList,
                    readonlyList: roList,
                    denyList: denyList,
                    foldername: foldername,
                    rwIndex: index
                }
            }));
        }
    },
    onDomainTypeSelect: function (combobox, record) {
        var vm = this.getViewModel();
        var me = this;
        var domain = '';
        me.currentDomaintype = record.data.value;
        if (record.data.value == "domain") {
            domain = record.data.value + '_' + me.currentDomainuser;
        } else {
            domain = me.currentDomainuser;
        }
        me.Showloadingmask();
        Ext.defer(function () {
            me.generateMapItem(vm.data.Account_acl, domain);
        }, 10);
    },
    ChangeDomainUser: function (view, button) {
        var vm = this.getViewModel();
        var me = this;
        var type = me.getView().down("combo").getValue();
        console.log(vm.data.Account_acl);
        var domain = '';
        switch (button.itemId) {
        case 'user':
            me.currentDomainuser = 'user';
            break;
        case 'group':
            me.currentDomainuser = 'group';
            break;
        default:
            break;
        }
        if (type == "domain") {
            domain = me.currentDomaintype + '_' + me.currentDomainuser;
        } else {
            domain = me.currentDomainuser;
        }
        me.Showloadingmask();
        Ext.defer(function () {
            me.generateMapItem(vm.data.Account_acl, domain);
        }, 10);
    },
    Showloadingmask: function () {
        this.getView().up().mask("Loading");
    },
    Hideloadingmask: function () {
        this.getView().up().unmask();
    }
});
