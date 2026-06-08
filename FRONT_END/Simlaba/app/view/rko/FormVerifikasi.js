Ext.define('Admin.view.rko.FormVerifikasi', {
	extend: 'Ext.form.Panel',xtype:'rko-form-verifikasi-opd',jsonSubmit :true,
	scrollable: true,
	reference: 'formRkoVerifikasiOpd',
    bodyPadding: 15,
	autoSize: true,
    defaults:{clearable : false},
    //viewModel: {xclass: 'Admin.view.rko.ViewModel'},
	controller: {xclass: 'Admin.view.rko.Controller'},
	viewModel: {
        type: 'default',
        data: {
            x: 10,
            y: 10
        }
    },

	
	items: [
			{xtype:"hiddenfield",fieldLabel:"p",name:"id",value:0}, 
			//{xtype:"hiddenfield",fieldLabel:"p",name:"username",value:0}, 
		   {xtype: 'containerfield',layout: 'hbox',
					defaults: {flex: 1,clearable : false},
					items: [
						
					]
			},
			{xtype: 'containerfield',layout: 'hbox', hidden:true,
					defaults: {flex: 1,clearable : false},
					items: [
						{xtype:"numberfield",label:"Jumlah Kegiatan",name:"jk",clearable:false,readOnly:true},
						{xtype:"numberfield",label:"Jumlah Pekerjaan",name:"jp",clearable:false,readOnly:true},
					]
			},
			{xtype:"numberfield",label:"Jumlah Kegiatan tanpa pekerjaan",name:"jk0",clearable:false,readOnly:true,hidden:true},
			
			{xtype:"numberfield",label:"Total Pagu DPA",labelAlign:'top', name:"pagu_kegiatan",clearable:false,readOnly:true,bind: '{x}'},
			{xtype:"numberfield",label:"Total Pagu Pekerjaan",labelAlign:'top',name:"pagu_pekerjaan",clearable:false,readOnly:true,bind: '{y}'},
			{xtype:"numberfield",label:"Selisih",name:"s",labelAlign:'top',clearable:false,readOnly:true,bind: '{x - y}',required: true,},
			{xtype:"numberfield",label:"Target Fisik",labelAlign:'top',name:"rencana_fisik",clearable:false,readOnly:true},
			//{xtype:"numberfield",label:"Target Keuangan s.d Des",name:"des",clearable:false,readOnly:true,minValue:1, required: true,},
			//{xtype:"numberfield",label:"Target Fisik s.d Des",name:"desf",clearable:false,readOnly:true,minValue:1, required: true,},
		   
	],
	buttons: [
        {text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().up().destroy();},destIdx:2,iconCls: 'x-fa fa-window-close'},
        {xtype:'spacer'},
        {text: 'Verifikasi',ui: "soft-green",shadow:true,handler: 'simpanVerifikasiRkoOpd',iconCls: 'x-fa fa-save'} 
    ]
	
});
