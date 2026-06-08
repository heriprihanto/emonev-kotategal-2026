Ext.define('Admin.view.auth.AuthBase', {
    extend: 'Ext.Panel',
    

    requires: [
        'Ext.layout.VBox'
    ],

    baseCls: 'auth-locked',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    }
});