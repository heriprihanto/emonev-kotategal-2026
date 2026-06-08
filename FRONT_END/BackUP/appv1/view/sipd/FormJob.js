Ext.define('Admin.view.job.FormJob', {
	extend: 'Ext.form.Panel',xtype:'sipd-job-form',jsonSubmit :true,
	scrollable: 'vertical',
	reference: 'formPejabat',
    bodyPadding: 20,fullscreen:true,
	autoSize: true,
	defaults:{clearable : false},
	//viewModel: {xclass: 'Admin.view.personel.ViewModel'},
	//controller: {xclass: 'Admin.view.personel.Controller'},
	items: [
		
			{xtype:"numberfield",fieldLabel:"p",name:"id",value:0,hidden:true},
			
			{xtype: 'containerfield',layout: 'hbox',defaults: {flex: 1},
				items: [
					{ xtype: 'selectfield',labelAlign: 'top',
						name: 'jobname', label: 'Modul Data Yang Akan Di Tarik:',
						options: [
						{text:'RPJPD',value:'rpjpd'},
						{text:'RPJMD',value:'rpjmd'},
						{text:'RENSTRA',value:'renstra'},
						{text:'RKPD',value:'rkpd_task'},
						{text:'APBD',value:'apbd'},
						],required: true
					},	
					/*
					{ xtype: 'selectfield',margin: '0 20 0 0',width:400,
						name: 'id_jab', label: 'Jbt. dlm. Tim  :',
						options: [
						{text:'Pengguna Anggaran',value:'1'},{text:'Kuasa Pengguna Anggaran',value:'2'},{text:'Pejabat Pembuat Komitmen',value:'3'},{text:'Pejabat Pelaksana Teknis Kegiatan',value:'4'},{text:'Bendahara Pengeluaran',value:'5'}
						],required: true
					},*/					
					]
			},
			
	],
	buttons: [
		{text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'},
		{xtype:'spacer'},
		{text: 'Proses',ui: "soft-green",shadow:true,handler: 'prosesJob',iconCls: 'x-fa fa-save'} 
	]
	
});
