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
			{xtype:"textfield",label:"NIP :",name:"username",required: true,
			listeners: {
				blur: function(field) {
					field.setValue(field.getValue().replace(/[^0-9]/g, ''));
				}
			}},
			{xtype:"textfield",label:"Nama :",name:"display_name",required: true,reference: 'nama'},
			
			{ xtype: 'selectfield',name: 'role_id',label: 'Hak Akses :',
				options: [
					{text:'Kepala Bidang / Setara Kabid',value:5},
					{text:'Kepala Sub Bidang / Setara Kasubbid',value:6},
					{text:'Staf',value:7},
				
				],
			},
			{xtype:"textfield",label:"Jabatan :",name:"jabatan",required: true},
			
			{xtype: 'containerfield',layout: 'hbox',defaults: {flex: 1},
				items: [
					{ xtype: 'selectfield',
						name: 'gol', label: 'Golongan  :',
						options: [
							{text:'II/a',value:'II/a'},{text:'II/b',value:'II/b'},{text:'II/c',value:'II/c'},{text:'II/d',value:'II/d'},{text:'III/a',value:'III/a'},{text:'III/b',value:'III/b'},{text:'III/c',value:'III/c'},{text:'III/d',value:'III/d'},{text:'IV/a',value:'IV/a'},{text:'IV/b',value:'IV/b'},{text:'IV/c',value:'IV/c'},{text:'IV/d',value:'IV/d'}
						],required: true
					},	
				]	
			},
			{xtype:'textfield',label:'No. HP',name:'no_telp'},
			{xtype:'textfield',label:'Email',name:'email'},
			
			{ xtype: 'selectfield',name: 'active',label: 'Status :',
				options: [
				{text:'Tidak Aktif',value:0},
				{text:'Aktif',value:1}
				
				],
			},
			{xtype: 'combobox',label: '<b>OPD : </b>',placeholder: 'OPD ...', name: 'opds',queryMode: 'local',valueField: 'id_sub_pd', displayField: 'nama_pd',
				striped: true,multiSelect:true,
				store: {autoLoad: true,fields: ['id', 'tag'],
					proxy: {
						type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
						url: REMOTE_URL + 'pengguna/ref-opd',
						reader: { type: 'json' },
					}
				},
			},
			
			
	],
	buttons: [
		{text: 'Batal',ui: "soft-red",shadow:true,handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'},
		{xtype:'spacer'},
		{text: 'Simpan',ui: "soft-green",shadow:true,handler: 'simpanData',iconCls: 'x-fa fa-save'} 
	]
	
});
