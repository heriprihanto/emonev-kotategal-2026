Ext.define('Admin.view.dashboard.Grafik', {
    extend: 'Ext.Panel',
    xtype: 'grafik',

    requires: [
        'Ext.Responsive'
    ],

    height: 380,

    platformConfig: {
        phone: {
            height: 300
        }
    },

    bodyPadding: 15,
    layout: 'vbox',
//    title: 'Network',

    

    items: [
        ]
});