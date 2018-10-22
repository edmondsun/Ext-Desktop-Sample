Ext.define('DESKTOP.Service.timemachine.view.GeneralSetting', {
    extend: 'Ext.form.Panel',
    alias: 'widget.generalsetting',
    requires: [
        'DESKTOP.Service.timemachine.controller.GeneralSettingController',
        'DESKTOP.Service.timemachine.model.GeneralSettingModel'
    ],
    controller: 'generalsetting',
    viewModel: {
        type: 'generalsetting'
    },
    itemId: 'GeneralSetting',
    title: "GeneralSetting",
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    bodyPadding: 20,
    defaults: {
        allowBlank : false,
        blankText : false,
        labelWidth: 100,
        msgTarget: 'side'
    },
    items: [{
        xtype: 'form',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                reference: 'AFP_SETTING_ENABLE',
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable Time Machine support',
                itemId: 'afp_enable',
                name: 'afp_enable',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                inputValue: true,
                uncheckedValue: false
            }]
        },{
           xtype: 'container',
           items: [{
                xtype: 'label',
                text: 'When using the Time Machine function, AFP and Bonjour service will be enabled automatically.' 
            }]
        },{
           xtype: 'container',
           customLayout: 'hlayout', 
           items: [{
                itemId: 'timemachine_name',
                xtype: 'displayfield',
                fieldLabel: 'Display name',
                name: 'name',
                width: 200,
                valueField: 'name',
                displayField: 'name'
           }]
        },{
            
            xtype: 'container',
            customLayout: 'hlayout',
            items: [{
                xtype: 'container',
                customLayout: 'hlayout',
                items: [{
                    xtype: 'label',
                    text: 'Volume name'
                },{
                    itemId: 'pool_name',
                    name: 'pool_name',
                    xtype: 'combobox',
                    width: 200,
                    editable: false,
                    hidden: true,
                    queryMode: 'local',
                    fieldLabel: 'Pool name',
                    valueField: 'pool_name',
                    displayField: 'pool_name'
                },{
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    width: 200,
                    itemId: 'volume_name',
                    reference: 'VOL_NAME_REF',
                    name: 'volume_name',
                    value: 'Select...',
                    valueField: 'name',
                    displayField: 'name',
                    bind: {
                        disabled: '{!AFP_SETTING_ENABLE.checked}'
                    }
                }]
            }]
                   
        },{
           xtype: 'container',
           customLayout: 'hlayout', 
           items: [{
                itemId: 'capacity_gb',
                xtype: 'textfield',
                qDefault: true,
                allowBlank: false,
                msgTarget: 'qtip',
                maskRe: /[\d\.]/,
                regex: /[0-9]/,
                reference: 'CAPACITY_REF',
                fieldLabel: 'Capacity',
                width: 250,
                submitValue:false,
                name: 'capacity_gb',
                hiddenValue: 0,
                value: 0,
                enableKeyEvents: true,
                bind: {
                    disabled: '{!AFP_SETTING_ENABLE.checked}'
                },
                regexText: 'This field size is invalid.'
           },{
                itemId: 'submit_size_mb',
                xtype: 'textfield',
                hidden: true,
                name: 'capacity_mb'
           },{
                itemId: 'vol_unit',
                reference: 'UNIT_REF',
                qDefault: true,
                xtype: 'combobox',
                submitValue:false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['SizeType'],
                    data: [{
                        "SizeType": "TB"
                    },{
                        "SizeType": "GB"
                    }]
                }),
                displayField: 'SizeType',
                value: 'GB',
                width: 60,
                editable: false,
                bind: {
                    disabled: '{!AFP_SETTING_ENABLE.checked}'
                }
           }]
        },{
            x: 0,
            y: 0,
            itemId: 'vol_slider',
            reference: 'SLIDER_REF',
            qDefault: true,
            xtype: 'slider',
            width: 300,
            submitValue:false,
            decimalPrecision : 10,
            minValue: 0,
            bind: {
                disabled: '{!AFP_SETTING_ENABLE.checked}',
                value:    '{vol_trans.showUsed}'
            }
        },{
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    itemId: 'pool_size',
                    qDefault: true,
                    xtype: 'displayfield',
                    fieldLabel: 'Volume size:',
                    hiddenValue: 0,
                    bind: {
                        value: '{vol_trans.total}'
                    }
                },{
                    itemId: 'pool_used',
                    qDefault: true,
                    xtype: 'displayfield',
                    fieldLabel: 'Used:',
                    hiddenValue: 0,
                    bind: {
                        value: '{vol_trans.used}'
                    }
                },{
                    itemId: 'pool_avail',
                    qDefault: true,
                    xtype: 'displayfield',
                    fieldLabel: 'Available:',
                    hiddenValue: 0,
                    bind: {
                        value: '{vol_trans.avail}'
                    }
                }]
            }]                  
        }]
    }]
});
