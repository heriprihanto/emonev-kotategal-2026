Ext.define('Admin.view.personel.FormPersonel', {
	extend: 'Ext.form.Panel',xtype:'personel-form',jsonSubmit :true,
	scrollable: 'vertical',
	reference: 'formPejabat',
    bodyPadding: 20,fullscreen:true,
	autoSize: true,
	defaults:{clearable : false},
	//viewModel: {xclass: 'Admin.view.personel.ViewModel'},
	controller: {xclass: 'Admin.view.personel.Controller'},
	items: [
		
			{xtype:"numberfield",fieldLabel:"p",name:"id",value:0,hidden:true},
			{xtype:"numberfield",fieldLabel:"p",name:"id_sub_pd",value:0,hidden:true},
			{xtype:"textfield",label:"NIP :",name:"nip",required: true,listeners: {blur:'onNIpBlur'}},
			{xtype:"textfield",label:"Nama :",name:"nama",required: true,reference: 'nama'},
			{xtype:"textfield",label:"Jabatan :",name:"jabatan",required: true},
			{xtype: 'containerfield',layout: 'hbox',defaults: {flex: 1},
				items: [
					{ xtype: 'selectfield',
						name: 'kedudukan', label: 'Kedudukan  :',
						options: [
						{text:'1.Pengguna Anggaran',value:'1'},
						{text:'2.Kuasa Pengguna Anggaran',value:'2'},
						{text:'3.Pejabat Penatausahaan Keuangan (PPK)',value:'3'},
						{text:'4.Bendahara Pengeluaran',value:'4'},
						{text:'5.Bendahara Penerimaan',value:'5'},
						{text:'6.Pejabat Pelaksana TeknisKegiatan (PPTK)',value:'6'},
						{text:'7.Bendahara Pengeluaran Pembantu',value:'7'},
						{text:'8.Staf Administrasi',value:'8'},
						{text:'9.Pejabat Pembuat Komitmen',value:'9'}
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
			{xtype: 'containerfield',layout: 'hbox',defaults: {flex: 1},
				items: [
					{ xtype: 'selectfield',
						name: 'pangkat', label: 'Golongan  :',
						options: [
							{text:'II/a',value:'II/a'},{text:'II/b',value:'II/b'},{text:'II/c',value:'II/c'},{text:'II/d',value:'II/d'},{text:'III/a',value:'III/a'},{text:'III/b',value:'III/b'},{text:'III/c',value:'III/c'},{text:'III/d',value:'III/d'},{text:'IV/a',value:'IV/a'},{text:'IV/b',value:'IV/b'},{text:'IV/c',value:'IV/c'},{text:'IV/d',value:'IV/d'}
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
			//{xtype: 'checkbox',width:120,name: 'iskepala',label: 'Kepala OPD'}, 
			
			
	],
	buttons: [
		{text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'},
		{xtype:'spacer'},
		{text: 'Simpan',ui: "soft-green",shadow:true,handler: 'simpanData',iconCls: 'x-fa fa-save'} 
	]
	
});
