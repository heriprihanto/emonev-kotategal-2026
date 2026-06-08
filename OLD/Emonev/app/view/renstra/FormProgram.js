Ext.define('Admin.view.renstra.FormProgram', {
	extend: 'Ext.form.Panel',xtype:'renstra-form-program',
	scrollable: 'vertical',
	//reference: 'formElemenDataPerencanaan',
	controller: {xclass: 'Admin.view.renstra.Controller'},
    bodyPadding: 20,fullscreen:true,
	autoSize: true,
	defaults:{clearable : false},
	items: [
		
		{xtype:"hiddenfield",fieldLabel:"p",name:"id",value:''},
		{xtype:"hiddenfield",label:"tahap",name:"kd_tahap",value:0},
		{xtype:"hiddenfield",label:"pd",name:"id_sub_pd",value:0},
		{xtype:"hiddenfield",fieldLabel:"p",name:"mform",value:'program'},
		{xtype:"containerfield",items:[
			{xtype: 'numberfield',name: 'kd_tujuan',label: 'Kode Tujuan',required:true,width:200,readOnly:true},
			{xtype: 'numberfield',name: 'kd_sasaran',label: 'Kode Sasaran',required:true,width:200,margin:'0 0 0 20'},
		]},
		{xtype:"textfield",label:"Sasaran",name:"sasaran"},
		{xtype:"textfield",label:"Program",name:"programs"},
			
		{xtype: "renstra-list-program-opd",height:300},
	
		
	],
	buttons: [
	{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'}
	,{xtype:'spacer'}
	,{text: 'Simpan',ui: "action",handler: 'simpanData',iconCls: 'x-fa fa-save'} 
]
	
});
