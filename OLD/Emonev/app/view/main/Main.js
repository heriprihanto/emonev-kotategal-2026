Ext.define('Admin.view.main.Main', {
    extend: 'Ext.navigation.View',

    requires: [
        'Ext.Button',
        'Ext.list.Tree',
        'Ext.navigation.View'
    ],

    controller: 'main',
    viewModel: {
		type: 'mainviewmodel'
	},
    navigationBar: false,
    cls: 'main-container',
/*
    platformConfig: {
        phone: {
            controller: 'phone-main'
        }
    },
*/
    items: [
	{
        xtype: 'maintoolbar',shadow:true,
        docked: 'top',
        userCls: 'main-toolbar',height:56
        //shadow: true
    }, 
	
	{ xtype: 'footerview', reference: 'footerview', docked: 'bottom', height: 45 },
	],
    listeners: {
        initialize : 'initView'
    }
});