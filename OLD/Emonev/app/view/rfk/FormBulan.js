Ext.define('Admin.view.rfk.FormBulan', {
	extend: 'Ext.form.Panel',xtype:'form-bulan',
	scrollable: 'vertical',
	controller: {xclass: 'Admin.view.rfk.Controller'},jsonSubmit :true,
    bodyPadding: 20,
    fullscreen:true,
	autoSize: true,
	defaults:{labelAlign:'left',clearable : false,labelAlign:'top'},
	items: [
		{xtype: 'selectfield',labelAlign:'left',flex:1,label:'Bulan',name:'tbulan',disabled:true,
							options: [{text:'Januari',value:'1'},
							{text:'Februari',value:'2'},
							{text:'Maret',value:'3'},
							{text:'April',value:'4'}
							,{text:'Mei',value:'5'}
							,{text:'Juni',value:'6'}
							,{text:'Juli',value:'7'}
							,{text:'Agustus',value:'8'}
							,{text:'September',value:'9'}
							,{text:'Oktober',value:'10'}
							,{text:'November',value:'11'}
							,{text:'Desember',value:'12'}],
		},{xtype:'numberfield',label:'Bulan',name:'bulan',hidden:true}							
	],
	buttons: [
		{text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'},
		{xtype:'spacer'},
		{text: 'Proses',ui: "soft-green",shadow:true,handler: 'onBuatLapBulanan',iconCls: 'x-fa fa-save'} 
	]
	
});
