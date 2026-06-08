Ext.define('Admin.view.main.FooterView', {
   extend: 'Ext.Toolbar',
   xtype: 'footerview',
   cls: 'footerview',shadow:true,id:'xMainFooter',margin:'10 20 -10 20',
	items: [
		{ xtype: 'container',cls: 'footerviewtext',html: vNAMA_OPD + ' '+ dateNow},
		{ xtype: 'spacer'},
		{ xtype: 'container',cls: 'footerviewtext',html: 'Emonev v.: ' + appVersion+' (c) BAPPERIDA Kota Tegal'},
		
	]
});
