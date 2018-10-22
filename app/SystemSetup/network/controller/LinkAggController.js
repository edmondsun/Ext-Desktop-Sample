Ext.define('DESKTOP.SystemSetup.network.controller.LinkAggController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.linkagg',
    requires: [
        'DESKTOP.SystemSetup.network.model.LinkAggModel'
    ],
    init: function () {
        var me = this;
        var linkAggModel = Ext.ComponentQuery.query('#Interface')[0].getViewModel('InterfacesModel').getStore('LinkAgg');
        var dataHandle = linkAggModel.getAt(0).getData().LinkAgg;
        var linkAggHandle = me.lookupReference('LinkAggRef');
        var tplHeader = [];
        var linkColumn = dataHandle[0].totalLinkCount;
        var type;
        var i;
        if (dataHandle[0].totalLinkCount !== 0) {
            tplHeader.push({
                "header": "Interfaces(Type)",
                "dataIndex": "Interfaces",
                "align": "center",
                "sortable": false,
                "hideable": false
            }, {
                "header": "Standalone",
                "dataIndex": "Standalone",
                "align": "center",
                "sortable": false,
                "hideable": false,
                "renderer": "get_radio"
            });
        }
        for (i = 0; i < linkColumn; i++) {
            if (dataHandle[0].link[i].types == "no") {
                type = "rr";
            } else {
                type = dataHandle[0].link[i].types;
            }
            tplHeader.push({
                "renderer": "get_radio",
                "header": dataHandle[0].link[i].name,
                "dataIndex": dataHandle[0].link[i].name,
                "align": "center",
                "sortable": false,
                "hideable": false,
                "items": [{
                    "reference": "Link" + (i + 1),
                    "padding": "10 10 0 10",
                    "xtype": "LinkAggType",
                    "name": dataHandle[0].link[i].name,
                    "value": type
                }]
            });
        }
        var store, grid, createGrid, createRadioColumn, dataArrColumn = [],
            lanArr = [];
        createRadioColumn = function (dataHandle) {
            var tmpLanCnt = dataHandle.totalLanCount;
            var tmpLinkCnt = dataHandle.totalLinkCount;
            var rowName;
            var tmpRowLink = {};
            var tmpLinkColumn;
            var tmpSpped;
            for (var i = 0; i < tmpLanCnt; i++) {

            	if (Number(dataHandle.lan[i].speed) >= 1000) {
            		tmpSpped = dataHandle.lan[i].speed/1000 + 'Gbps';
            	}else {
            		tmpSpped = dataHandle.lan[i].speed + 'Mbps';
            	}

            	rowName = dataHandle.lan[i].name + "(" + tmpSpped + ")";
                lanArr.push(rowName);
                for (var j = 0; j < tmpLinkCnt + 1; j++) {
                    tmpRowLink = {
                        "name": dataHandle.lan[i].name,
                        "value": j,
                        "check": ""
                    };
                    lanArr.push(tmpRowLink);
                }

                tmpLinkColumn = dataHandle.lan[i].bond.split("Link")[1] ? dataHandle.lan[i].bond.split("Link")[1] : 0;

                if (Number(tmpLinkColumn) !=0 ) {
                	tmpLinkColumn = Number(tmpLinkColumn);
                } else {
                	tmpLinkColumn = Number(tmpLinkColumn) + 1;
                }
                
                lanArr[tmpLinkColumn].check = "checked";
                dataArrColumn.push(lanArr);
                lanArr = [];
            }
        };
        createGrid = function (columnValue) {
            grid = Ext.create('Ext.grid.Panel', {
                extend: 'Ext.grid.column.Column',
                store: store,
                columns: columnValue,
                width: 1000,
                forceFit: true
            });
        };
        var createStore;
        var fieldArr = [];
        fieldArr = [{
            "name": "Interfaces"
        }, {
            "name": "Standalone"
        }];
        for (i = 0; i < dataHandle[0].totalLinkCount; i++) {
            fieldArr.push({
                "name": dataHandle[0].link[i].name
            });
        }
        createStore = function (fieldValue, dataValue) {
            store = Ext.create('Ext.data.ArrayStore', {
                fields: fieldValue,
                data: dataValue
            });
        };
        createRadioColumn(dataHandle[0]);
        createStore(fieldArr, dataArrColumn);
        createGrid(tplHeader);
        linkAggHandle.add(grid);
    },
    onApply: function () {
        var me = this;
        var win = me.view;
        var form = win.down('form').getForm();
        var gridStore = win.down('grid').getStore();
        var gridNum = win.down('grid').getStore().getCount();
        var lan_params = {};
        var options = [];
        var lan_str;
        var link_str;
        var lan_radio;
        var linkAggModel = Ext.ComponentQuery.query('#Interface')[0].getViewModel('InterfacesModel').getStore('LinkAgg');
        var linkAggHandle = linkAggModel.getAt(0).getData().LinkAgg[0];
        var linkNum = linkAggHandle.totalLinkCount;
        var lanNum  = linkAggHandle.totalLanCount;
        var saveMask = new Ext.LoadMask(me.lookupReference('LinkAggRef'), {
            msg: "Saving..."
        });
        var paramObj = {};
        var i, j, k;
        var tempFors;
        var paramObj = {op: "nic_create_lag"};

        if (form.isValid()) {
            for (i = 1; i <= gridNum; i++) {
                lan_str = 'LAN' + i;
                lan_radio = document.getElementsByName(lan_str);
                for (j = 0; j < lan_radio.length; j++) {
                    if (lan_radio[j].checked === true) {
                        if (lan_radio[j].value !== 0) {
                            lan_params[lan_str] = "Link" + lan_radio[j].value;
                        } else {
                            lan_params[lan_str] = "Standalone";
                        }
                        break;
                    }
                }
            }

            for (var i=1; i <= linkNum; i++) {
            	link_str = 'Link' + i + '_types';
            	paramObj[link_str] = me.lookupReference('Link' + i).value;
            }

            for (var i=1; i <= lanNum; i++) {
            	lan_str = 'Lan' + i + '_bond';
            	paramObj[lan_str] = lan_params['LAN' + i];	
            }

            for (i = 1; i <= gridNum; i++) {
                lan_str = 'LAN' + i;
                lan_radio = document.getElementsByName(lan_str);
                for (j = 0; j < lan_radio.length; j++) {
                    if (lan_radio[j].checked === true) {
                        if (i == 1) {
                            options.push({
                                name: lan_radio[j].value,
                                value: 1
                            });
                        } else {
                            me.search(lan_radio[j].value, options);
                        }
                    }
                    if (i == gridNum && j == (lan_radio.length - 1)) {
                        tempFors = true;
                        for (k = 0; k < options.length; k++) {
                            if (options[k].value == 1 && options[k].name !== 0) {
                                Ext.Msg.alert('Invalid Link', 'Please select more than two lans.');
                                tempFors = false;
                            }
                        }
                    }
                }
            }
            if (tempFors) {
                saveMask.show();
                me.linkAggSubmit(form, paramObj, saveMask, win);
            }
        } else {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },
    search: function (nameKey, myArray) {
        var temp = true;
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].name == nameKey) {
                myArray[i].value++;
                temp = false;
                break;
            }
        }
        if (temp) {
            myArray.push({
                name: nameKey,
                value: 1
            });
        }
    },
    get_radio: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var radio_str = '<input type="radio" name="' + value.name + '" value="' + value.value + '" ' + value.check + ' />';
        return radio_str;
    },
    linkAggSubmit: function (form, paramObj, saveMask, win) {
        form.submit({
            method: 'POST',
            params: paramObj,
            url: 'app/SystemSetup/backend/network/LinkAgg.php',
            waitMsg: 'Saving...',
            success: function (form, action) {
                Ext.Msg.alert('Success', action.result.msg);
                saveMask.destroy();
                win.close();
            },
            failure: function (form, action) {
                Ext.Msg.alert('Failed', action.result.msg);
                saveMask.destroy();
            }
        });
    }
});
