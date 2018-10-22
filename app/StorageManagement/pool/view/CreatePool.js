// * If tagfield need to be customized *
// Ext.define('DESKTOP.ux.form.field.Tag', {
//     extend: 'Ext.form.field.Tag',
//     alias: 'widget.qsan_tagfield',
//     cls: 'qsan_tagfield',
//     getMultiSelectItemMarkup: function() {
//         var me = this,
//             cssPrefix = Ext.baseCSSPrefix,
//             valueField = me.valueField;

//         if (!me.multiSelectItemTpl) {
//             if (!me.labelTpl) {
//                 me.labelTpl = 'Slot{' + me.displayField + '}';
//             }
//             me.labelTpl = me.getTpl('labelTpl');

//             if (me.tipTpl) {
//                 me.tipTpl = me.getTpl('tipTpl');
//             }

//             me.multiSelectItemTpl = new Ext.XTemplate([
//                 '<tpl for=".">',
//                     '<li data-selectionIndex="{[xindex - 1]}" data-recordId="{internalId}" class="' + me.tagItemCls,
//                     '<tpl if="this.isSelected(values)">',
//                     ' ' + me.tagSelectedCls,
//                     '</tpl>',
//                     '{%',
//                         'values = values.data;',
//                     '%}',
//                     me.tipTpl ? '" data-qtip="{[this.getTip(values)]}">' : '">',
//                     '<div class="' + me.tagItemTextCls + '">{[this.getItemLabel(values)]}</div>',
//                     '<div class="' + me.tagItemCloseCls + '"></div>' ,
//                     '</li>' ,
//                 '</tpl>',
//                 {
//                     isSelected: function(rec) {
//                         return me.selectionModel.isSelected(rec);
//                     },
//                     getItemLabel: function(values) {
//                         return Ext.String.htmlEncode(me.labelTpl.apply(values));
//                     },
//                     getTip: function(values) {
//                         return Ext.String.htmlEncode(me.tipTpl.apply(values));
//                     },
//                     strict: true
//                 }
//             ]);
//         }
//         if (!me.multiSelectItemTpl.isTemplate) {
//             me.multiSelectItemTpl = this.getTpl('multiSelectItemTpl');
//         }

//         return me.multiSelectItemTpl.apply(me.valueCollection.getRange());
//     }
// });
Ext.define('DESKTOP.StorageManagement.pool.view.CreatePool', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    alias: 'view.createpool',
    requires: [
        'DESKTOP.StorageManagement.lib.raidTool',
        'DESKTOP.StorageManagement.pool.model.EncModel'
    ],
    modal: true,
    width: 800,
    height: 600,
    bodyPadding: 20,
    closeAction: 'destroy',
    title: 'Create Pool',
    viewModel: {
        type: 'enc'
    },
    controller: 'pool',
    itemId: 'CreatePool',
    dockedItems: [{
        xtype: 'toolbar',
        qDefault: true,
        dock: 'bottom',
        items: ['->', {
            xtype: 'button',
            qDefault: true,
            text: 'Cancel',
            listeners: {
                click: function() {
                    this.up('window').close();
                }
            }
        }, {
            xtype: 'button',
            itemId: 'createPoolConfirm',
            qDefault: true,
            text: 'Confirm',
            listeners: {
                click: 'onCreatePoolConfirm'
            }
        }]
    }],
    items: [{
        xtype: 'form',
        qDefault: true,
        width: '100%',
        fieldDefaults: {
            labelWidth: 150,
            msgTarget: 'qtip'
        },
        waitMsgTarget: true,
        items: [{
            xtype: 'textfield',
            qDefault: true,
            fieldLabel: 'Pool name',
            name: 'name',
            allowBlank: false,
            validateOnChange: false,
            regex: /^[a-zA-Z]+[a-zA-Z0-9-_.]+$/,
            regexText: 'Pool name only support alphabets and numbers, and must start with an alphabet.'
        }, {
            xtype: 'label',
            qDefault: true,
            text: 'Add a Raid type to create the pool'
        }, {
            xtype: 'combobox',
            qDefault: true,
            itemId: 'enclosurecb',
            editable: false,
            fieldLabel: 'Unit',
            bind: {
                store: '{enclosure_create}'
            },
            queryMode: 'local',
            valueField: 'enc_id',
            displayField: 'enc_name',
            autoLoadOnValue: true,
            //forceSelection: true,
            listeners: {
                select: 'onCreatePoolEnCBSelect'
            }
        }, {
            xtype: 'grid',
            qDefault: true,
            height: 150,
            forceFit: true,
            itemId: 'info',
            bind: {
                store: '{enclosure_grid}'
            },
            viewConfig: {
                loadMask: false,
                markDirty: false
            },
            columns: [{
                xtype: 'checkcolumn',
                qDefault: true,
                //text: 'Choose',
                dataIndex: 'seletion',
                sortable: false,
                
                renderer: function(val, m, rec) {
                    if (rec.get('info') === '')
                        return '';
                    else
                        return (new Ext.ux.CheckColumn()).renderer(val);
                },
                listeners: {
                    checkchange: 'onCreatePoolGridSelect'
                }
            }, {
                text: 'Slot No.',
                dataIndex: 'slot',
                sortable: false
            }, {
                text: 'Size(GB)',
                dataIndex: 'size_gb',
                sortable: false
            }, {
                text: 'Health',
                dataIndex: 'health',
                sortable: false
            }, {
                text: 'Type',
                dataIndex: 'type',
                sortable: false
            }, {
                text: 'Vendor',
                dataIndex: 'vendor',
                sortable: false
            }, {
                text: 'Rate',
                dataIndex: 'rate',
                sortable: false
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            layout: 'hbox',
            items: [{
                xtype: 'combobox',
                qDefault: true,
                itemId: 'raidtypecb',
                bind: {
                    store: '{RAID_type}'
                },
                flex: 1,
                editable: false,
                emptyText : "",
                queryMode: 'local',
                name: 'raid_level',
                valueField: 'raid_level',
                displayField: 'raid_type',
                fieldLabel: 'RAID type',
                listeners: {
                    select: 'onCreatePoolRaidCBSelect'
                }
            }, {
                xtype: 'displayfield',
                qDefault: true,
                flex: 1,
                fieldLabel: 'Estimated capacity:',
                bind: {
                    value: '{total_cap} GB'
                }
                // xtype: 'qsan_tagfield',
                // itemId: 'spare_disk_tg',
                // name: 'spare_disk_tg',
                // flex: 1,
                // fieldLabel: 'Dedicated spare disk',
                // bind: {
                //     store: '{spare_disk}'
                // },
                // selectOnFocus: false,
                // editable: false,
                // displayField: 'slot',
                // valueField: 'pd_id',
                // queryMode: 'local',
                // filterPickList: false,
                // multiSelect: true,
                // collapseOnSelect: false,
                // alwaysOnTop: true,
                // tpl: Ext.create('Ext.XTemplate',
                //     '<ul class="x-list-plain"><tpl for=".">',
                //         '<li role="option" class="x-boundlist-item qsan-list-item">Slot {slot}</li>',
                //     '</tpl></ul>'
                // ),
                // listeners: {
                //     change: function(tgf, newValue, oldValue, eOpts ){
                //         console.log("tgf value is ", tgf.value);
                //         var tgf_value = tgf.value;
                //         var $sel_spare_disk = Ext.ComponentQuery.query('#sel_spare_disk')[0];
                //         if(tgf_value.length === 0 || tgf_value ==='[]'){
                //             console.log("================================================");
                //             $sel_spare_disk.setValue('');
                //             return false;
                //         }
                //         var displayArr = [];
                //         console.log(tgf_value.length);
                //         for(var i  = 0; i < tgf_value.length; i++){
                //             var idx = tgf.getStore().find('pd_id', tgf_value[i]);
                //             var slot = tgf.getStore().getAt(idx).get('slot');
                //             displayArr.push('Slot '+ slot);
                //         }
                //         $sel_spare_disk.setValue(displayArr.join());
                //     }
                // }
            }]
        }, {
            xtype: 'tagfield',
            qDefault: true,
            itemId: 'spare_disk_tg',
            name: 'spare_disk_tg',
            flex: 1,
            fieldLabel: 'Dedicated spare disk',
            emptyText: 'Select',
            bind: {
                store: '{spare_disk}'
            },
            selectOnFocus: false,
            editable: false,
            displayField: 'slot',
            valueField: 'pd_id',
            queryMode: 'local',
            filterPickList: false,
            multiSelect: true,
            collapseOnSelect: false,
            alwaysOnTop: true,
            labelTpl: Ext.create('Ext.XTemplate',
                '<tpl>'+ 'Slot{slot}' +'</tpl>'
            ),
            tpl: Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item qsan-list-item">Slot {slot}</li>',
                '</tpl></ul>'
            ),
            listeners: {
                change: function(tgf, newValue, oldValue, eOpts ){
                    console.log("tgf value is ", tgf.value);
                    var tgf_value = tgf.value;
                    // var $sel_spare_disk = Ext.ComponentQuery.query('#sel_spare_disk')[0];
                    if(tgf_value.length === 0 || tgf_value ==='[]'){
                        console.log("================================================");
                        // $sel_spare_disk.setValue('');
                        return false;
                    }
                    var displayArr = [];
                    console.log(tgf_value.length);
                    for(var i  = 0; i < tgf_value.length; i++){
                        var idx = tgf.getStore().find('pd_id', tgf_value[i]);
                        var slot = tgf.getStore().getAt(idx).get('slot');
                        displayArr.push('Slot '+ slot);
                    }
                    // $sel_spare_disk.setValue(displayArr.join());
                }
            }
        }, {
            xtype: 'container',
            qDefault: true,
            items: [{
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable encryption',
                name: 'enable_encrypt',
                inputValue: true,
                uncheckedValue: false,
                listeners: {
                    change: function(checkbox, isChecked) {
                        var ctn = checkbox.next('container');
                        if (isChecked) {
                            ctn.enable();
                        } else {
                            ctn.disable();
                        }
                    }
                }
            }, {
                xtype: 'container',
                qDefault: true,
                disabled: true,
                items: [{
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'Enter encrypt password',
                    name: 'password',
                    inputType: 'password',
                    allowBlank: false,
                    validateOnChange: false,
                    regex: /^[a-zA-Z0-9!@#$%^&*()_+=?]{8,16}$/,
                    regexText: 'Format Error'
                }, {
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'Re-enter encrypt password',
                    inputType: 'password',
                    allowBlank: false,
                    validateOnChange: false,
                    regex: /^[a-zA-Z0-9!@#$%^&*()_+=?]{8,16}$/,
                    regexText: 'Format Error',
                    validator: function() {
                        var password = this.up('container').down('textfield');
                        var retypePassword = password.next('textfield');
                        if( new String(password.value).valueOf() !== new String(retypePassword.value).valueOf() ){
                            return 'the input password must be the same as above';
                        }else{
                            return true;
                        }
                    }
                }, {
                    xtype: 'container',
                    qDefault: true,
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        qDefault: true,
                        fieldLabel: 'Auto unlock',
                        boxLabel: 'Yes',
                        name: 'auto_unlock',
                        inputValue: true,
                        checked: true
                    }, {
                        xtype: 'radio',
                        qDefault: true,
                        boxLabel: 'No',
                        name: 'auto_unlock',
                        inputValue: false
                    }]
                }]
            }]
        }, {
            xtype: 'checkboxfield',
            qDefault: true,
            boxLabel: 'Enable write cache',
            name: 'write_cache',
            inputValue: 1,
            uncheckedValue: 0
        }]
    }]
});
