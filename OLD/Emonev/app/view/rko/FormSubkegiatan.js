Ext.define('Admin.view.rko.FormSubkegiatan', {
	extend: 'Ext.form.Panel',xtype:'rko-form-subkegiatan-rencana',jsonSubmit :true,
	scrollable: true,
	reference: 'formRkoPekerjaanSubkegiatanRencana',
    bodyPadding: 15,
	autoSize: true,
    defaults:{clearable : false,labelWidth:200,labelAlign:'top'},
    //viewModel: {xclass: 'Admin.view.rko.ViewModel'},
	controller: {xclass: 'Admin.view.rko.Controller'},
	
	items: [
		{xtype:"textfield",label:"ID",name:"idsubkegiatan",required: true,hidden:true},
		{xtype:"textfield",label:"Kode Sub Kegiatan",name:"kode_sub_kegiatan",required: true},
		{xtype:"textfield",label:"Sub Kegiatan",name:"nm_sub_kegiatan",required: true},
		{xtype:"numberfield",label:"Pagu Anggaran",name:"anggaran",required: true},
			
		{xtype: 'combobox',editable:false,label:"Nama PPK",
			name: 'id_ppk',flex:1,queryMode: 'local',
			valueField: 'id',displayField: 'nama',
			store: {
				autoLoad: false,
				fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
				
				proxy: {
					type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'rko/personel',
						reader: {
							type: 'json',
							rootProperty: 'data',
						},
						writer: {
							type: 'json'
						},
	
					},
					sortInfo: {field: 'id', direction: 'ASC'},
			},
			floatedPicker: {},
			listeners: {
				beforequery : 'loadPersonel'
			},
		},

		{xtype: 'combobox',editable:false,label:"Nama PPTK",
			name: 'id_pptk',flex:1,queryMode: 'local',
			valueField: 'id',displayField: 'nama',
			store: {
				autoLoad: false,
				fields: ['id', 'idmisi', 'tujuan','Kd_1','Kd_2','Kd_3'],
				proxy: {
					type: 'rest',cors: true,useDefaultXhrHeader: false,withCredentials: true,
					url: REMOTE_URL + 'rko/personel',
						reader: {
							type: 'json',
							rootProperty: 'data',
						},
						writer: {
							type: 'json'
						}
					},
					sortInfo: {field: 'id', direction: 'ASC'},
			},
			floatedPicker: {},
			listeners: {
				beforequery : 'loadPersonel'
			},
		},

			
	],
	buttons: [
        {text: 'Batal',ui: "soft-red",shadow:true, handler:function(btn){btn.up().up().up().destroy();},destIdx:2,iconCls: 'x-fa fa-window-close'},
        {xtype:'spacer'},
        {text: 'Simpan',ui: "soft-green",shadow:true,handler: 'simpanSubkegiatan',iconCls: 'x-fa fa-save'} 
    ]
	
});
