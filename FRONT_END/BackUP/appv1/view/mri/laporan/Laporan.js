Ext.define('Admin.view.mri.laporan.Laporan', {
    extend: 'Ext.Container',
    xtype: 'mri-laporan',

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
        {xtype:'component',html:"CEE 1 A"}
        //{xtype:'component',fullscreen:true, html:`<iframe width="100%" height="`+iFrameHeight+`" frameborder="0" src="dashboard.html"></iframe>`}
	]
});
