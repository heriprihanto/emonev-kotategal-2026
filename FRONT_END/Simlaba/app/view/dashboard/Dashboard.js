Ext.define('Admin.view.dashboard.Dashboard', {
    extend: 'Ext.Container',
    xtype: 'dashboard',

    controller: 'dashboard',
    viewModel: {
        type: 'dashboard'
    },

    cls: 'dashboard',
    scrollable: true,bodyPadding: 20,padding: '30 30 30 30',

    defaults: {
        shadow: false
    },

    items: [
        {xtype:'component',fullscreen:true, html:`<iframe width="100%" height="`+iFrameHeight+`" frameborder="0" src="dashboard.html"></iframe>`}
	]
});
