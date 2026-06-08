Ext.define('Admin.view.pengaturan.FormHakAkses', {
	extend: 'Ext.form.Panel',xtype:'form-hak-akses-user',
	scrollable: 'vertical',
	controller: {xclass: 'Admin.view.pengaturan.Controller'},jsonSubmit :true,
    bodyPadding: 20,
    fullscreen:true,
	autoSize: true,
	defaults:{labelAlign:'left',clearable : false},
	items: [
		{xtype:'hiddenfield',label:'ID',name:'id'},	
		{xtype:'textfield',label:'Username',name:'username'},
		{xtype:'textfield',label:'Nama',name:'display_name'},
		{xtype:'textfield',label:'No. HP',name:'no_telp'},
		{xtype:'textfield',label:'Email',name:'email'},
		{ xtype: 'selectfield',name: 'active',label: 'Status :',
			options: [
			  {text:'Tidak Aktif',value:0},
			  {text:'Aktif',value:1}
			  
			],
		},
		{ xtype: 'selectfield',name: 'role_id',label: 'Hak Akses :',
			options: [
				{text:'User OPD - Operator',value:4},
				{text:'User OPD - PPTK',value:5},
			  //{text:'Super Admin',value:1},
			  {text:'Admin',value:2},
			  {text:'Admin Bidang',value:3},
			  
			  
			],
		},
		{ xtype: 'selectfield',name: 'apps',label: 'Hak Akses Aplikasi:',multiSelect:true,
			options: [
			  {text:'eMonev',value:'emonev'},
			  {text:'Simlaba',value:'elaba'},
			  {text:'ePlanning',value:'eplanning'}
			  
			],
		},
			
		{xtype: 'combobox',label: '<b>OPD : </b>',placeholder: 'OPD ...', name: 'opds',queryMode: 'local',valueField: 'id_sub_pd', displayField: 'nama_pd',
			striped: true,multiSelect:true,
			store: {autoLoad: true,fields: ['id', 'tag'],
				proxy: {
					type: 'rest', cors: true, useDefaultXhrHeader: false, withCredentials: true,
					url: REMOTE_URL + 'pengaturan/ref-opd',
					reader: { type: 'json' },
				}
			},
		},
					
	],
	buttons: [
		{text: 'Tutup',ui: "soft-red",handler:function(btn){btn.up().up().up().destroy();},iconCls: 'x-fa fa-window-close'},
		{xtype:'spacer'},
		{text: 'Simpan',ui: "soft-green",handler: 'simpanUser',iconCls: 'x-fa fa-save'} 
	]
	
});
