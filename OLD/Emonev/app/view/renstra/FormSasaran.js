Ext.define('Admin.view.renstra.FormSasaran', {
	extend: 'Ext.form.Panel',xtype:'renstra-form-sasaran',
	scrollable: 'vertical',
	//reference: 'formElemenDataPerencanaan',
	controller: {xclass: 'Admin.view.renstra.Controller'},
    bodyPadding: 20,fullscreen:true,
	autoSize: true,
	defaults:{clearable : false},
	items: [
	
			{xtype:"textfield",fieldLabel:"p",name:"id",value:''},
			{xtype:"textfield",label:"tahap",name:"kd_tahap",value:0},
			{xtype:"textfield",label:"pd",name:"id_sub_pd",value:0},
			{xtype:"hiddenfield",fieldLabel:"p",name:"mform",value:'sasaran'},
			{xtype:"containerfield",items:[
				{xtype: 'numberfield',name: 'kd_tujuan',label: 'Kode Tujuan',required:true,width:200,readOnly:true},
				{xtype: 'numberfield',name: 'kd_sasaran',label: 'Kode Sasaran',required:true,width:200,margin:'0 0 0 20'},
			]},
			
			{xtype: 'textareafield',name: 'sasaran',label: 'Sasaran',required:true},
			
			
			{xtype: 'textareafield',name: 'keterangan',required:true,label: 'Keterangan'},

		
	],
	buttons: [
	{text: 'Batal',ui: "decline",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'}
	,{xtype:'spacer'}
	,{text: 'Simpan',ui: "action",handler: 'simpanData',iconCls: 'x-fa fa-save'} 
]
	
});
