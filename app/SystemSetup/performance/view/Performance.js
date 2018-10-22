Ext.define('DESKTOP.SystemSetup.performance.view.Performance', {
    extend: 'Ext.form.Panel',
    alias: 'widget.performance',
    requires: [
        'DESKTOP.SystemSetup.performance.controller.PerformanceController',
        'DESKTOP.SystemSetup.performance.model.PerformanceModel'
    ],
    controller: 'performance',
    viewModel: {
        type: 'performance'
    },
    itemId: 'Performance',
    title: "Performance tuning",
    frame: true,
    //bodyPadding : 20,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    width: 750,
    fieldDefaults: {
        //labelWidth : 150,
        msgTarget: 'qtip'
    },
    trackResetOnLoad: true,
    items: [{
        xtype: 'container',
        qDefault: true,
        customLayout: 'vlayout',
        width: '100%',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Application mode',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Select application mode for better efficiency. Each mode is optimized for specified application.'
            }]
        }, {
            xtype: 'radiogroup',
            qDefault: true,
            layout: 'vbox',
            width: '100%',
            items: [{
                xtype: 'radiofield',
                qDefault: true,
                boxLabel: 'Default',
                name: 'mode',
                inputValue: 0
            }, {
                xtype: 'container',
                width: '100%',
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    value: 'Default for generic file service or backup usage. Please select default setting if you are not sure what application you are using',
                    indentLevel: 1
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'splitter'
            }, {
                xtype: 'radiofield',
                qDefault: true,
                boxLabel: 'Video streaming',
                name: 'mode',
                inputValue: 1
            }, {
                xtype: 'container',
                qDefault: true,
                width: '100%',
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    indentLevel: 1,
                    value: 'Enabling video streaming will optimize IOPS for small packets of sequential read/write and throughput for large packets of random. But the performance might have a little drop in large sequential packets. In the overall effect is benefit for video streaming application.'
                }]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'splitter'
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'image',
                qDefault: true,
                src: '/img/app_mode_seq_iops.jpg',
                height: 170
            }, {
                xtype: 'image',
                qDefault: true,
                src: '/img/app_mode_rand_throughput.jpg',
                height: 170
            }]
        }]
    }]
});
