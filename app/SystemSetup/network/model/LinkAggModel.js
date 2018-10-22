Ext.define('DESKTOP.SystemSetup.network.model.LinkAggModel', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.LinkAggType',
    queryMode: 'local',
    valueField: 'value',
    displayField: 'type',
    width: 180,
    editable: false,
    store: {
        fields: [
            'type',
            'value'
        ],
        data: [{
            type: 'Round-robin',
            value: 'rr'
        }, {
            type: 'Active backup',
            value: 'ab'
        }, {
            type: 'Trunking (Layer2)',
            value: 'tl2'
        }, {
            type: 'Trunking (Layer2+3)',
            value: 'tl23'
        }, {
            type: 'Trunking (Layer3+4)',
            value: 'tl34'
        }, {
            type: 'Boardcast',
            value: 'bc'
        }, {
            type: 'LACP (Layer2)',
            value: 'll2'
        }, {
            type: 'LACP (Layer2+3)',
            value: 'll23'
        }, {
            type: 'LACP (Layer3+4)',
            value: 'll34'
        }, {
            type: 'Transmit load balancing',
            value: 'tlb'
        }, {
            type: 'Adaptive load balancing',
            value: 'alb'
        }]
    }
});
